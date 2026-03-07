"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  TreePine,
  LogOut,
  MessageSquare,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ADMIN_BASE = "/cure-mgmt-2410"

const navItems = [
  { label: "대시보드", href: `${ADMIN_BASE}/dashboard`, icon: LayoutDashboard },
  { label: "일정 관리", href: `${ADMIN_BASE}/schedules`, icon: CalendarDays },
  { label: "예약 관리", href: `${ADMIN_BASE}/reservations`, icon: ClipboardList },
  { label: "문의 관리", href: `${ADMIN_BASE}/inquiries`, icon: MessageSquare },
  { label: "프로그램 관리", href: `${ADMIN_BASE}/programs`, icon: TreePine },
  { label: "장소 관리", href: `${ADMIN_BASE}/locations`, icon: MapPin },
  { label: "관리자 계정", href: `${ADMIN_BASE}/users`, icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TreePine className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{"CureForest"}</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{"Admin"}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href={ADMIN_BASE}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {"로그아웃"}
        </Link>
      </div>
    </aside>
  )
}
