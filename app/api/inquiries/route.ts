import { NextRequest, NextResponse } from "next/server"
import { createInquiry } from "@/lib/db/inquiries"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { category, name, phone, email, organization, title, content } = body

    // Validate required fields
    if (!category || !name || !phone || !title || !content) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      )
    }

    // Create inquiry
    const inquiryId = await createInquiry({
      categorySlug: category,
      name,
      phone,
      email: email || undefined,
      organization: organization || undefined,
      title,
      content,
    })

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "문의가 접수되었습니다.",
    })
  } catch (error) {
    console.error("[API] Inquiry error:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    )
  }
}
