import { query } from "@/lib/db"

export interface Program {
  id: number
  slug: string
  title: string
  subtitle: string | null
  number: string
  description: string | null
  short_description: string | null
  duration: string | null
  max_capacity: number
  price: number
  image_url: string | null
  location_type: string
  is_active: boolean
  created_at: Date
  updated_at: Date
  schedule_count?: number
  reservation_count?: number
  total_participants?: number
}

export interface Location {
  id: number
  slug: string
  name: string
  address: string | null
  phone: string | null
  description: string | null
  image_url: string | null
  operating_hours: string | null
  contact_email: string | null
  is_active: boolean
  created_at: Date
  schedule_count?: number
  reservation_count?: number
  total_participants?: number
}

export interface Holiday {
  id: number
  holiday_date: Date
  name: string | null
  description: string | null
  is_recurring: boolean
  location_id: number | null
  location_name?: string | null
  created_by: number | null
  created_at: Date
}

/**
 * Get all programs with stats (admin view)
 */
export async function getAllProgramsAdmin(): Promise<Program[]> {
  const result = await query<Program>(
    `SELECT p.*,
       COALESCE((SELECT COUNT(*) FROM program_schedules ps WHERE ps.program_id = p.id), 0) as schedule_count,
       COALESCE((SELECT COUNT(*) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.program_id = p.id), 0) as reservation_count,
       COALESCE((SELECT SUM(r.participants) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.program_id = p.id), 0) as total_participants
     FROM programs p
     ORDER BY p.number ASC, p.created_at DESC`
  )
  return result.rows
}

/**
 * Get a single program by ID
 */
export async function getProgramById(id: number): Promise<Program | null> {
  const result = await query<Program>(
    `SELECT p.*,
       COALESCE((SELECT COUNT(*) FROM program_schedules ps WHERE ps.program_id = p.id), 0) as schedule_count,
       COALESCE((SELECT COUNT(*) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.program_id = p.id), 0) as reservation_count,
       COALESCE((SELECT SUM(r.participants) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.program_id = p.id), 0) as total_participants
     FROM programs p
     WHERE p.id = $1`,
    [id]
  )
  return result.rows[0] || null
}

/**
 * Create or update a program
 */
export async function upsertProgram(
  adminId: number,
  data: Partial<Program>
): Promise<number> {
  let programId: number
  
  if (data.id) {
    // Update existing program
    await query(
      `UPDATE programs SET
        slug = COALESCE($1, slug),
        title = COALESCE($2, title),
        subtitle = COALESCE($3, subtitle),
        number = COALESCE($4, number),
        description = COALESCE($5, description),
        short_description = COALESCE($6, short_description),
        duration = COALESCE($7, duration),
        max_capacity = COALESCE($8, max_capacity),
        price = COALESCE($9, price),
        image_url = COALESCE($10, image_url),
        location_type = COALESCE($11, location_type),
        is_active = COALESCE($12, is_active),
        updated_at = NOW()
      WHERE id = $13`,
      [
        data.slug, data.title, data.subtitle, data.number,
        data.description, data.short_description, data.duration,
        data.max_capacity, data.price, data.image_url,
        data.location_type, data.is_active, data.id
      ]
    )
    programId = data.id
  } else {
    // Create new program
    const result = await query<{ id: number }>(
      `INSERT INTO programs (slug, title, subtitle, number, description, short_description, duration, max_capacity, price, image_url, location_type, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        data.slug || '', data.title || '', data.subtitle, data.number || '',
        data.description, data.short_description, data.duration,
        data.max_capacity || 20, data.price || 0, data.image_url,
        data.location_type || 'indoor_outdoor', data.is_active ?? true
      ]
    )
    programId = result.rows[0].id
  }
  
  // Audit log
  await query(
    `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
     VALUES ($1, $2, 'program', $3, $4)`,
    [adminId, data.id ? 'program.update' : 'program.create', programId, JSON.stringify(data)]
  )
  
  return programId
}

/**
 * Toggle program active status
 */
export async function toggleProgramActive(adminId: number, programId: number, isActive: boolean): Promise<boolean> {
  await query(
    `UPDATE programs SET is_active = $1, updated_at = NOW() WHERE id = $2`,
    [isActive, programId]
  )
  await query(
    `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
     VALUES ($1, 'program.toggle_active', 'program', $2, $3)`,
    [adminId, programId, JSON.stringify({ is_active: isActive })]
  )
  return true
}

/**
 * Get all locations with stats (admin view)
 */
export async function getAllLocationsAdmin(): Promise<Location[]> {
  const result = await query<Location>(
    `SELECT l.*,
       COALESCE((SELECT COUNT(*) FROM program_schedules ps WHERE ps.location_id = l.id), 0) as schedule_count,
       COALESCE((SELECT COUNT(*) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.location_id = l.id), 0) as reservation_count,
       COALESCE((SELECT SUM(r.participants) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.location_id = l.id), 0) as total_participants
     FROM locations l
     ORDER BY l.name ASC`
  )
  return result.rows
}

/**
 * Get a single location by ID
 */
export async function getLocationById(id: number): Promise<Location | null> {
  const result = await query<Location>(
    `SELECT l.*,
       COALESCE((SELECT COUNT(*) FROM program_schedules ps WHERE ps.location_id = l.id), 0) as schedule_count,
       COALESCE((SELECT COUNT(*) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.location_id = l.id), 0) as reservation_count,
       COALESCE((SELECT SUM(r.participants) FROM reservations r 
         JOIN program_schedules ps ON ps.id = r.schedule_id WHERE ps.location_id = l.id), 0) as total_participants
     FROM locations l
     WHERE l.id = $1`,
    [id]
  )
  return result.rows[0] || null
}

/**
 * Create or update a location
 */
export async function upsertLocation(
  adminId: number,
  data: Partial<Location>
): Promise<number> {
  let locationId: number
  
  if (data.id) {
    // Update existing location
    await query(
      `UPDATE locations SET
        slug = COALESCE($1, slug),
        name = COALESCE($2, name),
        address = COALESCE($3, address),
        phone = COALESCE($4, phone),
        description = COALESCE($5, description),
        image_url = COALESCE($6, image_url),
        operating_hours = COALESCE($7, operating_hours),
        contact_email = COALESCE($8, contact_email),
        is_active = COALESCE($9, is_active)
      WHERE id = $10`,
      [
        data.slug, data.name, data.address, data.phone,
        data.description, data.image_url, data.operating_hours,
        data.contact_email, data.is_active, data.id
      ]
    )
    locationId = data.id
  } else {
    // Create new location
    const result = await query<{ id: number }>(
      `INSERT INTO locations (slug, name, address, phone, description, image_url, operating_hours, contact_email, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        data.slug || '', data.name || '', data.address, data.phone,
        data.description, data.image_url, data.operating_hours,
        data.contact_email, data.is_active ?? true
      ]
    )
    locationId = result.rows[0].id
  }
  
  // Audit log
  await query(
    `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
     VALUES ($1, $2, 'location', $3, $4)`,
    [adminId, data.id ? 'location.update' : 'location.create', locationId, JSON.stringify(data)]
  )
  
  return locationId
}

