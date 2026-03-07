import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getDashboardStats, getRecentReservations, getUpcomingSchedules } from "@/lib/db/schedules"
import { getInquiryCounts } from "@/lib/db/inquiries"

// GET /api/admin/dashboard - Get dashboard data
export async function GET() {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [stats, recentReservations, upcomingSchedules, inquiryCounts] = await Promise.all([
      getDashboardStats(),
      getRecentReservations(5),
      getUpcomingSchedules(4),
      getInquiryCounts(),
    ])

    return NextResponse.json({
      stats,
      recentReservations,
      upcomingSchedules,
      inquiryCounts,
    })
  } catch (error) {
    console.error("[API] Admin dashboard error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}
