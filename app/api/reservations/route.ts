import { NextRequest, NextResponse } from "next/server"
import { createReservation, findOrCreateSchedule } from "@/lib/db/reservations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      programSlug,
      locationSlug,
      date,
      name,
      phone,
      email,
      participants,
      gender,
      ageGroup,
      message,
    } = body

    // Validate required fields
    if (!programSlug || !locationSlug || !date || !name || !phone || !participants) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      )
    }

    // Find or create schedule for the given date
    const scheduleDate = new Date(date)
    const scheduleId = await findOrCreateSchedule(programSlug, locationSlug, scheduleDate)

    // Create reservation
    const result = await createReservation({
      scheduleId,
      name,
      phone,
      email,
      participants: parseInt(participants, 10),
      gender,
      ageGroup,
      message,
    })

    if (result.status !== "success") {
      const errorMessages: Record<string, string> = {
        schedule_not_available: "해당 날짜의 일정이 마감되었습니다.",
        insufficient_capacity: "잔여 인원이 부족합니다. 다른 날짜를 선택해주세요.",
      }
      return NextResponse.json(
        { error: errorMessages[result.status] || "예약에 실패했습니다." },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      reservationId: result.reservationId,
      message: "예약이 접수되었습니다.",
    })
  } catch (error) {
    console.error("[API] Reservation error:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    )
  }
}
