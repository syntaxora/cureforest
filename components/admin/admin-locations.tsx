"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Phone, Mail, Clock, Edit2, Plus, Loader2, RefreshCw, Calendar, UserCheck, Trash2 } from "lucide-react"

interface Location {
  id: number
  slug: string
  name: string
  address: string | null
  phone: string | null
  description: string | null
  image_url: string | null
  operating_hours: string | null
  contact_email: string | null
  is_active: boolean
  schedule_count: number
  reservation_count: number
  total_participants: number
}

export function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editLocation, setEditLocation] = useState<Partial<Location> | null>(null)
  const [saving, setSaving] = useState(false)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/locations")
      if (res.ok) {
        const data = await res.json()
        setLocations(data.locations || [])
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const toggleActive = async (locationId: number, isActive: boolean) => {
    setToggleLoading(locationId)
    try {
      const res = await fetch("/api/admin/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, isActive }),
      })
      if (res.ok) {
        setLocations(locations.map(l => l.id === locationId ? { ...l, is_active: isActive } : l))
      }
    } catch (error) {
      console.error("Failed to toggle location:", error)
    } finally {
      setToggleLoading(null)
    }
  }

  const saveLocation = async () => {
    if (!editLocation) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editLocation),
      })
      if (res.ok) {
        setEditOpen(false)
        setEditLocation(null)
        fetchLocations()
      }
    } catch (error) {
      console.error("Failed to save location:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteLocationById = async (locationId: number) => {
    if (!confirm("이 장소를 삭제하시겠습니까? 일정이 있는 장소는 삭제할 수 없습니다.")) return
    try {
      const res = await fetch(`/api/admin/locations?id=${locationId}`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok) {
        fetchLocations()
      } else {
        alert(data.error || "삭제 실패")
      }
    } catch (error) {
      console.error("Failed to delete location:", error)
    }
  }

  const openEdit = (location?: Location) => {
    if (location) {
      setEditLocation({ ...location })
    } else {
      setEditLocation({
        slug: "",
        name: "",
        address: "",
        phone: "",
        description: "",
        operating_hours: "",
        contact_email: "",
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
            <h1 className="text-2xl font-bold text-foreground">{"장소 관리"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {"치유의 숲 장소 정보를 관리합니다."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchLocations} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => openEdit()}>
                  <Plus className="h-4 w-4" />
                  {"장소 추가"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editLocation?.id ? "장소 수정" : "장소 추가"}</DialogTitle>
                </DialogHeader>
                {editLocation && (
                  <form className="flex flex-col gap-4 pt-2" onSubmit={(e) => { e.preventDefault(); saveLocation(); }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>{"슬러그 (URL)"}</Label>
                        <Input
                          value={editLocation.slug || ""}
                          onChange={(e) => setEditLocation({ ...editLocation, slug: e.target.value })}
                          placeholder="seoul"
                          required
                          disabled={!!editLocation.id}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"장소명"}</Label>
                        <Input
                          value={editLocation.name || ""}
                          onChange={(e) => setEditLocation({ ...editLocation, name: e.target.value })}
                          placeholder="서울 치유의 숲"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"주소"}</Label>
                      <Input
                        value={editLocation.address || ""}
                        onChange={(e) => setEditLocation({ ...editLocation, address: e.target.value })}
                        placeholder="서울특별시 OO구 OO로 123"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>{"전화번호"}</Label>
                        <Input
                          value={editLocation.phone || ""}
                          onChange={(e) => setEditLocation({ ...editLocation, phone: e.target.value })}
                          placeholder="02-1234-5678"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{"이메일"}</Label>
                        <Input
                          type="email"
                          value={editLocation.contact_email || ""}
                          onChange={(e) => setEditLocation({ ...editLocation, contact_email: e.target.value })}
                          placeholder="contact@example.com"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"운영 시간"}</Label>
                      <Input
                        value={editLocation.operating_hours || ""}
                        onChange={(e) => setEditLocation({ ...editLocation, operating_hours: e.target.value })}
                        placeholder="09:00 - 18:00 (월-금)"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{"설명"}</Label>
                      <Textarea
                        value={editLocation.description || ""}
                        onChange={(e) => setEditLocation({ ...editLocation, description: e.target.value })}
                        placeholder="장소에 대한 상세 설명"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editLocation.is_active ?? true}
                        onCheckedChange={(v) => setEditLocation({ ...editLocation, is_active: v })}
                      />
                      <Label>{"장소 활성화"}</Label>
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
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <MapPin className="h-12 w-12 mb-3 opacity-30" />
              <p>{"등록된 장소가 없습니다."}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <Card key={location.id} className={`border-border/60 transition-shadow hover:shadow-md ${!location.is_active ? "opacity-60" : ""}`}>
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{location.name}</p>
                          <p className="text-xs text-muted-foreground">{location.address || "주소 미등록"}</p>
                        </div>
                      </div>
                      {!location.is_active && <Badge variant="secondary">{"비활성"}</Badge>}
                    </div>

                    {location.description && (
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {location.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                      {location.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          {location.phone}
                        </span>
                      )}
                      {location.contact_email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          {location.contact_email}
                        </span>
                      )}
                      {location.operating_hours && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {location.operating_hours}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {"일정 "}{location.schedule_count}{"건"}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {"참가 "}{location.total_participants}{"명"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={location.is_active}
                          onCheckedChange={(v) => toggleActive(location.id, v)}
                          disabled={toggleLoading === location.id}
                        />
                        <label className="text-xs font-medium text-muted-foreground">
                          {"활성"}
                        </label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => openEdit(location)}>
                          <Edit2 className="h-3 w-3" />
                          {"수정"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deleteLocationById(location.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
