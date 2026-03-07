import { NextRequest, NextResponse } from "next/server"
import { registerAdmin, hasActiveAdmin } from "@/lib/db/admin"

// GET /api/admin/register - Check if registration is available
export async function GET() {
  try {
    const hasAdmin = await hasActiveAdmin()
    return NextResponse.json({
      hasAdmin,
      message: hasAdmin
        ? "관리자가 이미 존재합니다. 가입 후 승인이 필요합니다."
        : "첫 번째 관리자로 가입하시면 즉시 활성화됩니다.",
    })
  } catch (error) {
    console.error("[API] Check admin status error:", error)
    return NextResponse.json(
      { error: "상태 확인 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST /api/admin/register - Register new admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름을 모두 입력하세요." },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "비밀번호는 4자 이상이어야 합니다." },
        { status: 400 }
      )
    }

    const result = await registerAdmin({ email, password, name, phone })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      autoApproved: result.autoApproved,
      message: result.autoApproved
        ? "첫 번째 관리자로 등록되었습니다. 바로 로그인할 수 있습니다."
        : "가입 신청이 완료되었습니다. 기존 관리자의 승인 후 로그인할 수 있습니다.",
    })
  } catch (error) {
    console.error("[API] Admin register error:", error)
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
