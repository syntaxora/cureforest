"use client"

import { useState } from "react"
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
  CheckCircle2,
  User,
  Phone,
  Mail,
  Building2,
  Tag,
  FileText,
  MessageSquare,
  Loader2,
} from "lucide-react"
import Link from "next/link"

const categories = [
  { value: "program", label: "프로그램 문의" },
  { value: "reservation", label: "예약 문의" },
  { value: "schedule", label: "일정 문의" },
  { value: "group", label: "단체/기관 문의" },
  { value: "etc", label: "기타 문의" },
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email") || undefined,
          organization: formData.get("organization") || undefined,
          title: formData.get("title"),
          content: formData.get("content"),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "문의 접수에 실패했습니다.")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 접수에 실패했습니다.")
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
            {"문의가 접수되었습니다"}
          </h3>
          <p className="text-muted-foreground">
            {"담당자가 확인 후 입력하신 연락처로 답변드리겠습니다."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            setSubmitted(false)
            setCategory("")
          }}>
            {"추가 문의하기"}
          </Button>
          <Button asChild>
            <Link href="/">{"홈으로 돌아가기"}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Category */}
      <div className="flex flex-col gap-2.5">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Tag className="h-4 w-4 text-primary" />
          {"문의 유형"}
          <span className="text-destructive">{"*"}</span>
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="문의 유형을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Name + Phone */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            {"이름"}
            <span className="text-destructive">{"*"}</span>
          </Label>
          <Input id="contact-name" name="name" placeholder="홍길동" required className="bg-background" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-phone" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            {"연락처"}
            <span className="text-destructive">{"*"}</span>
          </Label>
          <Input id="contact-phone" name="phone" type="tel" placeholder="010-1234-5678" required className="bg-background" />
        </div>
      </div>

      {/* Email + Organization */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {"이메일"}
          </Label>
          <Input id="contact-email" name="email" type="email" placeholder="example@email.com" className="bg-background" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-org" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {"소속/단체명"}
          </Label>
          <Input id="contact-org" name="organization" placeholder="소속이 있는 경우 입력" className="bg-background" />
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-title" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          {"제목"}
          <span className="text-destructive">{"*"}</span>
        </Label>
        <Input id="contact-title" name="title" placeholder="문의 제목을 입력하세요" required className="bg-background" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-content" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {"문의 내용"}
          <span className="text-destructive">{"*"}</span>
        </Label>
        <Textarea
          id="contact-content"
          name="content"
          placeholder="문의하실 내용을 상세히 적어주세요."
          rows={6}
          required
          className="resize-none bg-background"
        />
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full gap-2 text-base" disabled={!category || loading}>
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {"문의 접수 중..."}
          </>
        ) : (
          <>
            <Mail className="h-5 w-5" />
            {"문의 접수하기"}
          </>
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {"접수된 문의는 담당자 확인 후 입력하신 연락처(전화/이메일)로 답변드립니다."}
      </p>
    </form>
  )
}
