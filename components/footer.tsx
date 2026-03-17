import Link from "next/link"
import { TreePine, Mail, MessageSquare } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-foreground py-16 text-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <TreePine className="h-6 w-6" />
              <span className="text-lg font-bold tracking-tight">CureForest</span>
            </div>
            <p className="text-sm leading-relaxed text-background/60">
              {"큐어포레스트는 산림치유 전문 힐링프로그램 운영업체입니다. 자연과 함께하는 치유의 경험을 통해 몸과 마음의 건강을 되찾으실 수 있도록 도와드립니다."}
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-background/80">{"바로가기"}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-background/50 transition-colors hover:text-background">{"큐어포레스트"}</Link>
              <Link href="/programs" className="text-sm text-background/50 transition-colors hover:text-background">{"프로그램 안내"}</Link>
              <Link href="/reserve" className="text-sm text-background/50 transition-colors hover:text-background">{"프로그램 예약"}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-background/80">{"문의하기"}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:cureforest@naver.com" className="transition-colors hover:text-background">
                  cureforest@naver.com
                </a>
              </div>
              <Link
                href="/contact"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-background/10 px-4 py-2.5 text-sm font-medium text-background/80 transition-colors hover:bg-background/20 hover:text-background"
              >
                <MessageSquare className="h-4 w-4" />
                {"온라인 문의하기"}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-background/10 pt-8">
          <p className="text-xs text-background/40">
            {"\u00A9 2026 CureForest 큐어포레스트. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
