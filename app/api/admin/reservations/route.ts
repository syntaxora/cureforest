import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getAllReservations, updateReservationStatus } from "@/lib/db/reservations"

// GET /api/admin/reservations - Get all reservations
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const search = searchParams.get("search") || ""
    const limit = parseInt(searchParams.get("limit") || "50", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    const { reservations, total } = await getAllReservations({
      status,
      search,
      limit,
      offset,
    })

    return NextResponse.json({ reservations, total })
  } catch (error) {
    console.error("[API] Admin reservations error:", error)
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/reservations - Update reservation status
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { reservationId, status, note } = body

    if (!reservationId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const success = await updateReservationStatus(admin.id, reservationId, status, note)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update reservation" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin reservation update error:", error)
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    )
  }
}
