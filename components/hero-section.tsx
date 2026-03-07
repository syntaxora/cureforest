"use client"

import Image from "next/image"
import { ScrollAnimate } from "@/components/scroll-animate"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-forest.jpg"
        alt="고요한 숲속 풍경"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <ScrollAnimate variant="fade-in" delay={0}>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary-foreground/80">
            Forest Healing Program
          </p>
        </ScrollAnimate>
        <ScrollAnimate variant="fade-up" delay={100}>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            {"숲이 선사하는"}
            <br />
            {"치유의 시간"}
          </h1>
        </ScrollAnimate>
        <ScrollAnimate variant="fade-up" delay={200}>
          <p className="max-w-lg text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            {"자연 속에서 몸과 마음의 균형을 되찾는 산림치유 프로그램, 큐어포레스트와 함께하세요."}
          </p>
        </ScrollAnimate>
        <ScrollAnimate variant="zoom-in" delay={300}>
          <a
            href="#introduction"
            className="mt-4 inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            {"자세히 알아보기"}
          </a>
        </ScrollAnimate>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary-foreground/40 p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-primary-foreground/60" />
        </div>
      </div>
    </section>
  )
}
