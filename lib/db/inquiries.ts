import { query } from "@/lib/db"

export type InquiryStatus = "pending" | "in_progress" | "completed" | "rejected"

export interface Inquiry {
  id: number
  category_id: number | null
  name: string
  phone: string
  email: string | null
  organization: string | null
  title: string
  content: string
  status: InquiryStatus
  admin_id: number | null
  admin_note: string | null
  processed_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface InquiryWithDetails extends Inquiry {
  category_name: string | null
  category_slug: string | null
  admin_name: string | null
}

export interface InquiryCategory {
  id: number
  slug: string
  name: string
  sort_order: number
}

/**
 * Get all inquiry categories
 */
export async function getInquiryCategories(): Promise<InquiryCategory[]> {
  const result = await query<InquiryCategory>(
    `SELECT id, slug, name, sort_order FROM inquiry_categories ORDER BY sort_order`
  )
  return result.rows
}

/**
 * Create a new inquiry
 */
export async function createInquiry(data: {
  categorySlug: string
  name: string
  phone: string
  email?: string
  organization?: string
  title: string
  content: string
}): Promise<number> {
  // Get category ID from slug
  const categoryResult = await query<{ id: number }>(
    `SELECT id FROM inquiry_categories WHERE slug = $1`,
    [data.categorySlug]
  )
  const categoryId = categoryResult.rows[0]?.id || null

  const result = await query<{ id: number }>(
    `INSERT INTO inquiries (category_id, name, phone, email, organization, title, content)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      categoryId,
      data.name,
      data.phone,
      data.email || null,
      data.organization || null,
      data.title,
      data.content,
    ]
  )

  return result.rows[0].id
}

/**
 * Get all inquiries with details (admin view)
 */
export async function getAllInquiries(filters?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ inquiries: InquiryWithDetails[]; total: number }> {
  try {
    const baseQuery = `
      FROM inquiries i
      LEFT JOIN inquiry_categories ic ON ic.id = i.category_id
      LEFT JOIN admin_users au ON au.id = i.admin_id
      WHERE 1=1
    `
    
    let countSql = `SELECT COUNT(*) as total ${baseQuery}`
    let sql = `SELECT i.*, ic.name as category_name, ic.slug as category_slug, au.name as admin_name ${baseQuery}`
    const params: unknown[] = []
    let paramIndex = 1

    if (filters?.status && filters.status !== "all") {
      const condition = ` AND i.status = $${paramIndex}`
      countSql += condition
      sql += condition
      params.push(filters.status)
      paramIndex++
    }

    if (filters?.search) {
      const searchPattern = `%${filters.search}%`
      const condition = ` AND (i.name ILIKE $${paramIndex} OR i.title ILIKE $${paramIndex} OR i.content ILIKE $${paramIndex} OR ic.name ILIKE $${paramIndex})`
      countSql += condition
      sql += condition
      params.push(searchPattern)
      paramIndex++
    }

    sql += ` ORDER BY CASE i.status
      WHEN 'pending' THEN 0
      WHEN 'in_progress' THEN 1
      WHEN 'completed' THEN 2
      WHEN 'rejected' THEN 3
    END, i.created_at DESC`

    const countParams = [...params]

    if (filters?.limit) {
      sql += ` LIMIT $${paramIndex}`
      params.push(filters.limit)
      paramIndex++
    }

    if (filters?.offset) {
      sql += ` OFFSET $${paramIndex}`
      params.push(filters.offset)
    }

    const [dataResult, countResult] = await Promise.all([
      query<InquiryWithDetails>(sql, params),
      query<{ total: string }>(countSql, countParams),
    ])

    return {
      inquiries: dataResult.rows,
      total: parseInt(countResult.rows[0]?.total || "0", 10),
    }
  } catch {
    return { inquiries: [], total: 0 }
  }
}

/**
 * Get single inquiry by ID
 */
export async function getInquiryById(id: number): Promise<InquiryWithDetails | null> {
  try {
    const result = await query<InquiryWithDetails>(
      `SELECT i.*, ic.name as category_name, ic.slug as category_slug, au.name as admin_name
       FROM inquiries i
       LEFT JOIN inquiry_categories ic ON ic.id = i.category_id
       LEFT JOIN admin_users au ON au.id = i.admin_id
       WHERE i.id = $1`,
      [id]
    )
    return result.rows[0] || null
  } catch {
    return null
  }
}

/**
 * Update inquiry status (admin function)
 */
export async function updateInquiryStatus(
  adminId: number,
  inquiryId: number,
  newStatus: InquiryStatus,
  note?: string
): Promise<boolean> {
  try {
    const processedAt = (newStatus === "completed" || newStatus === "rejected") ? new Date() : null
    
    await query(
      `UPDATE inquiries SET
        status = $1,
        admin_id = $2,
        admin_note = $3,
        processed_at = $4,
        updated_at = NOW()
      WHERE id = $5`,
      [newStatus, adminId, note || null, processedAt, inquiryId]
    )
    
    // Audit log
    await query(
      `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
       VALUES ($1, 'inquiry.process', 'inquiry', $2, $3)`,
      [adminId, inquiryId, JSON.stringify({ status: newStatus, note })]
    )
    
    return true
  } catch (err) {
    console.error("[DB] Update inquiry error:", err)
    return false
  }
}

/**
 * Get inquiry counts by status
 */
export async function getInquiryCounts(): Promise<Record<string, number>> {
  try {
    const result = await query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM inquiries GROUP BY status`
    )
    
    const counts: Record<string, number> = {
      all: 0,
      pending: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0,
    }

    result.rows.forEach((row) => {
      counts[row.status] = parseInt(row.count, 10)
      counts.all += parseInt(row.count, 10)
    })

    return counts
  } catch {
    return { all: 0, pending: 0, in_progress: 0, completed: 0, rejected: 0 }
  }
}
