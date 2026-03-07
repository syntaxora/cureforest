import Image from "next/image"
import { Mountain, Droplets, Wind, Sun } from "lucide-react"

const features = [
  {
    icon: Mountain,
    title: "숲길 산책",
    description: "자연 그대로의 숲길을 걸으며 오감을 깨우는 치유 활동",
  },
  {
    icon: Droplets,
    title: "물 치유",
    description: "계곡과 수변공간에서 물소리와 함께하는 명상 치유",
  },
  {
    icon: Wind,
    title: "피톤치드 테라피",
    description: "침엽수림에서 발산되는 피톤치드를 통한 면역력 강화",
  },
  {
    icon: Sun,
    title: "햇빛 치유",
    description: "자연 채광을 활용한 비타민 D 합성과 기분 향상",
  },
]

export function HealingForestSection() {
  return (
    <section id="healing-forest" className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div>
              <span className="mb-4 block text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Healing Forest
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                {'치유의 숲에서'}
                <br />
                {'만나는 자연의 힘'}
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
            </div>
            <p className="leading-relaxed text-muted-foreground">
              {'치유의 숲은 단순한 산책로가 아닙니다. 과학적으로 설계된 치유 공간에서 전문가의 안내와 함께 숲의 모든 요소를 활용한 치유 프로그램을 경험할 수 있습니다.'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl bg-card p-4 border border-border"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-card-foreground">{feature.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl lg:aspect-[4/5]">
            <Image
              src="/images/healing-forest.jpg"
              alt="치유의 숲 풍경"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
