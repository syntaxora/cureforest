import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, ChevronRight, CalendarCheck, CheckCircle, AlertCircle, HelpCircle, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProgramCTA } from "@/components/programs/program-cta"
import { programs, getProgramBySlug } from "@/lib/programs-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
          <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-6 py-5 sm:gap-8">
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
              <span>{program.capacity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Banknote className="h-4 w-4 text-primary" />
              <span>{program.price}</span>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            {/* Program Introduction */}
            <div className="mb-16">
              <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">
                {"프로그램 소개"}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {program.fullDescription}
              </p>
            </div>

            {/* Target */}
            <div className="mb-16 rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Users className="h-4 w-4" />
                {"이런 분께 추천합니다"}
              </div>
              <p className="mt-2 text-lg text-foreground">{program.target}</p>
            </div>

            {/* Details & Effects */}
            <div className="mb-16 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="mb-5 font-serif text-xl font-bold text-foreground">
                  {"프로그램 내용"}
                </h3>
                <ul className="flex flex-col gap-3">
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
              </div>
              <div>
                <h3 className="mb-5 font-serif text-xl font-bold text-foreground">
                  {"기대 효과"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {program.effects.map((effect, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-16">
              <h3 className="mb-5 font-serif text-xl font-bold text-foreground">
                {"프로그램 특징"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {program.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="mb-16 rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-8 font-serif text-xl font-bold text-card-foreground">
                {"진행 순서"}
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {program.steps.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <h4 className="mt-4 font-medium text-card-foreground">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub Programs */}
            {program.subPrograms && program.subPrograms.length > 0 && (
              <div className="mb-16">
                <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
                  {"세부 프로그램"}
                </h2>
                <div className="flex flex-col gap-16">
                  {program.subPrograms.map((sub, index) => (
                    <div
                      key={sub.id}
                      className={`grid gap-8 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    >
                      {/* Image */}
                      <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                        <Image
                          src={sub.image}
                          alt={sub.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                            {sub.duration}
                          </span>
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                            {sub.target}
                          </span>
                        </div>
                        
                        <h3 className="mb-4 font-serif text-2xl font-bold text-foreground">
                          {sub.title}
                        </h3>
                        
                        <p className="mb-6 leading-relaxed text-muted-foreground">
                          {sub.fullDescription}
                        </p>
                        
                        {/* Highlights */}
                        <div className="mb-6">
                          <h4 className="mb-3 text-sm font-medium text-foreground">{"주요 내용"}</h4>
                          <div className="flex flex-wrap gap-2">
                            {sub.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                              >
                                <CheckCircle className="h-3 w-3" />
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Activities */}
                        <div>
                          <h4 className="mb-3 text-sm font-medium text-foreground">{"활동 구성"}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {sub.activities.map((activity, i) => (
                              <span key={i} className="flex items-center gap-2">
                                {activity}
                                {i < sub.activities.length - 1 && (
                                  <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notices */}
            <div className="mb-16 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                {"참가 안내사항"}
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {program.notices.map((notice, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{notice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            {program.faqs && program.faqs.length > 0 && (
              <div className="mb-16">
                <h3 className="mb-6 flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {"자주 묻는 질문"}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {program.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-foreground hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Reserve button */}
            <div className="flex justify-center">
              <Button asChild size="lg" className="gap-2 px-8 text-base">
                <Link href={`/reserve/${program.slug}`}>
                  <CalendarCheck className="h-5 w-5" />
                  {"이 프로그램 예약하기"}
                </Link>
              </Button>
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
