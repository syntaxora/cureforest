"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CalendarDays,
  Users,
  MapPin,
  Loader2,
  RefreshCw,
  CalendarOff,
  Save,
} from "lucide-react"

interface Schedule {
  id: number
  schedule_id: number
  program_title: string
  program_number: string
  location_name: string
  schedule_date: string
  start_time: string | null
  end_time: string | null
  max_capacity: number
  booked_count: number
  remaining_seats: number
  status: string
  pending_count: number
  confirmed_count: number
}

interface Program {
  id: number
  slug: string
  title: string
  number: string
}

interface Location {
  id: number
  slug: string
  name: string
}

interface Holiday {
  id: number
  holiday_date: string
  name: string | null
  description: string | null
  is_recurring: boolean
  location_id: number | null
  location_name: string | null
}

export function AdminSchedules() {
  const [tab, setTab] = useState("schedules")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterProgram, setFilterProgram] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  // Create schedule form
  const [createOpen, setCreateOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    programId: "",
    locationId: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "12:00",
    maxCapacity: "20",
    weekdaysOnly: false,
  })

  // Edit schedule
  const [editId, setEditId] = useState<number | null>(null)
  const [editCapacity, setEditCapacity] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  // Holiday form
  const [holidayOpen, setHolidayOpen] = useState(false)
  const [holidayLoading, setHolidayLoading] = useState(false)
  const [newHoliday, setNewHoliday] = useState({
    holidayDate: "",
    name: "",
    description: "",
    isRecurring: false,
    locationId: "",
  })

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterProgram !== "all") params.set("program", filterProgram)
      if (filterStatus !== "all") params.set("status", filterStatus)
      if (search) params.set("search", search)
      params.set("limit", String(limit))
      params.set("offset", String((page - 1) * limit))

      const res = await fetch(`/api/admin/schedules?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSchedules(data.schedules || [])
        setTotal(data.total || 0)
        if (data.programs) setPrograms(data.programs)
        if (data.locations) setLocations(data.locations)
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error)
    } finally {
      setLoading(false)
    }
  }, [filterProgram, filterStatus, search, page])

  const fetchHolidays = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/holidays")
      if (res.ok) {
        const data = await res.json()
        setHolidays(data.holidays || [])
      }
    } catch (error) {
      console.error("Failed to fetch holidays:", error)
    }
  }, [])

  useEffect(() => {
    if (tab === "schedules") {
      fetchSchedules()
    } else {
      fetchHolidays()
    }
  }, [tab, fetchSchedules, fetchHolidays])

  const createSchedules = async () => {
    setCreateLoading(true)
    try {
      const res = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      })
      if (res.ok) {
        const data = await res.json()
        alert(`${data.count}개의 일정이 생성되었습니다.`)
        setCreateOpen(false)
        setNewSchedule({
          programId: "",
          locationId: "",
          startDate: "",
          endDate: "",
          startTime: "10:00",
          endTime: "12:00",
          maxCapacity: "20",
          weekdaysOnly: false,
        })
        fetchSchedules()
      }
    } catch (error) {
      console.error("Failed to create schedules:", error)
    } finally {
      setCreateLoading(false)
    }
  }

  const updateCapacity = async (scheduleId: number) => {
    setEditLoading(true)
    try {
      const res = await fetch("/api/admin/schedules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId, maxCapacity: parseInt(editCapacity, 10) }),
      })
      if (res.ok) {
        setEditId(null)
        fetchSchedules()
      }
    } catch (error) {
      console.error("Failed to update capacity:", error)
    } finally {
      setEditLoading(false)
    }
  }

  const deleteSchedule = async (scheduleId: number) => {
    if (!confirm("이 일정을 삭제하시겠습니까? 예약이 있는 일정은 삭제할 수 없습니다.")) return
    try {
      const res = await fetch(`/api/admin/schedules?id=${scheduleId}`, { method: "DELETE" })
      if (res.ok) {
        fetchSchedules()
      } else {
        const data = await res.json()
        alert(data.error || "삭제 실패")
      }
    } catch (error) {
      console.error("Failed to delete schedule:", error)
    }
  }

  const createHoliday = async () => {
    setHolidayLoading(true)
    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHoliday),
      })
      if (res.ok) {
        setHolidayOpen(false)
        setNewHoliday({ holidayDate: "", name: "", description: "", isRecurring: false, locationId: "" })
        fetchHolidays()
      }
    } catch (error) {
      console.error("Failed to create holiday:", error)
    } finally {
      setHolidayLoading(false)
    }
  }

  const deleteHoliday = async (holidayId: number) => {
    if (!confirm("이 휴무일을 삭제하시겠습니까?")) return
    try {
      const res = await fetch(`/api/admin/holidays?id=${holidayId}`, { method: "DELETE" })
      if (res.ok) {
        fetchHolidays()
      }
    } catch (error) {
      console.error("Failed to delete holiday:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border bg-card px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{"일정 및 휴무 관리"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {"프로그램 일정, 정원, 휴무일을 관리합니다."}
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="schedules" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                {"일정 관리"}
              </TabsTrigger>
              <TabsTrigger value="holidays" className="gap-2">
                <CalendarOff className="h-4 w-4" />
                {"휴무일 관리"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedules" className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="프로그램, 장소 검색..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9"
                  />
                </div>
                <Select value={filterProgram} onValueChange={(v) => { setFilterProgram(v); setPage(1); }}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="프로그램 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{"전체 프로그램"}</SelectItem>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{"전체"}</SelectItem>
                    <SelectItem value="open">{"접수중"}</SelectItem>
                    <SelectItem value="full">{"마감"}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={fetchSchedules} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {"일정 추가"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{"새 일정 추가"}</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-4 pt-2" onSubmit={(e) => { e.preventDefault(); createSchedules(); }}>
                      <div className="flex flex-col gap-2">
                        <Label>{"프로그램"}</Label>
                        <Select value={newSchedule.programId} onValueChange={(v) => setNewSchedule({ ...newSchedule, programId: v })}>
                          <SelectTrigger><SelectValue placeholder="프로그램 선택" /></SelectTrigger>
                          <SelectContent>
                            {programs.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>{p.number}. {p.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"장소"}</Label>
                        <Select value={newSchedule.locationId} onValueChange={(v) => setNewSchedule({ ...newSchedule, locationId: v })}>
                          <SelectTrigger><SelectValue placeholder="장소 선택" /></SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label>{"시작 날짜"}</Label>
                          <Input type="date" value={newSchedule.startDate} onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })} required />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>{"종료 날짜"}</Label>
                          <Input type="date" value={newSchedule.endDate} onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label>{"시작 시간"}</Label>
                          <Input type="time" value={newSchedule.startTime} onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>{"종료 시간"}</Label>
                          <Input type="time" value={newSchedule.endTime} onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"정원"}</Label>
                        <Input type="number" value={newSchedule.maxCapacity} onChange={(e) => setNewSchedule({ ...newSchedule, maxCapacity: e.target.value })} min="1" required />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="weekdays" checked={newSchedule.weekdaysOnly} onCheckedChange={(v) => setNewSchedule({ ...newSchedule, weekdaysOnly: v })} />
                        <Label htmlFor="weekdays">{"평일만 생성 (주말 제외)"}</Label>
                      </div>
                      <Button type="submit" className="mt-2" disabled={createLoading || !newSchedule.programId || !newSchedule.locationId}>
                        {createLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {"일정 생성"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-border/60">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : schedules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
                      <p>{"일정이 없습니다."}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"프로그램"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"장소"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"날짜"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"시간"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"정원"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"상태"}</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"관리"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedules.map((schedule) => {
                            const schedId = schedule.schedule_id || schedule.id
                            const pct = schedule.max_capacity > 0 ? Math.round((schedule.booked_count / schedule.max_capacity) * 100) : 0
                            return (
                              <tr key={schedId} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                                <td className="px-5 py-3.5 text-sm font-medium text-foreground">{schedule.program_title}</td>
                                <td className="px-5 py-3.5">
                                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {schedule.location_name}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <CalendarDays className="h-3 w-3" />
                                    {formatDate(schedule.schedule_date)}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-sm text-muted-foreground">
                                  {schedule.start_time && schedule.end_time ? `${schedule.start_time?.slice(0, 5)} - ${schedule.end_time?.slice(0, 5)}` : "-"}
                                </td>
                                <td className="px-5 py-3.5">
                                  {editId === schedId ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        value={editCapacity}
                                        onChange={(e) => setEditCapacity(e.target.value)}
                                        className="h-8 w-20"
                                        min={schedule.booked_count}
                                      />
                                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateCapacity(schedId)} disabled={editLoading}>
                                        {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Users className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-sm text-foreground font-medium">{schedule.booked_count}/{schedule.max_capacity}</span>
                                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                                        <div
                                          className={`h-full rounded-full ${schedule.status === "full" ? "bg-destructive" : "bg-primary"}`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="px-5 py-3.5">
                                  {schedule.status === "full" ? (
                                    <Badge variant="destructive">{"마감"}</Badge>
                                  ) : (
                                    <Badge variant="outline">{"접수중"}</Badge>
                                  )}
                                  {schedule.pending_count > 0 && (
                                    <Badge variant="secondary" className="ml-1">{schedule.pending_count}{"대기"}</Badge>
                                  )}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => { setEditId(schedId); setEditCapacity(String(schedule.max_capacity)); }}
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={() => deleteSchedule(schedId)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
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
                <p className="text-sm text-muted-foreground">{"총 "}{total}{"개 일정"}</p>
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
            </TabsContent>

            <TabsContent value="holidays" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{"휴무일에는 예약이 불가능합니다."}</p>
                <Dialog open={holidayOpen} onOpenChange={setHolidayOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {"휴무일 추가"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{"휴무일 추가"}</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-4 pt-2" onSubmit={(e) => { e.preventDefault(); createHoliday(); }}>
                      <div className="flex flex-col gap-2">
                        <Label>{"날짜"}</Label>
                        <Input type="date" value={newHoliday.holidayDate} onChange={(e) => setNewHoliday({ ...newHoliday, holidayDate: e.target.value })} required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"휴무 사유"}</Label>
                        <Input placeholder="예: 추석, 임시휴무" value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"적용 장소 (선택)"}</Label>
                        <Select value={newHoliday.locationId || "all"} onValueChange={(v) => setNewHoliday({ ...newHoliday, locationId: v === "all" ? "" : v })}>
                          <SelectTrigger><SelectValue placeholder="전체 장소" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{"전체 장소"}</SelectItem>
                            {locations.map((loc) => (
                              <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="recurring" checked={newHoliday.isRecurring} onCheckedChange={(v) => setNewHoliday({ ...newHoliday, isRecurring: v })} />
                        <Label htmlFor="recurring">{"매년 반복"}</Label>
                      </div>
                      <Button type="submit" disabled={holidayLoading || !newHoliday.holidayDate}>
                        {holidayLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {"휴무일 추가"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-border/60">
                <CardContent className="p-0">
                  {holidays.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <CalendarOff className="h-12 w-12 mb-3 opacity-30" />
                      <p>{"등록된 휴무일이 없습니다."}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"날짜"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"사유"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"적용 장소"}</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"반복"}</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">{"관리"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holidays.map((holiday) => (
                            <tr key={holiday.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                              <td className="px-5 py-3.5">
                                <span className="flex items-center gap-1.5 text-sm text-foreground">
                                  <CalendarOff className="h-3 w-3 text-destructive" />
                                  {formatDate(holiday.holiday_date)}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-muted-foreground">{holiday.name || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-muted-foreground">{holiday.location_name || "전체"}</td>
                              <td className="px-5 py-3.5">
                                {holiday.is_recurring ? <Badge variant="secondary">{"매년"}</Badge> : <Badge variant="outline">{"일회성"}</Badge>}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => deleteHoliday(holiday.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
