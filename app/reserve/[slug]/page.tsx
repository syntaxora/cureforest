import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReservationForm } from "@/components/programs/reservation-form"
import { locationPrograms } from "@/lib/locations-data"

function getLocationBySlug(slug: string) {
  return locationPrograms.find((loc) => loc.slug === slug) || null
}

export async function generateStaticParams() {
  return locationPrograms.map((location) => ({
    slug: location.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const location = getLocationBySlug(slug)

  if (!location) {
    return { title: "장소를 찾을 수 없습니다" }
  }

  return {
    title: `${location.title} 예약 | CureForest 큐어포레스트`,
    description: `${location.title} 프로그램을 예약하세요. ${location.shortDescription}`,
  }
}

export default async function ReserveLocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = getLocationBySlug(slug)

  if (!location) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ReservationForm
            programTitle={location.title}
            programNumber={location.number}
            programSubtitle={location.subtitle}
            programSlug={location.slug}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
