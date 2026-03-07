import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/db/admin"
import { getAllInquiries, updateInquiryStatus, getInquiryCounts, InquiryStatus } from "@/lib/db/inquiries"

// GET /api/admin/inquiries - Get all inquiries
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

    const [{ inquiries, total }, counts] = await Promise.all([
      getAllInquiries({ status, search, limit, offset }),
      getInquiryCounts(),
    ])

    return NextResponse.json({ inquiries, total, counts })
  } catch (error) {
    console.error("[API] Admin inquiries error:", error)
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/inquiries - Update inquiry status
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { inquiryId, status, note } = body

    if (!inquiryId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const success = await updateInquiryStatus(admin.id, inquiryId, status as InquiryStatus, note)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update inquiry" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin inquiry update error:", error)
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    )
  }
}
