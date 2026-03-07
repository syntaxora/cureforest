import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReservationForm } from "@/components/programs/reservation-form"
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
    title: `${program.title} 예약 | CureForest 큐어포레스트`,
    description: `${program.title} 프로그램을 예약하세요. ${program.shortDescription}`,
  }
}

export default async function ReservationPage({ params }: Props) {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) notFound()

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page header */}
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-3xl px-6 py-10">
            <Link
              href={`/programs/${program.slug}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {`${program.title} 소개로 돌아가기`}
            </Link>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              {`${program.title} 예약`}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {"아래 양식을 작성하고 희망 날짜를 선택하여 프로그램을 예약하세요."}
            </p>

            {/* Quick info */}
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                <MapPin className="h-3 w-3 text-primary" />
                {program.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                <Clock className="h-3 w-3 text-primary" />
                {program.duration}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                <Users className="h-3 w-3 text-primary" />
                {program.target}
              </span>
            </div>
          </div>
        </section>

        {/* Reservation form */}
        <section className="bg-background py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-6">
            <ReservationForm
              programTitle={program.title}
              programNumber={program.number}
              programSubtitle={program.subtitle}
              programSlug={program.slug}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
