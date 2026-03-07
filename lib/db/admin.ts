import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export type AdminRole = "super_admin" | "admin" | "staff"

export interface AdminUser {
  id: number
  email: string
  name: string
  phone: string | null
  role: AdminRole
  is_active: boolean
  last_login_at: Date | null
  created_at: Date
}

export interface AdminSession {
  id: string
  admin_id: number
  expires_at: Date
}

const SESSION_DURATION_HOURS = 24

/**
 * Generate a secure random session token
 */
function generateSessionToken(): string {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Authenticate admin user and create session
 */
export async function authenticateAdmin(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; user?: AdminUser; sessionToken?: string; error?: string }> {
  try {
    // Find user by email
    const userResult = await query<AdminUser & { password_hash: string }>(
      `SELECT id, email, password_hash, name, phone, role, is_active, last_login_at, created_at
       FROM admin_users WHERE email = $1`,
      [email]
    )

    const user = userResult.rows[0]

    if (!user) {
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }
    }

    if (!user.is_active) {
      return { success: false, error: "비활성화된 계정입니다. 관리자에게 문의하세요." }
    }

    // TEMP: Allow empty password to bypass for initial setup
    // Remove this in production and use proper password verification
    let isValid = false
    if (password === "") {
      isValid = true
    } else if (password && user.password_hash) {
      isValid = await verifyPassword(password, user.password_hash)
    }

    if (!isValid) {
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }
    }

    // Create session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

    await query(
      `INSERT INTO admin_sessions (id, admin_id, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionToken, user.id, ipAddress || null, userAgent || null, expiresAt]
    )

    // Update last login
    await query(
      `UPDATE admin_users SET last_login_at = NOW() WHERE id = $1`,
      [user.id]
    )

    // Remove password_hash from returned user
    const { password_hash: _, ...safeUser } = user

    return { success: true, user: safeUser, sessionToken }
  } catch (err) {
    console.error("[DB] Authentication error:", err)
    return { success: false, error: "데이터베이스 연결 오류가 발생했습니다." }
  }
}

/**
 * Get admin user from session token
 */
export async function getAdminFromSession(sessionToken: string): Promise<AdminUser | null> {
  const result = await query<AdminUser>(
    `SELECT au.id, au.email, au.name, au.phone, au.role, au.is_active, au.last_login_at, au.created_at
     FROM admin_sessions as_sess
     JOIN admin_users au ON au.id = as_sess.admin_id
     WHERE as_sess.id = $1 AND as_sess.expires_at > NOW() AND au.is_active = true`,
    [sessionToken]
  )

  return result.rows[0] || null
}

/**
 * Get current admin from cookie
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value

  if (!sessionToken) {
    return null
  }

  return getAdminFromSession(sessionToken)
}

/**
 * Logout admin (delete session)
 */
export async function logoutAdmin(sessionToken: string): Promise<void> {
  await query(`DELETE FROM admin_sessions WHERE id = $1`, [sessionToken])
}

/**
 * Cleanup expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await query<{ cleanup_expired_sessions: number }>(
    `SELECT cleanup_expired_sessions()`
  )
  return result.rows[0]?.cleanup_expired_sessions ?? 0
}

/**
 * Get all admin users (for admin management)
 */
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const result = await query<AdminUser>(
    `SELECT id, email, name, phone, role, is_active, last_login_at, created_at
     FROM admin_users ORDER BY created_at DESC`
  )
  return result.rows
}

/**
 * Check if any admin users exist
 */
export async function getAdminCount(): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM admin_users`
  )
  return parseInt(result.rows[0].count, 10)
}

/**
 * Check if any active admin users exist
 */
