import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { IntroductionSection } from "@/components/introduction-section"
import { EffectsSection } from "@/components/effects-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <IntroductionSection />
        <EffectsSection />
      </main>
      <Footer />
    </>
  )
}
