import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, ChevronRight, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProgramCTA } from "@/components/programs/program-cta"
import { programs, getProgramBySlug } from "@/lib/programs-data"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) return { title: "프로그램을 찾을 수 없습니다" }
  return {
    title: `${program.title} | CureForest 큐어포레스트`,
    description: program.shortDescription,
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) notFound()

  const Icon = program.icon
  const currentIndex = programs.findIndex((p) => p.slug === slug)
  const prevProgram = currentIndex > 0 ? programs[currentIndex - 1] : null
  const nextProgram =
    currentIndex < programs.length - 1 ? programs[currentIndex + 1] : null

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-20">
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-background/60">
              <Link href="/" className="hover:text-background/80">
                {"Home"}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/programs" className="hover:text-background/80">
                {"프로그램"}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-background/90">{program.title}</span>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <span className="text-sm font-medium uppercase tracking-[0.15em] text-background/70">
                  {program.number}. {program.subtitle}
                </span>
                <h1 className="font-serif text-3xl font-bold text-background sm:text-4xl lg:text-5xl">
                  {program.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Info bar */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-6 px-6 py-5 sm:gap-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{program.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>{program.target}</span>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-16 lg:grid-cols-5">
              {/* Left: description & details */}
              <div className="lg:col-span-3">
                <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">
                  {"프로그램 소개"}
                </h2>
                {program.description ? (
                  <div className="prose prose-sm max-w-none mb-10 text-muted-foreground dark:prose-invert prose-img:max-w-full prose-img:h-auto" 
                    dangerouslySetInnerHTML={{ __html: program.description }} />
                ) : (
                  <p className="mb-10 leading-relaxed text-muted-foreground lg:text-lg">
                    {program.fullDescription}
                  </p>
                )}

                <h3 className="mb-5 font-serif text-xl font-bold text-foreground">
                  {"세부 활동"}
                </h3>
                <ul className="mb-10 flex flex-col gap-3">
                  {program.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 leading-relaxed text-foreground"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mb-5 font-serif text-xl font-bold text-foreground">
                  {"기대 효과"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {program.effects.map((effect, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                    >
                      {effect}
                    </span>
                  ))}
                </div>

                {/* Reserve button */}
                <div className="mt-10">
                  <Button asChild size="lg" className="gap-2 text-base">
                    <Link href={`/programs/${program.slug}/reserve`}>
                      <CalendarCheck className="h-5 w-5" />
                      {"이 프로그램 예약하기"}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right: steps */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
                  <h3 className="mb-6 font-serif text-xl font-bold text-card-foreground">
                    {"진행 순서"}
                  </h3>
                  <ol className="flex flex-col gap-6">
                    {program.steps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {step.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prev / Next navigation */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto flex max-w-6xl items-stretch">
            {prevProgram ? (
              <Link
                href={`/programs/${prevProgram.slug}`}
                className="flex flex-1 items-center gap-3 px-6 py-6 transition-colors hover:bg-secondary"
              >
                <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <span className="text-xs text-muted-foreground">
                    {"이전 프로그램"}
                  </span>
                  <p className="text-sm font-medium text-card-foreground">
                    {prevProgram.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            <div className="w-px bg-border" />

            {nextProgram ? (
              <Link
                href={`/programs/${nextProgram.slug}`}
                className="flex flex-1 items-center justify-end gap-3 px-6 py-6 text-right transition-colors hover:bg-secondary"
              >
                <div>
                  <span className="text-xs text-muted-foreground">
                    {"다음 프로그램"}
                  </span>
                  <p className="text-sm font-medium text-card-foreground">
                    {nextProgram.title}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </section>

        <ProgramCTA />
      </main>
      <Footer />
    </>
  )
}
