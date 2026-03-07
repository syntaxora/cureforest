"use client"

import Image from "next/image"
import { Activity, Brain, Users, Smile, ShieldCheck, HeartPulse } from "lucide-react"
import { EffectsCharts } from "@/components/effects-charts"
import { ScrollAnimate } from "@/components/scroll-animate"

const stats = [
  { stat: "52%", label: "스트레스 감소", desc: "코르티솔 수치 평균 52% 감소" },
  { stat: "40%", label: "면역력 증가", desc: "NK세포 활성도 평균 40% 향상" },
  { stat: "28", unit: "mmHg", label: "혈압 안정화", desc: "수축기 혈압 평균 28mmHg 감소" },
  { stat: "65%", label: "우울감 개선", desc: "우울 척도 점수 평균 65% 개선" },
]

const effectCategories = [
  {
    icon: HeartPulse,
    title: "신체적 효과",
    items: [
      "면역력 강화 (NK세포 활성 증가)",
      "혈압 및 맥박 안정, 심혈관계 개선",
      "스트레스 호르몬(코르티솔) 감소",
      "근골격계 기능 향상 및 체력 증진",
      "호흡기 기능 개선 (피톤치드 흡입)",
    ],
  },
  {
    icon: Brain,
    title: "정신적 효과",
    items: [
      "우울감 및 불안 증상 완화",
      "집중력 \u00B7 창의력 \u00B7 인지 기능 향상",
      "자아 존중감 및 자기 효능감 회복",
      "수면의 질 개선 및 피로 해소",
      "정서 안정 및 심리적 회복탄력성 강화",
    ],
  },
  {
    icon: Users,
    title: "사회적 효과",
    items: [
      "대인관계 개선 및 소통 능력 향상",
      "공동체 의식 강화와 사회적 유대감 형성",
      "가족 간 친밀감 및 유대 강화",
      "직장 내 팀워크 및 협업 증진",
      "사회적 고립감 해소 및 삶의 질 향상",
    ],
  },
]

const programTypes = [
  { icon: Activity, title: "숲 산책 치유", desc: "숲길 걷기, 맨발 걷기, 지팡이 워킹 등을 통한 신체 활성화 프로그램" },
  { icon: Smile, title: "명상 \u00B7 호흡 치유", desc: "자연 속 명상, 복식호흡, 이완요법을 통한 정신적 안정 프로그램" },
  { icon: ShieldCheck, title: "감각 깨움 치유", desc: "오감 활용 자연 체험, 숲속 요가, 아로마 테라피 프로그램" },
  { icon: HeartPulse, title: "수(水) 치유", desc: "족욕, 계곡 물소리 명상, 수변 공간 활용 이완 프로그램" },
]

export function EffectsSection() {
  return (
    <section id="effects" className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <ScrollAnimate variant="fade-up">
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              02. Program Effects
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              {"산림치유 프로그램 효과"}
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              {"산림치유 프로그램은 과학적 연구를 통해 신체적 \u00B7 정신적 \u00B7 사회적 측면에서 다양한 건강 증진 효과가 검증되었습니다."}
            </p>
          </div>
        </ScrollAnimate>

        {/* Stats */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, i) => (
            <ScrollAnimate key={i} variant="zoom-in" delay={i * 50}>
              <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center h-full">
                <span className="font-serif text-4xl font-bold text-primary sm:text-5xl">
                  {item.stat}
                  {item.unit && <span className="text-lg font-medium">{item.unit}</span>}
                </span>
                <span className="mt-3 text-sm font-bold text-card-foreground">{item.label}</span>
                <span className="mt-1 text-xs text-muted-foreground">{item.desc}</span>
              </div>
            </ScrollAnimate>
          ))}
        </div>

        {/* Research-backed charts */}
        <ScrollAnimate variant="fade-up">
          <div className="mb-20">
            <h3 className="mb-8 text-center font-serif text-2xl font-bold text-foreground sm:text-3xl text-balance">
              {"과학적 연구로 검증된 산림치유 효과"}
            </h3>
            <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
              {"산림청 연구 자료를 기반으로 한 산림치유 프로그램의 체험 전후 비교 데이터입니다."}
            </p>
            <EffectsCharts />
          </div>
        </ScrollAnimate>

        {/* 3-column effect categories */}
        <div className="mb-20 grid gap-8 lg:grid-cols-3">
          {effectCategories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <ScrollAnimate key={i} variant="fade-up" delay={i * 60}>
                <div className="flex flex-col rounded-2xl border border-border bg-card p-8 h-full">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-card-foreground">{cat.title}</h3>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimate>
            )
          })}
        </div>

        {/* Program types + image */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollAnimate variant="fade-right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/forest-walking.jpg"
                alt="숲속 치유 프로그램 모습"
                fill
                className="object-cover"
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate variant="fade-left">
            <div className="flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-bold text-foreground sm:text-3xl text-balance">
                {"다양한 치유 프로그램으로"}
                <br />
                {"맞춤형 건강 관리"}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {"큐어포레스트는 숲의 다양한 자원을 활용한 체계적인 치유 프로그램을 운영합니다. 대상과 목적에 따라 최적의 프로그램을 구성하여 제공합니다."}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {programTypes.map((prog, i) => {
                  const Icon = prog.icon
                  return (
                    <div key={i} className="flex gap-4 rounded-xl border border-border bg-background p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{prog.title}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{prog.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  )
}
