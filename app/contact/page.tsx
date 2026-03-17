import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { TreePine, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "문의하기 | CureForest 큐어포레스트",
  description:
    "큐어포레스트 산림치유 프로그램에 대한 문의사항을 남겨주세요. 담당자가 확인 후 빠르게 답변드리겠습니다.",
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-primary/5 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <TreePine className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mb-3 font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              {"문의하기"}
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
              {"산림치유 프로그램에 대해 궁금한 점이 있으시면 아래 양식을 통해 문의해 주세요. 담당자가 확인 후 빠르게 답변드리겠습니다."}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Mail className="h-4 w-4 text-primary" />
              {"이메일: "}
              <a href="mailto:cureforest@naver.com" className="font-medium text-primary hover:underline">
                cureforest@naver.com
              </a>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="bg-background py-12 lg:py-16">
          <div className="mx-auto max-w-2xl px-6">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
