import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProgramHero } from "@/components/programs/program-hero"
import { ProgramList } from "@/components/programs/program-list"
import { ProgramCTA } from "@/components/programs/program-cta"

export const metadata: Metadata = {
  title: "프로그램 안내 | CureForest 큐어포레스트",
  description:
    "큐어포레스트의 동탄호수공원 힐링프로그램, 생태 프로그램, 다올공원 힐링가드너, 무봉산 자연휴양림, 화성시 숲해설 등 산림치유 프로그램을 소개합니다.",
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
