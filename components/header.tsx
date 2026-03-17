"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, CalendarCheck, Info, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-new.png"
            alt="CureForest 큐어포레스트 로고"
            width={180}
            height={44}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/contact">
              <MessageSquare className="mr-1.5 h-4 w-4" />
              {"문의하기"}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/programs">
              <Info className="mr-1.5 h-4 w-4" />
              {"프로그램 안내"}
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild className="gap-1.5">
            <Link href="/reserve">
              <CalendarCheck className="h-4 w-4" />
              {"프로그램 예약"}
            </Link>
          </Button>
        </nav>

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
            <Button variant="ghost" size="sm" asChild className="justify-start gap-2">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                <MessageSquare className="h-4 w-4" />
                {"문의하기"}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start gap-2">
              <Link href="/programs" onClick={() => setMobileOpen(false)}>
                <Info className="h-4 w-4" />
                {"프로그램 안내"}
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild className="justify-start gap-2">
              <Link href="/reserve" onClick={() => setMobileOpen(false)}>
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