/**
 * Toggle location active status
 */
export async function toggleLocationActive(adminId: number, locationId: number, isActive: boolean): Promise<boolean> {
  await query(
    `UPDATE locations SET is_active = $1 WHERE id = $2`,
    [isActive, locationId]
  )
  await query(
    `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
     VALUES ($1, 'location.toggle_active', 'location', $2, $3)`,
    [adminId, locationId, JSON.stringify({ is_active: isActive })]
  )
  return true
}

/**
 * Delete a location (only if no schedules exist)
 */
export async function deleteLocation(adminId: number, locationId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if location has schedules
    const scheduleCheck = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM program_schedules WHERE location_id = $1`,
      [locationId]
    )
    
    if (parseInt(scheduleCheck.rows[0]?.count || "0", 10) > 0) {
      return { success: false, error: "일정이 있는 장소는 삭제할 수 없습니다. 먼저 해당 장소의 일정을 삭제해주세요." }
    }

    const result = await query(
      `DELETE FROM locations WHERE id = $1`,
      [locationId]
    )

    if ((result.rowCount ?? 0) > 0) {
      await query(
        `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
         VALUES ($1, 'location.delete', 'location', $2, '{}')`,
        [adminId, locationId]
      )
      return { success: true }
    }

    return { success: false, error: "장소를 찾을 수 없습니다." }
  } catch (err) {
    console.error("[DB] Delete location error:", err)
    return { success: false, error: "장소 삭제 중 오류가 발생했습니다." }
  }
}

/**
 * Get all holidays
 */
export async function getAllHolidays(year?: number): Promise<Holiday[]> {
  try {
    let sql = `
      SELECT h.*, l.name as location_name
      FROM holidays h
      LEFT JOIN locations l ON l.id = h.location_id
    `
    const params: unknown[] = []
    
    if (year) {
      sql += ` WHERE EXTRACT(YEAR FROM h.holiday_date) = $1`
      params.push(year)
    }
    
    sql += ` ORDER BY h.holiday_date ASC`
    
    const result = await query<Holiday>(sql, params)
    return result.rows
  } catch {
    // Table might not exist yet
    return []
  }
}

/**
 * Create a holiday
 */
export async function createHoliday(
  adminId: number,
  data: {
    holidayDate: Date
    name?: string
    description?: string
    isRecurring?: boolean
    locationId?: number
  }
): Promise<number> {
  try {
    // Try to create holidays table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS holidays (
        id SERIAL PRIMARY KEY,
        holiday_date DATE NOT NULL,
        name VARCHAR(100),
        description TEXT,
        is_recurring BOOLEAN DEFAULT false,
        location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
        created_by INTEGER REFERENCES admin_users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    const result = await query<{ id: number }>(
      `INSERT INTO holidays (holiday_date, name, description, is_recurring, location_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        data.holidayDate,
        data.name || null,
        data.description || null,
        data.isRecurring || false,
        data.locationId || null,
        adminId,
      ]
    )
    
    return result.rows[0].id
  } catch (err) {
    console.error("[DB] Create holiday error:", err)
    throw err
  }
}

/**
 * Delete a holiday
 */
export async function deleteHoliday(adminId: number, holidayId: number): Promise<boolean> {
  try {
    const result = await query(
      `DELETE FROM holidays WHERE id = $1`,
      [holidayId]
    )
    return (result.rowCount ?? 0) > 0
  } catch {
    return false
  }
}

/**
 * Check if a date is a holiday
 */
export async function checkIsHoliday(date: Date, locationId?: number): Promise<boolean> {
  try {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM holidays 
       WHERE holiday_date = $1 
       AND (location_id IS NULL OR location_id = $2)`,
      [date, locationId || null]
    )
    return parseInt(result.rows[0]?.count || '0', 10) > 0
  } catch {
    return false
  }
}