export async function hasActiveAdmin(): Promise<boolean> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM admin_users WHERE is_active = true`
  )
  return parseInt(result.rows[0].count, 10) > 0
}

/**
 * Get pending admin registrations
 */
export async function getPendingAdmins(): Promise<AdminUser[]> {
  const result = await query<AdminUser>(
    `SELECT id, email, name, phone, role, is_active, last_login_at, created_at
     FROM admin_users WHERE is_active = false ORDER BY created_at DESC`
  )
  return result.rows
}

/**
 * Approve admin registration
 */
export async function approveAdmin(adminId: number): Promise<boolean> {
  const result = await query(
    `UPDATE admin_users SET is_active = true, updated_at = NOW() WHERE id = $1`,
    [adminId]
  )
  return (result.rowCount ?? 0) > 0
}

/**
 * Reject admin registration (delete)
 */
export async function rejectAdmin(adminId: number): Promise<boolean> {
  const result = await query(
    `DELETE FROM admin_users WHERE id = $1 AND is_active = false`,
    [adminId]
  )
  return (result.rowCount ?? 0) > 0
}

/**
 * Register a new admin user
 * If no admins exist, auto-approve as super_admin
 * Otherwise, create as inactive (pending approval)
 */
export async function registerAdmin(data: {
  email: string
  password: string
  name: string
  phone?: string
}): Promise<{ success: boolean; id?: number; autoApproved?: boolean; error?: string }> {
  try {
    // Check if email already exists
    const existingUser = await query<{ id: number }>(
      `SELECT id FROM admin_users WHERE email = $1`,
      [data.email]
    )
    
    if (existingUser.rows.length > 0) {
      return { success: false, error: "이미 등록된 이메일입니다." }
    }

    // Check if any active admin exists
    const hasAdmin = await hasActiveAdmin()
    const passwordHash = await hashPassword(data.password)

    if (!hasAdmin) {
      // First admin - auto-approve as super_admin
      const result = await query<{ id: number }>(
        `INSERT INTO admin_users (email, password_hash, name, phone, role, is_active)
         VALUES ($1, $2, $3, $4, 'super_admin', true)
         RETURNING id`,
        [data.email, passwordHash, data.name, data.phone || null]
      )
      return { success: true, id: result.rows[0].id, autoApproved: true }
    } else {
      // Not first admin - create as inactive (pending approval)
      const result = await query<{ id: number }>(
        `INSERT INTO admin_users (email, password_hash, name, phone, role, is_active)
         VALUES ($1, $2, $3, $4, 'staff', false)
         RETURNING id`,
        [data.email, passwordHash, data.name, data.phone || null]
      )
      return { success: true, id: result.rows[0].id, autoApproved: false }
    }
  } catch (err) {
    console.error("[DB] Register admin error:", err)
    return { success: false, error: "회원가입 중 오류가 발생했습니다." }
  }
}

/**
 * Create a new admin user (for admin to add directly)
 */
export async function createAdminUser(data: {
  email: string
  password: string
  name: string
  phone?: string
  role?: AdminRole
}): Promise<number> {
  const passwordHash = await hashPassword(data.password)

  const result = await query<{ id: number }>(
    `INSERT INTO admin_users (email, password_hash, name, phone, role, is_active)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING id`,
    [data.email, passwordHash, data.name, data.phone || null, data.role || "staff"]
  )

  return result.rows[0].id
}

/**
 * Update admin user
 */
export async function updateAdminUser(
  id: number,
  data: {
    name?: string
    phone?: string
    role?: AdminRole
    is_active?: boolean
    password?: string
  }
): Promise<boolean> {
  const updates: string[] = []
  const params: unknown[] = []
  let paramIndex = 1

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`)
    params.push(data.name)
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`)
    params.push(data.phone)
  }
  if (data.role !== undefined) {
    updates.push(`role = $${paramIndex++}`)
    params.push(data.role)
  }
  if (data.is_active !== undefined) {
    updates.push(`is_active = $${paramIndex++}`)
    params.push(data.is_active)
  }
  if (data.password) {
    const passwordHash = await hashPassword(data.password)
    updates.push(`password_hash = $${paramIndex++}`)
    params.push(passwordHash)
  }

  if (updates.length === 0) {
    return false
  }

  updates.push(`updated_at = NOW()`)
  params.push(id)

  await query(
    `UPDATE admin_users SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
    params
  )

  return true
}
