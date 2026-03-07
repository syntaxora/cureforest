import Link from "next/link"
import { Phone, Mail } from "lucide-react"

export function ProgramCTA() {
  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
          {"나에게 맞는 프로그램이 궁금하신가요?"}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-primary-foreground/80">
          {"산림치유지도사가 대상과 건강 상태에 맞춰 최적의 프로그램을 안내해 드립니다. 편하게 문의해 주세요."}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="tel:010-8416-8058"
            className="flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-bold text-primary transition-opacity hover:opacity-90"
          >
            <Phone className="h-4 w-4" />
            {"010-8416-8058"}
          </Link>
          <Link
            href="mailto:cure2410@naver.com"
            className="flex items-center gap-2 rounded-full border border-primary-foreground/30 px-8 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <Mail className="h-4 w-4" />
            {"cure2410@naver.com"}
          </Link>
        </div>
      </div>
    </section>
  )
}
