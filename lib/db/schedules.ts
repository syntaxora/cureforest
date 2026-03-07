import { query } from "@/lib/db";

export interface Schedule {
  id: number;
  program_id: number;
  location_id: number;
  schedule_date: Date;
  start_time: string | null;
  end_time: string | null;
  max_capacity: number;
  booked_count: number;
  status: "open" | "full" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

export interface ScheduleWithDetails extends Schedule {
  program_title: string;
  program_number: string;
  location_name: string;
  pending_count: number;
  confirmed_count: number;
  cancelled_count: number;
  remaining_seats: number;
}

const SCHEDULE_BASE_QUERY = `
  SELECT 
    ps.id,
    ps.program_id,
    ps.location_id,
    ps.schedule_date,
    ps.start_time,
    ps.end_time,
    ps.max_capacity,
    ps.status,
    ps.created_at,
    ps.updated_at,
    p.title as program_title,
    p.number as program_number,
    l.name as location_name,
    COALESCE((SELECT COUNT(*) FROM reservations r WHERE r.schedule_id = ps.id AND r.status = 'pending'), 0) as pending_count,
    COALESCE((SELECT COUNT(*) FROM reservations r WHERE r.schedule_id = ps.id AND r.status = 'confirmed'), 0) as confirmed_count,
    COALESCE((SELECT COUNT(*) FROM reservations r WHERE r.schedule_id = ps.id AND r.status = 'cancelled'), 0) as cancelled_count,
    COALESCE((SELECT SUM(r.participants) FROM reservations r WHERE r.schedule_id = ps.id AND r.status IN ('pending', 'confirmed')), 0) as booked_count,
    ps.max_capacity - COALESCE((SELECT SUM(r.participants) FROM reservations r WHERE r.schedule_id = ps.id AND r.status IN ('pending', 'confirmed')), 0) as remaining_seats
  FROM program_schedules ps
  JOIN programs p ON p.id = ps.program_id
  JOIN locations l ON l.id = ps.location_id
`;

/**
 * Get all schedules with details (admin view)
 */
export async function getAllSchedules(filters?: {
  programTitle?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ schedules: ScheduleWithDetails[]; total: number }> {
  try {
    let conditions = " WHERE 1=1";
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters?.status && filters.status !== "all") {
      conditions += ` AND ps.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.programTitle && filters.programTitle !== "all") {
      conditions += ` AND p.title = $${paramIndex}`;
      params.push(filters.programTitle);
      paramIndex++;
    }

    if (filters?.search) {
      const searchPattern = `%${filters.search}%`;
      conditions += ` AND (p.title ILIKE $${paramIndex} OR l.name ILIKE $${paramIndex})`;
      params.push(searchPattern);
      paramIndex++;
    }

    const countSql = `SELECT COUNT(*) as total FROM program_schedules ps JOIN programs p ON p.id = ps.program_id JOIN locations l ON l.id = ps.location_id ${conditions}`;
    let sql = `${SCHEDULE_BASE_QUERY} ${conditions} ORDER BY ps.schedule_date ASC, ps.start_time ASC`;

    const countParams = [...params];

    if (filters?.limit) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters?.offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const [dataResult, countResult] = await Promise.all([
      query<ScheduleWithDetails>(sql, params),
      query<{ total: string }>(countSql, countParams),
    ]);

    return {
      schedules: dataResult.rows,
      total: parseInt(countResult.rows[0]?.total || "0", 10),
    };
  } catch (err) {
    console.error("[DB] Get schedules error:", err);
    return { schedules: [], total: 0 };
  }
}

/**
 * Create schedules in bulk (admin function)
 */
export async function createBulkSchedules(
  adminId: number,
  data: {
    programId: number;
    locationId: number;
    startDate: Date;
    endDate: Date;
    startTime?: string;
    endTime?: string;
    maxCapacity?: number;
    weekdaysOnly?: boolean;
  },
): Promise<number> {
  try {
    let count = 0;
    const currentDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;

      if (!data.weekdaysOnly || isWeekday) {
        await query(
          `INSERT INTO program_schedules (program_id, location_id, schedule_date, start_time, end_time, max_capacity)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [
            data.programId,
            data.locationId,
            currentDate.toISOString().split("T")[0],
            data.startTime || "10:00",
            data.endTime || "12:00",
            data.maxCapacity || 20,
          ],
        );
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Audit log
    await query(
      `INSERT INTO admin_audit_log (admin_id, action, target_type, details)
       VALUES ($1, 'schedule.bulk_create', 'schedule', $2)`,
      [adminId, JSON.stringify({ ...data, created_count: count })],
    );

    return count;
  } catch (err) {
    console.error("[DB] Create bulk schedules error:", err);
    return 0;
  }
}

/**
 * Update schedule capacity (admin function)
 */
export async function updateScheduleCapacity(
  adminId: number,
  scheduleId: number,
  newCapacity: number,
): Promise<boolean> {
  try {
    await query(
      `UPDATE program_schedules SET max_capacity = $1, updated_at = NOW() WHERE id = $2`,
      [newCapacity, scheduleId],
    );

    await query(
      `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
       VALUES ($1, 'schedule.update_capacity', 'schedule', $2, $3)`,
      [adminId, scheduleId, JSON.stringify({ new_capacity: newCapacity })],
    );

    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(scheduleId: number): Promise<boolean> {
  try {
    // Only allow deletion if no reservations exist
    const checkResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM reservations WHERE schedule_id = $1`,
      [scheduleId],
    );

    if (parseInt(checkResult.rows[0]?.count || "0", 10) > 0) {
      return false; // Cannot delete schedule with reservations
    }

    await query(`DELETE FROM program_schedules WHERE id = $1`, [scheduleId]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get programs for dropdown
 */
export async function getAllPrograms() {
  try {
    const result = await query<{
      id: number;
      slug: string;
      title: string;
      number: string;
    }>(
      `SELECT id, slug, title, number FROM programs WHERE is_active = true ORDER BY number`,
    );
    return result.rows;
  } catch {
    return [];
  }
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date();
    monthStart.setDate(1);

    const [todayRes, weekRes, monthParticipants, conversionRate] =
      await Promise.all([
        // Today's reservations
        query<{ count: string }>(
          `SELECT COUNT(*) as count FROM reservations r
         WHERE DATE(r.created_at) = $1`,
          [today],
        ),
        // This week's schedules
        query<{ count: string }>(
          `SELECT COUNT(*) as count FROM program_schedules
         WHERE schedule_date >= $1 AND schedule_date < $1::date + INTERVAL '7 days'`,
          [weekStart.toISOString().split("T")[0]],
        ),
        // This month's participants
        query<{ sum: string }>(
          `SELECT COALESCE(SUM(participants), 0) as sum FROM reservations r
         WHERE r.status IN ('confirmed', 'completed')
         AND DATE(r.created_at) >= $1`,
          [monthStart.toISOString().split("T")[0]],
        ),
        // Conversion rate (confirmed / total)
        query<{ total: string; confirmed: string }>(
          `SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status IN ('confirmed', 'completed')) as confirmed
         FROM reservations`,
        ),
      ]);

    const total = parseInt(conversionRate.rows[0]?.total || "0", 10);
    const confirmed = parseInt(conversionRate.rows[0]?.confirmed || "0", 10);
    const rate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

    return {
      todayReservations: parseInt(todayRes.rows[0]?.count || "0", 10),
      weekSchedules: parseInt(weekRes.rows[0]?.count || "0", 10),
      monthParticipants: parseInt(monthParticipants.rows[0]?.sum || "0", 10),
      conversionRate: rate,
    };
  } catch (err) {
    console.error("[DB] Get dashboard stats error:", err);
    return {
      todayReservations: 0,
      weekSchedules: 0,
      monthParticipants: 0,
      conversionRate: 0,
    };
  }
}

/**
 * Get recent reservations for dashboard
 */
export async function getRecentReservations(limit = 5) {
  try {
    const result = await query<{
      id: number;
      name: string;
      program_title: string;
      date: string;
      participants: number;
      status: string;
    }>(
      `SELECT 
        r.id,
        r.name,
        p.title as program_title,
        ps.schedule_date as date,
        r.participants,
        r.status
       FROM reservations r
       JOIN program_schedules ps ON ps.id = r.schedule_id
       JOIN programs p ON p.id = ps.program_id
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit],
    );
    return result.rows;
  } catch {
    return [];
  }
}

/**
 * Get upcoming schedules for dashboard
 */
export async function getUpcomingSchedules(limit = 4) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await query<{
      id: number;
      program_title: string;
      location_name: string;
      schedule_date: string;
      reserved_count: number;
      capacity: number;
    }>(
      `SELECT 
        ps.id,
        p.title as program_title,
        l.name as location_name,
        ps.schedule_date,
        COALESCE((SELECT SUM(r.participants) FROM reservations r WHERE r.schedule_id = ps.id AND r.status IN ('pending', 'confirmed')), 0) as reserved_count,
        ps.max_capacity as capacity
       FROM program_schedules ps
       JOIN programs p ON p.id = ps.program_id
       JOIN locations l ON l.id = ps.location_id
       WHERE ps.schedule_date >= $1
       ORDER BY ps.schedule_date ASC, ps.start_time ASC
       LIMIT $2`,
      [today, limit],
    );
    return result.rows;
  } catch {
    return [];
  }
}
