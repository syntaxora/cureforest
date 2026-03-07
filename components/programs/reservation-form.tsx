"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  TreePine,
  User,
  Phone,
  Mail,
  Users,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { ko } from "date-fns/locale"
import { format } from "date-fns"

interface ReservationFormProps {
  programTitle: string
  programNumber: string
  programSubtitle: string
  programSlug: string
}

export function ReservationForm({
  programTitle,
  programNumber,
  programSubtitle,
  programSlug,
}: ReservationFormProps) {
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [gender, setGender] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const locations = [
    { value: "seoul", label: "서울 치유의 숲" },
    { value: "pocheon", label: "포천 국립치유의 숲" },
    { value: "jangseong", label: "장성 편백치유의 숲" },
    { value: "yeongju", label: "영주 치유의 숲" },
    { value: "hoengseong", label: "횡성 치유의 숲" },
    { value: "jeongeup", label: "정읍 치유의 숲" },
    { value: "custom", label: "기타 (요청사항에 기재)" },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programSlug,
          locationSlug: location === "custom" ? "seoul" : location,
          date: date?.toISOString(),
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email") || undefined,
          participants: formData.get("participants"),
          gender,
          ageGroup,
          message: formData.get("message") || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "예약에 실패했습니다.")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "예약에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-8 py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="mb-2 font-serif text-2xl font-bold text-card-foreground">
            {"예약 접수가 완료되었습니다"}
          </h3>
          <p className="text-muted-foreground">
            {"담당 산림치유지도사가 확인 후 연락드리겠습니다."}
          </p>
        </div>
        <div className="w-full max-w-sm space-y-2 rounded-xl bg-secondary px-6 py-5 text-sm text-left">
          <p className="font-semibold text-secondary-foreground">{programTitle}</p>
          {date && (
            <p className="text-muted-foreground">
              {"희망 일자: "}
              {format(date, "yyyy년 M월 d일 (EEEE)", { locale: ko })}
            </p>
          )}
          {location && (
            <p className="text-muted-foreground">
              {"장소: "}
              {locations.find((l) => l.value === location)?.label}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false)
            setDate(undefined)
            setLocation("")
            setGender("")
            setAgeGroup("")
            setPrivacyAgreed(false)
          }}
          className="mt-2"
        >
          {"다시 예약하기"}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Program summary card */}
      <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <TreePine className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {programNumber}. {programSubtitle}
          </p>
          <p className="font-serif text-lg font-bold text-foreground">
            {programTitle}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Date + Location row */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Date picker popover */}
        <div className="flex flex-col gap-2.5">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            {"희망 날짜"}
            <span className="text-destructive">{"*"}</span>
          </Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start gap-2 bg-card text-left font-normal ${!date ? "text-muted-foreground" : "text-foreground"}`}
              >
                <CalendarDays className="h-4 w-4 text-primary" />
                {date
                  ? format(date, "yyyy년 M월 d일 (EEE)", { locale: ko })
                  : "날짜를 선택하세요"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {mounted && (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d)
                    setDateOpen(false)
                  }}
                  locale={ko}
                  disabled={{ before: new Date() }}
                  className="rounded-lg"
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Location picker */}
        <div className="flex flex-col gap-2.5">
          <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {"장소 선택"}
            <span className="text-destructive">{"*"}</span>
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="장소를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Personal info */}
      <div>
        <p className="mb-4 text-sm font-semibold text-foreground">
          {"예약자 정보"}
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {"이름"}
              <span className="text-destructive">{"*"}</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="홍길동"
              required
              className="bg-card"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {"연락처"}
              <span className="text-destructive">{"*"}</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="010-1234-5678"
              required
              className="bg-card"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {"이메일"}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              className="bg-card"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="participants" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {"참가 인원"}
              <span className="text-destructive">{"*"}</span>
            </Label>
            <Select name="participants" required>
              <SelectTrigger id="participants" className="bg-card">
                <SelectValue placeholder="인원 선택" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n === 10 ? "10명 이상" : `${n}명`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {"성별"}
              <span className="text-destructive">{"*"}</span>
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="성별 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{"남성"}</SelectItem>
                <SelectItem value="female">{"여성"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {"나이대"}
              <span className="text-destructive">{"*"}</span>
            </Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="나이대 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10s">{"10대"}</SelectItem>
                <SelectItem value="20s">{"20대"}</SelectItem>
                <SelectItem value="30s">{"30대"}</SelectItem>
                <SelectItem value="40s">{"40대"}</SelectItem>
                <SelectItem value="50s">{"50대"}</SelectItem>
                <SelectItem value="60s">{"60대"}</SelectItem>
                <SelectItem value="70s">{"70대 이상"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="message" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {"요청사항 / 메모"}
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="특별한 요청사항이나 문의사항이 있으시면 적어주세요."
          rows={4}
          className="resize-none bg-card"
        />
      </div>

      {/* Privacy consent */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="mb-3 flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={privacyAgreed}
            onCheckedChange={(checked) => setPrivacyAgreed(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="privacy" className="text-sm font-medium leading-relaxed text-foreground cursor-pointer">
            {"[필수] 개인정보 수집 및 이용에 동의합니다."}
          </Label>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground max-h-40 overflow-y-auto">
          <p className="mb-2 font-semibold text-foreground">{"개인정보 수집 및 이용 동의서"}</p>
          <p className="mb-2">
            {"큐어포레스트(CureForest)는 산림치유 프로그램 예약 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다."}
          </p>
          <p className="mb-1 font-semibold text-foreground">{"1. 수집 항목"}</p>
          <p className="mb-2">{"이름, 연락처, 이메일, 성별, 나이대, 참가 인원, 희망 날짜, 장소, 요청사항"}</p>
          <p className="mb-1 font-semibold text-foreground">{"2. 수집 및 이용 목적"}</p>
          <p className="mb-2">{"산림치유 프로그램 예약 접수 및 확인, 예약 관련 안내 및 연락, 프로그램 운영 및 참가자 관리"}</p>
          <p className="mb-1 font-semibold text-foreground">{"3. 보유 및 이용 기간"}</p>
          <p className="mb-2">{"예약 완료 후 1년간 보유하며, 이후 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다."}</p>
          <p className="mb-1 font-semibold text-foreground">{"4. 동의 거부권 및 불이익"}</p>
          <p>{"귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 프로그램 예약 서비스 이용이 제한됩니다."}</p>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 text-base"
        disabled={!date || !location || !gender || !ageGroup || !privacyAgreed || loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {"예약 접수 중..."}
          </>
        ) : (
          <>
            <CalendarDays className="h-5 w-5" />
            {"예약 접수하기"}
          </>
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {"예약 접수 후 담당 산림치유지도사가 확인하여 연락드립니다. "}
        {"문의: "}
        <a href="mailto:cure2410@naver.com" className="text-primary underline">
          cure2410@naver.com
        </a>
      </p>
    </form>
  )
}
