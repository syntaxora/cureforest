import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { locationPrograms, getLocationBySlug } from "@/lib/locations-data"
import { MapPin, Clock, Users, CalendarCheck, Check } from "lucide-react"

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
    title: `${location.title} | CureForest 큐어포레스트`,
    description: location.shortDescription,
  }
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = getLocationBySlug(slug)

  if (!location) {
    notFound()
  }

  const Icon = location.icon

  return (
    <>
      <Header />
      {/* Sticky Reservation Button */}
      <div className="fixed right-6 bottom-6 z-50 md:right-8 md:bottom-8">
        <Button asChild size="lg" className="gap-2 shadow-lg px-6 py-6 text-lg h-auto">
          <Link href={`/reserve/${location.slug}`}>
            <CalendarCheck className="h-6 w-6" />
            {"예약하기"}
          </Link>
        </Button>
      </div>
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
          <Image
            src={location.image}
            alt={location.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-8 w-8" />
              </div>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight text-background sm:text-4xl lg:text-5xl text-balance">
              {location.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-background/90">
              {location.tagline}
            </p>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {location.secondaryTagline}
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2">
              {location.galleryImages.map((img, index) => (
                <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={img}
                    alt={`${location.title} 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={75}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column - Details */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">프로그램 정보</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">장소</p>
                      <p className="text-muted-foreground">{location.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">소요 시간</p>
                      <p className="text-muted-foreground">{location.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">대상</p>
                      <p className="text-muted-foreground">{location.target}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">특징</h2>
                <ul className="space-y-3">
                  {location.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Notices Section */}
        <section className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 text-center font-serif text-2xl font-bold text-foreground">안내사항</h2>
            <div className="rounded-2xl bg-card p-6 shadow-sm">
              <ul className="space-y-3">
                {location.notices.map((notice, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {notice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="font-serif text-2xl font-bold text-primary-foreground sm:text-3xl">
              {location.title}에서 특별한 치유를 경험하세요
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              산림치유지도사가 안내하��� 프로그램에 참여해보세요.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
