import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { programs } from "@/lib/programs-data"

export function ProgramList() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.15em] text-primary">
          {"6 Programs"}
        </p>
        <h2 className="mb-4 text-center font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
          {"숲 치유 프로그램"}
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center leading-relaxed text-muted-foreground">
          {"본 프로그램은 실내 및 실외에서 진행됩니다. 각 프로그램을 클릭하여 자세한 내용을 확인해 보세요."}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon
            return (
              <div
                key={program.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {/* Full card link */}
                <Link
                  href={`/programs/${program.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`${program.title} 자세히 보기`}
                />

                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-foreground/20 transition-opacity group-hover:bg-foreground/10" />
                  <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-1 text-xs font-medium uppercase tracking-[0.1em] text-primary">
                    {program.subtitle}
                  </span>
                  <h3 className="mb-2 font-serif text-xl font-bold text-card-foreground">
                    {program.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {program.shortDescription}
                  </p>

                  {/* Effects tags */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {program.effects.slice(0, 3).map((effect, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-primary">
                    {"자세히 보기"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
