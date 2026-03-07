"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, TreePine, CalendarCheck, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"



export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <TreePine className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            CureForest
          </span>
        </Link>

        {/* Desktop action buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Link href="/contact">
              <Phone className="h-4 w-4" />
              {"문의하기"}
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5">
            <Link href="/programs">
              <CalendarCheck className="h-4 w-4" />
              {"프로그램 예약"}
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex items-center justify-center md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex flex-col border-t border-border bg-background px-6 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild className="justify-start gap-2">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                <Phone className="h-4 w-4" />
                {"문의하기"}
              </Link>
            </Button>
            <Button size="sm" asChild className="justify-start gap-2">
              <Link href="/programs" onClick={() => setMobileOpen(false)}>
                <CalendarCheck className="h-4 w-4" />
                {"프로그램 예약"}
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
