import { NextRequest, NextResponse } from "next/server"
import { authenticateAdmin, logoutAdmin, getCurrentAdmin } from "@/lib/db/admin"
import { cookies } from "next/headers"

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || password === undefined || password === null) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력하세요." },
        { status: 400 }
      )
    }

    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined
    const userAgent = request.headers.get("user-agent") || undefined

    const result = await authenticateAdmin(email, password, ipAddress, userAgent)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", result.sessionToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error("[API] Admin auth error:", error)
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// GET /api/admin/auth - Get current user
export async function GET() {
  try {
    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    return NextResponse.json({ user: admin })
  } catch (error) {
    console.error("[API] Admin auth check error:", error)
    return NextResponse.json(
      { error: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      await logoutAdmin(sessionToken)
    }

    cookieStore.delete("admin_session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Admin logout error:", error)
    return NextResponse.json(
      { error: "로그아웃 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
