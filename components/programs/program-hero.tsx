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
          CureForest Programs
        </span>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-background sm:text-5xl lg:text-6xl text-balance">
          {"프로그램 안내"}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-background/80">
          {"큐어포레스트는 동탄호수공원, 다올공원, 무봉산 자연휴양림, 화성시 일대에서 다양한 산림치유 힐링 프로그램을 운영합니다."}
        </p>
      </div>
    </section>
  )
}
