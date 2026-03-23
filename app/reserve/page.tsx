import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { locationPrograms } from "@/lib/locations-data"

export const metadata = {
  title: "프로그램 예약 | CureForest 큐어포레스트",
  description: "큐어포레스트의 다양한 산림치유 프로그램을 예약하세요.",
}

export default function ReservePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden">
          <Image
            src="/images/hero-main.jpg"
            alt="숲에서 자연 치유를 경험하는 사람들"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-background/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-background/80">
              Program Reservation
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-background sm:text-4xl lg:text-5xl text-balance">
              {"프로그램 예약"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-background/80">
              {"원하시는 장소를 선택하여 프로그램을 예약해 주세요."}
            </p>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locationPrograms.map((location) => {
                const Icon = location.icon
                return (
                  <div
                    key={location.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="relative h-48 shrink-0 overflow-hidden">
                      <Image
                        src={location.image}
                        alt={location.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold text-background">{location.number}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 text-lg font-bold text-foreground">
                        {location.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {location.shortDescription}
                      </p>
                      <div className="mb-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{location.address}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{location.duration}</span>
                        </span>
                      </div>
                      <Button asChild className="mt-auto w-full gap-2">
                        <Link href={`/locations/${location.slug}`}>
                          <ArrowRight className="h-4 w-4" />
                          {"자세히 보기"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
