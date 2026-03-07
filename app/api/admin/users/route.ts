import { NextRequest, NextResponse } from "next/server"
import {
  getCurrentAdmin,
  getAllAdminUsers,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
  updateAdminUser,
  createAdminUser,
} from "@/lib/db/admin"

// GET /api/admin/users - Get all admin users
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pending = searchParams.get("pending") === "true"

    if (pending) {
      const pendingAdmins = await getPendingAdmins()
      return NextResponse.json({ users: pendingAdmins })
    }

    const users = await getAllAdminUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("[API] Get admin users error:", error)
    return NextResponse.json(
      { error: "사용자 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Create new admin user (by existing admin)
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (admin.role !== "super_admin" && admin.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, name, phone, role } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름을 모두 입력하세요." },
        { status: 400 }
      )
    }

    const id = await createAdminUser({ email, password, name, phone, role })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("[API] Create admin user error:", error)
    return NextResponse.json(
      { error: "사용자 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users - Update admin user (approve, reject, update)
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (admin.role !== "super_admin" && admin.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const body = await request.json()
    const { id, action, ...data } = body

    if (!id) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다." }, { status: 400 })
    }

    if (action === "approve") {
      const success = await approveAdmin(id)
      if (!success) {
        return NextResponse.json({ error: "승인 실패" }, { status: 400 })
      }
      return NextResponse.json({ success: true, message: "승인되었습니다." })
    }

    if (action === "reject") {
      const success = await rejectAdmin(id)
      if (!success) {
        return NextResponse.json({ error: "거부 실패" }, { status: 400 })
      }
      return NextResponse.json({ success: true, message: "거부되었습니다." })
    }

    // General update
    const success = await updateAdminUser(id, data)
    if (!success) {
      return NextResponse.json({ error: "업데이트 실패" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Update admin user error:", error)
    return NextResponse.json(
      { error: "사용자 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
