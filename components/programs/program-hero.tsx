import Image from "next/image"

export function ProgramHero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-20">
      <Image
        src="/images/hero-forest.jpg"
        alt="숲 치유 프로그램 배경"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <span className="mb-4 inline-block rounded-full border border-background/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-background/80">
          03. Forest Healing Programs
        </span>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-background sm:text-5xl lg:text-6xl text-balance">
          {"숲 치유 세부 프로그램"}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-background/80">
          {"큐어포레스트는 숲의 다양한 자원과 환경을 활용하여 대상과 목적에 맞는 체계적인 산림치유 프로그램을 운영합니다. 자연 속에서 몸과 마음의 회복을 경험해 보세요."}
        </p>
      </div>
    </section>
  )
}
