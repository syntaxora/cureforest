"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Plus,
  Shield,
  ShieldCheck,
  User,
  MoreVertical,
  Check,
  X,
  Loader2,
  Clock,
  RefreshCw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminUser {
  id: number
  email: string
  name: string
  phone: string | null
  role: "super_admin" | "admin" | "staff"
  is_active: boolean
  last_login_at: string | null
  created_at: string
}

const roleConfig: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  super_admin: { label: "최고 관리자", icon: ShieldCheck, color: "text-primary" },
  admin: { label: "관리자", icon: Shield, color: "text-chart-2" },
  staff: { label: "스태프", icon: User, color: "text-muted-foreground" },
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "staff",
  })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const [usersRes, pendingRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/users?pending=true"),
      ])

      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.users.filter((u: AdminUser) => u.is_active))
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json()
        setPendingUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApprove = async (userId: number) => {
    setProcessing(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, action: "approve" }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to approve user:", error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: number) => {
    if (!confirm("정말 이 가입 요청을 거부하시겠습니까?")) return

    setProcessing(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, action: "reject" }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to reject user:", error)
    } finally {
      setProcessing(null)
    }
  }

  const handleToggleActive = async (userId: number, currentActive: boolean) => {
    setProcessing(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, is_active: !currentActive }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to toggle user:", error)
    } finally {
      setProcessing(null)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    setAddError("")

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "사용자 생성에 실패했습니다.")
      }

      setAddDialogOpen(false)
      setFormData({ name: "", email: "", password: "", phone: "", role: "staff" })
      fetchUsers()
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "오류가 발생했습니다.")
    } finally {
      setAddLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{"관리자 계정"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {"관리자 계정을 추가하고 권한을 관리합니다."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {"계정 추가"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{"새 관리자 계정"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="flex flex-col gap-4 pt-2">
                  <div className="flex flex-col gap-2">
                    <Label>{"이름"}</Label>
                    <Input
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{"이메일"}</Label>
                    <Input
                      type="email"
                      placeholder="example@cureforest.kr"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{"비밀번호"}</Label>
                    <Input
                      type="password"
                      placeholder="4자 이상"
                      value={formData.password}
                      onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                      required
                      minLength={4}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{"연락처"}</Label>
                    <Input
                      type="tel"
                      placeholder="010-0000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{"역할"}</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">{"최고 관리자"}</SelectItem>
                        <SelectItem value="admin">{"관리자"}</SelectItem>
                        <SelectItem value="staff">{"스태프"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {addError && <p className="text-sm text-destructive">{addError}</p>}
                  <Button type="submit" className="mt-2" disabled={addLoading}>
                    {addLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {"생성 중..."}
                      </>
                    ) : (
                      "계정 생성"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-8 py-6">
          {/* Pending approvals */}
          {pendingUsers.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-chart-4" />
                <h2 className="text-sm font-semibold text-foreground">
                  {"승인 대기 중"} ({pendingUsers.length})
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {pendingUsers.map((user) => (
                  <Card key={user.id} className="border-chart-4/50 bg-chart-4/5">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-4/20 text-sm font-bold text-chart-4">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground/60">
                          {"신청일: "}
                          {formatDate(user.created_at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 border-chart-1/50 text-chart-1 hover:bg-chart-1/10"
                          onClick={() => handleApprove(user.id)}
                          disabled={processing === user.id}
                        >
                          {processing === user.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-3 w-3" />
                              {"승인"}
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(user.id)}
                          disabled={processing === user.id}
                        >
                          <X className="h-3 w-3" />
                          {"거부"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active users */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                {"활성 관리자"} ({users.length})
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {users.map((user) => {
                  const role = roleConfig[user.role]
                  const RoleIcon = role.icon
                  return (
                    <Card key={user.id} className="border-border/60">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-foreground">
                              {user.name}
                            </p>
                            {!user.is_active && (
                              <Badge variant="secondary" className="text-[10px]">
                                {"비활성"}
                              </Badge>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <RoleIcon className={`h-3.5 w-3.5 ${role.color}`} />
                            <span className="text-xs font-medium text-muted-foreground">
                              {role.label}
                            </span>
                            <span className="text-xs text-muted-foreground/60">
                              {"| 최근 로그인: "}
                              {formatDate(user.last_login_at)}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(user.id, user.is_active)}
                            >
                              {user.is_active ? "비활성화" : "활성화"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
