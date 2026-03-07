import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProgramHero } from "@/components/programs/program-hero"
import { ProgramList } from "@/components/programs/program-list"
import { ProgramCTA } from "@/components/programs/program-cta"

export const metadata: Metadata = {
  title: "숲 치유 세부 프로그램 | CureForest 큐어포레스트",
  description:
    "큐어포레스트의 오감 열기, 싱잉볼 테라피, 아로마 테라피, 컬러 테라피, 소도구 테라피, 손발 마사지, 신체활동, 차 명상, 숲 명상 등 9가지 산림치유 프로그램을 소개합니다.",
}

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main>
        <ProgramHero />
        <ProgramList />
        <ProgramCTA />
      </main>
      <Footer />
    </>
  )
}
