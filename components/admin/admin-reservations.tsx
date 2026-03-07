"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  CalendarDays,
  Users,
  MessageSquare,
  Loader2,
  RefreshCw,
} from "lucide-react"

interface Reservation {
  id: number
  reservation_id: number
  booker_name: string
  booker_phone: string
  booker_email: string | null
  participants: number
  message: string | null
  reservation_status: string
  reserved_at: string
  schedule_date: string
  start_time: string | null
  end_time: string | null
  program_title: string
  program_slug: string
  location_name: string
  gender?: string
  age_group?: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "대기", variant: "outline" },
  confirmed: { label: "확정", variant: "default" },
  cancelled: { label: "취소", variant: "destructive" },
  completed: { label: "완료", variant: "secondary" },
}

export function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState<number | null>(null)
  const [statusNote, setStatusNote] = useState("")
  const limit = 20

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== "all") params.set("status", filterStatus)
      if (search) params.set("search", search)
      params.set("limit", String(limit))
      params.set("offset", String((page - 1) * limit))

      const res = await fetch(`/api/admin/reservations?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReservations(data.reservations || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
    } finally {
      setLoading(false)
    }
  }, [filterStatus, search, page])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const updateStatus = async (reservationId: number, newStatus: string) => {
    setActionLoading(reservationId)
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, status: newStatus, note: statusNote }),
      })
      if (res.ok) {
        await fetchReservations()
        setDetailOpen(null)
        setStatusNote("")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = reservations.filter((r) => r.reservation_status === "pending").length
  const totalPages = Math.ceil(total / limit)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ko-KR", { 
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    })
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{"예약 관리"}</h1>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {pendingCount}{"건 대기중"}
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={fetchReservations} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {"예약 현황을 확인하고 상태를 관리합니다."}
          </p>
        </div>

        <div className="flex flex-col gap-4 px-8 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="이름, 연락처, 프로그램 검색..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"전체 상태"}</SelectItem>
                <SelectItem value="pending">{"대기"}</SelectItem>
                <SelectItem value="confirmed">{"확정"}</SelectItem>
                <SelectItem value="cancelled">{"취소"}</SelectItem>
                <SelectItem value="completed">{"완료"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border/60">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
                  <p>{"예약이 없습니다."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"예약자"}</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"프로그램"}</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"날짜"}</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"인원"}</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"상태"}</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"접수일"}</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"관리"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res) => {
                        const status = statusConfig[res.reservation_status] || statusConfig.pending
                        const resId = res.reservation_id || res.id
                        return (
                          <tr key={resId} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                                  {res.booker_name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{res.booker_name}</p>
                                  <p className="text-xs text-muted-foreground">{res.booker_phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-sm text-foreground">{res.program_title}</p>
                              <p className="text-xs text-muted-foreground">{res.location_name}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CalendarDays className="h-3 w-3" />
                                {formatDate(res.schedule_date)}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Users className="h-3 w-3" />
                                {res.participants}{"명"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-muted-foreground">{formatDateTime(res.reserved_at)}</td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Dialog open={detailOpen === resId} onOpenChange={(open) => setDetailOpen(open ? resId : null)}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>{"예약 상세"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 pt-2">
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
                                          {res.booker_name?.charAt(0) || "?"}
                                        </div>
                                        <div>
                                          <p className="font-medium text-foreground">{res.booker_name}</p>
                                          <Badge variant={status.variant}>{status.label}</Badge>
                                        </div>
                                      </div>
                                      <div className="grid gap-3 rounded-lg bg-muted/30 p-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-muted-foreground" />
                                          <span>{res.booker_phone}</span>
                                        </div>
                                        {res.booker_email && (
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{res.booker_email}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                          <span>{formatDate(res.schedule_date)} | {res.program_title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4 text-muted-foreground" />
                                          <span>{res.participants}{"명"}</span>
                                        </div>
                                        {res.message && (
                                          <div className="flex items-start gap-2">
                                            <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                            <span>{res.message}</span>
                                          </div>
                                        )}
                                      </div>
                                      {res.reservation_status === "pending" && (
                                        <>
                                          <Textarea
                                            placeholder="처리 메모 (선택사항)"
                                            value={statusNote}
                                            onChange={(e) => setStatusNote(e.target.value)}
                                            rows={2}
                                          />
                                          <div className="flex gap-2">
                                            <Button 
                                              className="flex-1 gap-2"
                                              onClick={() => updateStatus(resId, "confirmed")}
                                              disabled={actionLoading === resId}
                                            >
                                              {actionLoading === resId ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                              {"확정"}
                                            </Button>
                                            <Button 
                                              variant="destructive" 
                                              className="flex-1 gap-2"
                                              onClick={() => updateStatus(resId, "cancelled")}
                                              disabled={actionLoading === resId}
                                            >
                                              {actionLoading === resId ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                              {"취소"}
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                      {res.reservation_status === "confirmed" && (
                                        <Button 
                                          variant="outline"
                                          onClick={() => updateStatus(resId, "completed")}
                                          disabled={actionLoading === resId}
                                        >
                                          {actionLoading === resId ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                          {"프로그램 완료 처리"}
                                        </Button>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                {res.reservation_status === "pending" && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-primary hover:text-primary"
                                      onClick={() => updateStatus(resId, "confirmed")}
                                      disabled={actionLoading === resId}
                                    >
                                      {actionLoading === resId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={() => updateStatus(resId, "cancelled")}
                                      disabled={actionLoading === resId}
                                    >
                                      {actionLoading === resId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {"총 "}{total}{"건"}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm">{page} / {totalPages}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
