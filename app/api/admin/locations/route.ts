import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getAllLocationsAdmin, upsertLocation, toggleLocationActive, deleteLocation } from "@/lib/db/programs"

// GET /api/admin/locations - Get all locations
export async function GET() {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const locations = await getAllLocationsAdmin()
    return NextResponse.json({ locations })
  } catch (error) {
    console.error("[API] Admin locations error:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

// POST /api/admin/locations - Create or update location
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (admin.role === "staff") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const body = await request.json()
    const locationId = await upsertLocation(admin.id, body)

    return NextResponse.json({ success: true, locationId })
  } catch (error) {
    console.error("[API] Admin location create/update error:", error)
    return NextResponse.json(
      { error: "Failed to save location" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/locations - Toggle active status
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { locationId, isActive } = body

    if (!locationId || isActive === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await toggleLocationActive(admin.id, locationId, isActive)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin location toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle location" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/locations - Delete a location
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (admin.role !== "super_admin") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get("id")

    if (!locationId) {
      return NextResponse.json({ error: "Missing location ID" }, { status: 400 })
    }

    const result = await deleteLocation(admin.id, parseInt(locationId, 10))
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin location delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    )
  }
}
