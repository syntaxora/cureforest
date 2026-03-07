import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getAllSchedules, createBulkSchedules, updateScheduleCapacity, deleteSchedule, getAllPrograms } from "@/lib/db/schedules"
import { getAllLocations } from "@/lib/db/reservations"

// GET /api/admin/schedules - Get all schedules
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const programTitle = searchParams.get("program") || "all"
    const status = searchParams.get("status") || "all"
    const search = searchParams.get("search") || ""
    const limit = parseInt(searchParams.get("limit") || "50", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    const [{ schedules, total }, programs, locations] = await Promise.all([
      getAllSchedules({ programTitle, status, search, limit, offset }),
      getAllPrograms(),
      getAllLocations(),
    ])

    return NextResponse.json({ schedules, total, programs, locations })
  } catch (error) {
    console.error("[API] Admin schedules error:", error)
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    )
  }
}

// POST /api/admin/schedules - Create schedules
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { programId, locationId, startDate, endDate, startTime, endTime, maxCapacity, weekdaysOnly } = body

    if (!programId || !locationId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const count = await createBulkSchedules(admin.id, {
      programId: parseInt(programId, 10),
      locationId: parseInt(locationId, 10),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined,
      weekdaysOnly,
    })

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error("[API] Admin schedule create error:", error)
    return NextResponse.json(
      { error: "Failed to create schedules" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/schedules - Update schedule
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { scheduleId, maxCapacity } = body

    if (!scheduleId || maxCapacity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const success = await updateScheduleCapacity(admin.id, scheduleId, maxCapacity)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update schedule" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin schedule update error:", error)
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/schedules - Delete schedule
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const scheduleId = searchParams.get("id")

    if (!scheduleId) {
      return NextResponse.json(
        { error: "Missing schedule ID" },
        { status: 400 }
      )
    }

    const success = await deleteSchedule(parseInt(scheduleId, 10))

    if (!success) {
      return NextResponse.json(
        { error: "Cannot delete schedule with existing reservations" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin schedule delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    )
  }
}
