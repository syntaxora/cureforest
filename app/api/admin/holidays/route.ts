import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getAllHolidays, createHoliday, deleteHoliday } from "@/lib/db/programs"

// GET /api/admin/holidays - Get all holidays
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")

    const holidays = await getAllHolidays(year ? parseInt(year, 10) : undefined)
    return NextResponse.json({ holidays })
  } catch (error) {
    console.error("[API] Admin holidays error:", error)
    return NextResponse.json(
      { error: "Failed to fetch holidays" },
      { status: 500 }
    )
  }
}

// POST /api/admin/holidays - Create holiday
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { holidayDate, name, description, isRecurring, locationId } = body

    if (!holidayDate) {
      return NextResponse.json(
        { error: "Holiday date is required" },
        { status: 400 }
      )
    }

    const holidayId = await createHoliday(admin.id, {
      holidayDate: new Date(holidayDate),
      name,
      description,
      isRecurring,
      locationId: locationId ? parseInt(locationId, 10) : undefined,
    })

    return NextResponse.json({ success: true, holidayId })
  } catch (error) {
    console.error("[API] Admin holiday create error:", error)
    return NextResponse.json(
      { error: "Failed to create holiday" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/holidays - Delete holiday
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const holidayId = searchParams.get("id")

    if (!holidayId) {
      return NextResponse.json(
        { error: "Holiday ID is required" },
        { status: 400 }
      )
    }

    const success = await deleteHoliday(admin.id, parseInt(holidayId, 10))

    if (!success) {
      return NextResponse.json(
        { error: "Holiday not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin holiday delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete holiday" },
      { status: 500 }
    )
  }
}
