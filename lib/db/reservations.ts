import { query, transaction } from "@/lib/db"

export interface Reservation {
  id: number
  schedule_id: number
  name: string
  phone: string
  email: string | null
  participants: number
  gender: string | null
  age_group: string | null
  message: string | null
  status: "pending" | "confirmed" | "cancelled" | "completed"
  created_at: Date
  updated_at: Date
}

export interface ReservationWithDetails extends Reservation {
  program_title: string
  program_slug: string
  program_number: string
  location_name: string
  location_slug: string
  schedule_date: Date
  start_time: string | null
  end_time: string | null
}

export interface Schedule {
  id: number
  program_id: number
  location_id: number
  schedule_date: Date
  start_time: string | null
  end_time: string | null
  max_capacity: number
  booked_count: number
  status: "open" | "full" | "cancelled"
}

export interface AvailableSchedule {
  schedule_id: number
  program_slug: string
  program_title: string
  location_slug: string
  location_name: string
  schedule_date: Date
  start_time: string | null
  end_time: string | null
  max_capacity: number
  booked_count: number
  remaining_seats: number
  status: string
}

/**
 * Get available schedules for a program
 */
export async function getAvailableSchedules(
  programSlug: string,
  locationSlug?: string
): Promise<AvailableSchedule[]> {
  let sql = `
    SELECT * FROM available_schedules
    WHERE program_slug = $1
  `
  const params: unknown[] = [programSlug]

  if (locationSlug) {
    sql += ` AND location_slug = $2`
    params.push(locationSlug)
  }

  sql += ` ORDER BY schedule_date ASC`

  const result = await query<AvailableSchedule>(sql, params)
  return result.rows
}

/**
 * Find or create a schedule for a given program, location, and date
 */
export async function findOrCreateSchedule(
  programSlug: string,
  locationSlug: string,
  scheduleDate: Date
): Promise<number> {
  return transaction(async (client) => {
    // First, try to find existing schedule
    const findResult = await client.query<{ id: number }>(
      `SELECT ps.id 
       FROM program_schedules ps
       JOIN programs p ON p.id = ps.program_id
       JOIN locations l ON l.id = ps.location_id
       WHERE p.slug = $1 AND l.slug = $2 AND ps.schedule_date = $3`,
      [programSlug, locationSlug, scheduleDate]
    )

    if (findResult.rows.length > 0) {
      return findResult.rows[0].id
    }

    // Create new schedule
    const programResult = await client.query<{ id: number }>(
      `SELECT id FROM programs WHERE slug = $1`,
      [programSlug]
    )
    const locationResult = await client.query<{ id: number }>(
      `SELECT id FROM locations WHERE slug = $1`,
      [locationSlug]
    )

    if (programResult.rows.length === 0 || locationResult.rows.length === 0) {
      throw new Error("Program or location not found")
    }

    const insertResult = await client.query<{ id: number }>(
      `INSERT INTO program_schedules (program_id, location_id, schedule_date, max_capacity)
       VALUES ($1, $2, $3, 20)
       RETURNING id`,
      [programResult.rows[0].id, locationResult.rows[0].id, scheduleDate]
    )

    return insertResult.rows[0].id
  })
}

/**
 * Create a reservation using the safe booking function
 */
export async function createReservation(data: {
  scheduleId: number
  name: string
  phone: string
  email?: string
  participants: number
  gender?: string
  ageGroup?: string
  message?: string
}): Promise<{ reservationId: number; status: string }> {
  // First make the reservation using the DB function
  const result = await query<{ reservation_id: number; booking_status: string }>(
    `SELECT * FROM make_reservation($1, $2, $3, $4, $5, $6)`,
    [
      data.scheduleId,
      data.name,
      data.phone,
      data.email || null,
      data.participants,
      data.message || null,
    ]
  )

  const row = result.rows[0]
  
  if (row.booking_status !== "success") {
    return { reservationId: 0, status: row.booking_status }
  }

  // Update with gender and age_group (since make_reservation doesn't have these)
  if (data.gender || data.ageGroup) {
    await query(
      `UPDATE reservations SET gender = $1, age_group = $2 WHERE id = $3`,
      [data.gender || null, data.ageGroup || null, row.reservation_id]
    )
  }

  return { reservationId: row.reservation_id, status: "success" }
}

/**
 * Get all reservations with details (admin view)
 */
export async function getAllReservations(filters?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ reservations: ReservationWithDetails[]; total: number }> {
  let countSql = `SELECT COUNT(*) as total FROM admin_reservations_view WHERE 1=1`
  let sql = `SELECT * FROM admin_reservations_view WHERE 1=1`
  const params: unknown[] = []
  let paramIndex = 1

  if (filters?.status && filters.status !== "all") {
    const condition = ` AND reservation_status = $${paramIndex}`
    countSql += condition
    sql += condition
    params.push(filters.status)
    paramIndex++
  }

  if (filters?.search) {
    const condition = ` AND (booker_name ILIKE $${paramIndex} OR booker_phone ILIKE $${paramIndex} OR program_title ILIKE $${paramIndex})`
    countSql += condition
    sql += condition
    params.push(`%${filters.search}%`)
    paramIndex++
  }

  sql += ` ORDER BY reserved_at DESC`

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
    query<ReservationWithDetails>(sql, params),
    query<{ total: string }>(countSql, params.slice(0, paramIndex - (filters?.limit ? 2 : 0))),
  ])

  return {
    reservations: dataResult.rows.map((row) => ({
      ...row,
      id: row.reservation_id as unknown as number,
      name: row.booker_name as unknown as string,
      phone: row.booker_phone as unknown as string,
      email: row.booker_email as unknown as string,
      status: row.reservation_status as unknown as Reservation["status"],
      created_at: row.reserved_at as unknown as Date,
    })) as unknown as ReservationWithDetails[],
    total: parseInt(countResult.rows[0]?.total || "0", 10),
  }
}

/**
 * Update reservation status (admin function)
 */
export async function updateReservationStatus(
  adminId: number,
  reservationId: number,
  newStatus: string,
  note?: string
): Promise<boolean> {
  const result = await query<{ admin_update_reservation_status: boolean }>(
    `SELECT admin_update_reservation_status($1, $2, $3, $4)`,
    [adminId, reservationId, newStatus, note || null]
  )
  return result.rows[0]?.admin_update_reservation_status ?? false
}

/**
 * Get location by slug
 */
export async function getLocationBySlug(slug: string) {
  const result = await query<{ id: number; slug: string; name: string }>(
    `SELECT id, slug, name FROM locations WHERE slug = $1`,
    [slug]
  )
  return result.rows[0] || null
}

/**
 * Get all locations
 */
export async function getAllLocations() {
  const result = await query<{ id: number; slug: string; name: string; address: string | null }>(
    `SELECT id, slug, name, address FROM locations WHERE is_active = true ORDER BY name`
  )
  return result.rows
}
