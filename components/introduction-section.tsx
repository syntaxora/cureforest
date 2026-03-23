"use client"

import Image from "next/image"
import { Leaf, TreePine, Heart, Sparkles, Shield, Wind } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

const healingFactors = [
  { icon: Wind, label: "피톤치드" },
  { icon: Sparkles, label: "음이온" },
  { icon: Shield, label: "경관" },
  { icon: Leaf, label: "소리" },
]

export function IntroductionSection() {
  return (
    <section id="introduction" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <ScrollAnimate variant="fade-up">
          <div className="mb-20 flex flex-col items-center text-center">
            <span className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              01. About Forest Healing
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              {"산림치유 소개"}
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
          </div>
        </ScrollAnimate>

        {/* 산림치유 정의 */}
        <div className="mb-24 grid items-center gap-12 lg:grid-cols-2">
          <ScrollAnimate variant="fade-right">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Leaf className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  {"산림치유란?"}
                </h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {"산림치유(Forest Therapy)란 숲에 존재하는 다양한 환경요소를 활용하여 인체의 면역력을 높이고, 신체적 \u00B7 정신적 건강을 회복시키는 활동입니다."}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {"숲의 경관, 소리, 피톤치드, 음이온, 햇빛 등 자연의 치유 인자를 통해 스트레스를 해소하고 심신의 건강을 증진합니다. 산림치유는 의료 행위가 아닌, 자연을 매개로 한 건강 증진 활동으로 누구나 안전하게 참여할 수 있습니다."}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {healingFactors.map((factor, i) => {
                  const Icon = factor.icon
                  return (
                    <ScrollAnimate key={i} variant="zoom-in" delay={i * 50}>
                      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-xs font-medium text-card-foreground">{factor.label}</span>
                      </div>
                    </ScrollAnimate>
                  )
                })}
              </div>
            </div>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/forest-therapy.jpg"
                alt="산림치유 프로그램 진행 모습"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollAnimate>
        </div>

        {/* 치유의 숲 정의 */}
        <div className="mb-24 grid items-center gap-12 lg:grid-cols-2">
          <ScrollAnimate variant="fade-right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl order-last lg:order-first">
              <Image
                src="/images/healing-forest.jpg"
                alt="치유의 숲 전경"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-left">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TreePine className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  {"치유의 숲이란?"}
                </h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {"치유의 숲은 인체의 면역력을 높이고 건강을 증진시키기 위하여 산림치유에 적합한 산림을 대상으로 조성한 공간입니다."}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {"숲길, 치유센터, 명상공간, 수(水)치유 시설 등 다양한 치유 인프라를 갖추고 있으며, 산림청 인증 전문 산림치유지도사가 대상별 맞춤 프로그램을 운영합니다."}
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "숲길 \u00B7 데크로드 등 산책 시설",
                  "치유센터 \u00B7 명상 쉼터",
                  "수(水)치유 \u00B7 족욕 체험 공간",
                  "야외 치유 프로그램 운영 공간",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Leaf className="h-3.5 w-3.5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimate>
        </div>

        {/* 산림치유 대상 */}
        <div id="targets">
          <ScrollAnimate variant="fade-up">
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  {"산림치유 대상"}
                </h3>
              </div>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                {"산림치유는 남녀노소 누구에게나 열려있습니다. 대상별 특성에 맞는 맞춤 프로그램으로 최적의 치유 효과를 제공합니다."}
              </p>
            </div>
          </ScrollAnimate>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "일반 성인 \u00B7 직장인",
                desc: "업무 스트레스 해소, 번아웃 예방, 심신 회복 및 업무 효율 향상을 위한 프로그램",
              },
              {
                title: "학생 \u00B7 청소년",
                desc: "학업 스트레스 완화, 집중력 향상, 정서 안정 및 또래 관계 개선 프로그램",
              },
              {
                title: "임산부 \u00B7 영유아 가족",
                desc: "태교 숲 체험, 산후 회복, 영유아 오감 발달 및 부모-자녀 유대 강화 프로그램",
              },
              {
                title: "어르신 \u00B7 시니어",
                desc: "치매 예방, 근력 강화, 정서적 안정 및 사회적 교류를 위한 시니어 맞춤 프로그램",
              },
              {
                title: "장애인 \u00B7 특수 대상",
                desc: "무장애 숲길을 활용한 접근성 높은 산림치유와 감각 자극 프로그램",
              },
              {
                title: "만성질환 \u00B7 건강관리 대상",
                desc: "고혈압, 당뇨, 아토피, 우울증 등 만성질환 증상 완화를 위한 특화 프로그램",
              },
            ].map((item, i) => (
              <ScrollAnimate key={i} variant="fade-up" delay={i * 40}>
                <div className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg h-full">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-lg font-bold transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h4 className="mb-2 text-base font-bold text-card-foreground">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
