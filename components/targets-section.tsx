import { Briefcase, GraduationCap, Baby, Users, Accessibility, HeartPulse } from "lucide-react"

const targets = [
  {
    icon: Briefcase,
    title: "직장인",
    description: "업무 스트레스 해소, 번아웃 예방, 업무 효율 향상을 위한 맞춤 프로그램",
  },
  {
    icon: GraduationCap,
    title: "학생/청소년",
    description: "학업 스트레스 완화, 집중력 향상, 정서 안정을 위한 체험 프로그램",
  },
  {
    icon: Baby,
    title: "임산부/영유아",
    description: "태교 숲 체험, 산후 회복, 영유아 자연 감각 발달 프로그램",
  },
  {
    icon: Users,
    title: "어르신",
    description: "치매 예방, 근력 강화, 사회적 교류를 위한 시니어 맞춤 프로그램",
  },
  {
    icon: Accessibility,
    title: "장애인",
    description: "무장애 숲길을 활용한 접근성 높은 산림치유 프로그램",
  },
  {
    icon: HeartPulse,
    title: "만성질환자",
    description: "고혈압, 당뇨, 아토피 등 만성질환 증상 완화 특화 프로그램",
  },
]

export function TargetsSection() {
  return (
    <section id="targets" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            For Everyone
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {'산림치유 대상'}
          </h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
            {'산림치유는 누구에게나 열려있습니다. 대상별 맞춤 프로그램으로 최적의 치유 효과를 경험하세요.'}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {targets.map((target, index) => {
            const Icon = target.icon
            return (
              <div
                key={index}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-card-foreground">{target.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {target.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
