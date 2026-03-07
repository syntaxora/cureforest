"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Users, Edit2, Plus, Loader2, RefreshCw, Calendar, UserCheck } from "lucide-react"

interface Program {
  id: number
  slug: string
  title: string
  subtitle: string | null
  number: string
  description: string | null
  short_description: string | null
  duration: string | null
  max_capacity: number
  price: number
  image_url: string | null
  location_type: string
  is_active: boolean
  schedule_count: number
  reservation_count: number
  total_participants: number
}

export function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editProgram, setEditProgram] = useState<Partial<Program> | null>(null)
  const [saving, setSaving] = useState(false)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/programs")
      if (res.ok) {
        const data = await res.json()
        setPrograms(data.programs || [])
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  const toggleActive = async (programId: number, isActive: boolean) => {
    setToggleLoading(programId)
    try {
      const res = await fetch("/api/admin/programs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, isActive }),
      })
      if (res.ok) {
        setPrograms(programs.map(p => p.id === programId ? { ...p, is_active: isActive } : p))
      }
    } catch (error) {
      console.error("Failed to toggle program:", error)
    } finally {
      setToggleLoading(null)
    }
  }

  const saveProgram = async () => {
    if (!editProgram) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProgram),
      })
      if (res.ok) {
        setEditOpen(false)
        setEditProgram(null)
        fetchPrograms()
      }
    } catch (error) {
      console.error("Failed to save program:", error)
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (program?: Program) => {
    if (program) {
      setEditProgram({ ...program })
    } else {
      setEditProgram({
        slug: "",
        title: "",
        subtitle: "",
        number: String(programs.length + 1).padStart(2, "0"),
        description: "",
        short_description: "",
        duration: "60분",
        max_capacity: 20,
        price: 0,
        location_type: "indoor_outdoor",
        is_active: true,
      })
    }
    setEditOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border bg-card px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{"프로그램 관리"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {"프로그램 정보와 활성 상태를 관리합니다."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchPrograms} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => openEdit()}>
                  <Plus className="h-4 w-4" />
                  {"프로그램 추가"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editProgram?.id ? "프로그램 수정" : "프로그램 추가"}</DialogTitle>
                </DialogHeader>
                {editProgram && (
                  <form className="flex flex-col gap-4 pt-2" onSubmit={(e) => { e.preventDefault(); saveProgram(); }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>{"번호"}</Label>
                        <Input
                          value={editProgram.number || ""}
                          onChange={(e) => setEditProgram({ ...editProgram, number: e.target.value })}
                          placeholder="01"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"슬러그 (URL)"}</Label>
                        <Input
                          value={editProgram.slug || ""}
                          onChange={(e) => setEditProgram({ ...editProgram, slug: e.target.value })}
                          placeholder="five-senses"
                          required
                          disabled={!!editProgram.id}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"프로그램명"}</Label>
                      <Input
                        value={editProgram.title || ""}
                        onChange={(e) => setEditProgram({ ...editProgram, title: e.target.value })}
                        placeholder="오감 열기"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"부제목"}</Label>
                      <Input
                        value={editProgram.subtitle || ""}
                        onChange={(e) => setEditProgram({ ...editProgram, subtitle: e.target.value })}
                        placeholder="감각 치유"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"짧은 설명"}</Label>
                      <Input
                        value={editProgram.short_description || ""}
                        onChange={(e) => setEditProgram({ ...editProgram, short_description: e.target.value })}
                        placeholder="프로그램 카드에 표시될 짧은 설명"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"상세 설명"}</Label>
                      <RichTextEditor
                        value={editProgram.description || ""}
                        onChange={(html) => setEditProgram({ ...editProgram, description: html })}
                        placeholder="프로그램 상세 페이지에 표시될 설명을 입력하세요..."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>{"소요 시간"}</Label>
                        <Input
                          value={editProgram.duration || ""}
                          onChange={(e) => setEditProgram({ ...editProgram, duration: e.target.value })}
                          placeholder="60분"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"기본 정원"}</Label>
                        <Input
                          type="number"
                          value={editProgram.max_capacity || 20}
                          onChange={(e) => setEditProgram({ ...editProgram, max_capacity: parseInt(e.target.value, 10) })}
                          min="1"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"가격 (원)"}</Label>
                        <Input
                          type="number"
                          value={editProgram.price || 0}
                          onChange={(e) => setEditProgram({ ...editProgram, price: parseInt(e.target.value, 10) })}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"장소 유형"}</Label>
                      <Select
                        value={editProgram.location_type || "indoor_outdoor"}
                        onValueChange={(v) => setEditProgram({ ...editProgram, location_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indoor">{"실내"}</SelectItem>
                          <SelectItem value="outdoor">{"야외"}</SelectItem>
                          <SelectItem value="indoor_outdoor">{"실내/야외"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editProgram.is_active ?? true}
                        onCheckedChange={(v) => setEditProgram({ ...editProgram, is_active: v })}
                      />
                      <Label>{"프로그램 활성화"}</Label>
                    </div>
                    <Button type="submit" className="mt-2" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {"저장"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <Card key={program.id} className={`border-border/60 transition-shadow hover:shadow-md ${!program.is_active ? "opacity-60" : ""}`}>
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                          {program.number}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{program.title}</p>
                          <p className="text-xs text-muted-foreground">{program.subtitle}</p>
                        </div>
                      </div>
                      {!program.is_active && <Badge variant="secondary">{"비활성"}</Badge>}
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {program.short_description || program.description || "설명 없음"}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {program.duration || "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {"정원 "}{program.max_capacity}{"명"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {"일정 "}{program.schedule_count}{"건"}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {"참가 "}{program.total_participants}{"명"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={program.is_active}
                          onCheckedChange={(v) => toggleActive(program.id, v)}
                          disabled={toggleLoading === program.id}
                        />
                        <label className="text-xs font-medium text-muted-foreground">
                          {"활성"}
                        </label>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => openEdit(program)}>
                        <Edit2 className="h-3 w-3" />
                        {"수정"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
