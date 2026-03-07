import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getAllProgramsAdmin, upsertProgram, toggleProgramActive } from "@/lib/db/programs"

// GET /api/admin/programs - Get all programs
export async function GET() {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const programs = await getAllProgramsAdmin()
    return NextResponse.json({ programs })
  } catch (error) {
    console.error("[API] Admin programs error:", error)
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    )
  }
}

// POST /api/admin/programs - Create or update program
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
    const programId = await upsertProgram(admin.id, body)

    return NextResponse.json({ success: true, programId })
  } catch (error) {
    console.error("[API] Admin program create/update error:", error)
    return NextResponse.json(
      { error: "Failed to save program" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/programs - Toggle active status
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { programId, isActive } = body

    if (!programId || isActive === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await toggleProgramActive(admin.id, programId, isActive)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin program toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle program" },
      { status: 500 }
    )
  }
}
