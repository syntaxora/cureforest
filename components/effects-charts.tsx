"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

/* ─── color constants (not CSS vars – Recharts needs real values) ─── */
const GOLD = "#e4b44c"
const INDIGO = "#5b6aae"
const TEAL = "#5d8a6b"

/* ─── 01 우울증상 완화 ─── */
const hrsdData = [
  { name: "체험전", value: 12.7, fill: GOLD },
  { name: "체험후", value: 4.8, fill: INDIGO },
]
const bdiData = [
  { name: "체험전", value: 36.1, fill: GOLD },
  { name: "체험후", value: 28.5, fill: INDIGO },
]

/* ─── 02 혈압 저하 ─── */
const systolicData = [
  { name: "도심길", value: 125, fill: GOLD },
  { name: "숲길", value: 115.4, fill: INDIGO },
]
const diastolicData = [
  { name: "도심길", value: 74.1, fill: GOLD },
  { name: "숲길", value: 69.6, fill: INDIGO },
]

/* ─── 03 암 수술 후 회복 ─── */
const nkData = [
  { name: "체험전", value: 16.2, fill: GOLD },
  { name: "체험후", value: 22.8, fill: INDIGO },
]
const tCellData = [
  { name: "체험전", value: 38, fill: GOLD },
  { name: "체험후", value: 39.3, fill: INDIGO },
]

/* ─── 04 아토피/천식 완화 ─── */
const noData = [
  { name: "체험전", value: 21.5, fill: GOLD },
  { name: "체험후", value: 19.4, fill: INDIGO },
]
const scoradData = [
  { name: "체험전", value: 16.7, fill: GOLD },
  { name: "체험후", value: 10.2, fill: INDIGO },
]

/* ─── 05 스트레스 완화 ─── */
const cortisolData = [
  { name: "체험전", value: 0.11, fill: GOLD },
  { name: "체험후", value: 0.08, fill: INDIGO },
]
const alphaData = [
  { name: "도시경관", value: 22.4, fill: GOLD },
  { name: "산림경관", value: 23.7, fill: INDIGO },
  { name: "산림&물", value: 24.4, fill: TEAL },
]

/* ─── Reusable mini bar chart ─── */
function MiniBarChart({
  data,
  unit,
  domainMax,
}: {
  data: { name: string; value: number; fill: string }[]
  unit?: string
  domainMax?: number
}) {
  return (
    <ChartContainer
      config={Object.fromEntries(
        data.map((d) => [d.name, { label: d.name, color: d.fill }])
      )}
      className="h-[220px] w-full"
    >
      <BarChart
        data={data}
        margin={{ top: 24, right: 12, bottom: 4, left: 12 }}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          domain={[0, domainMax ?? "auto"]}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) =>
                `${name}: ${value}${unit ? ` ${unit}` : ""}`
              }
            />
          }
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            style={{ fontSize: 12, fontWeight: 600, fill: "var(--foreground)" }}
            formatter={(v: number) => `${v}${unit ? unit : ""}`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/* ─── Chart card wrapper ─── */
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <p className="mt-1 text-center text-xs font-bold text-card-foreground">
        {title}
      </p>
      {subtitle && (
        <p className="text-center text-[11px] leading-snug text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ─── Legend ─── */
function ChartLegendCustom({
  items,
}: {
  items: { label: string; color: string }[]
}) {
  return (
    <div className="flex items-center justify-center gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Each effect section ─── */
const effects = [
  {
    number: "01",
    title: "우울증상 완화 효과",
    legend: [
      { label: "체험전", color: GOLD },
      { label: "체험후", color: INDIGO },
    ],
    charts: [
      {
        title: "HRSD : 임상가 평가 우울증상",
        data: hrsdData,
        domainMax: 15,
      },
      {
        title: "BDI : 자기평가 우울증상",
        data: bdiData,
        domainMax: 40,
      },
    ],
  },
  {
    number: "02",
    title: "숲길 걷기를 통한 혈압 저하 효과",
    legend: [
      { label: "도심길", color: GOLD },
      { label: "숲길", color: INDIGO },
    ],
    charts: [
      {
        title: "수축기",
        subtitle: "수축기 혈압 (mmHg)",
        data: systolicData,
        domainMax: 150,
        unit: "",
      },
      {
        title: "확장기",
        subtitle: "확장기 혈압 (mmHg)",
        data: diastolicData,
        domainMax: 80,
        unit: "",
      },
    ],
  },
  {
    number: "03",
    title: "암 수술 후 빠른 회복 효과",
    legend: [
      { label: "체험전", color: GOLD },
      { label: "체험후", color: INDIGO },
    ],
    charts: [
      {
        title: "NK세포",
        subtitle: "암세포를 직접 파괴하는 면역 세포",
        data: nkData,
        domainMax: 30,
      },
      {
        title: "T세포",
        subtitle: "항체를 만드는 면역 관련 림프구",
        data: tCellData,
        domainMax: 45,
      },
    ],
  },
  {
    number: "04",
    title: "아토피 피부염 및 천식 완화 효과",
    legend: [
      { label: "체험전", color: GOLD },
      { label: "체험후", color: INDIGO },
    ],
    charts: [
      {
        title: "호기산화질소",
        subtitle: "기관지 염증정도",
        data: noData,
        domainMax: 30,
      },
      {
        title: "SCORAD지수",
        subtitle: "아토피 피부염 임상적 증상",
        data: scoradData,
        domainMax: 20,
      },
    ],
  },
  {
    number: "05",
    title: "현대사회 생활 속 스트레스 완화",
    legend: [
      { label: "체험전", color: GOLD },
      { label: "체험후", color: INDIGO },
    ],
    charts: [
      {
        title: "코티솔",
        subtitle: "스트레스 호르몬",
        data: cortisolData,
        domainMax: 0.15,
      },
    ],
    extraChart: {
      title: "알파파",
      subtitle: "안정된 상태에서 발생하는 뇌파",
      legend: [
        { label: "도시경관", color: GOLD },
        { label: "산림경관", color: INDIGO },
        { label: "산림&물 경관", color: TEAL },
      ],
      data: alphaData,
      domainMax: 28,
    },
  },
]

export function EffectsCharts() {
  return (
    <div className="flex flex-col gap-16">
      {effects.map((effect) => (
        <div
          key={effect.number}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10"
        >
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
              {"산림치유 효과 "}
              {effect.number}.
            </span>
            <h3 className="mt-1 font-serif text-xl font-bold text-card-foreground sm:text-2xl text-balance">
              {effect.title}
            </h3>
          </div>

          {/* Charts row */}
          <div className="grid gap-10 sm:grid-cols-2">
            {/* Standard charts with shared legend */}
            {effect.charts.map((chart, i) => (
              <div key={i} className="flex flex-col gap-3">
                <ChartLegendCustom items={effect.legend} />
                <ChartCard title={chart.title} subtitle={chart.subtitle}>
                  <MiniBarChart
                    data={chart.data}
                    unit={chart.unit}
                    domainMax={chart.domainMax}
                  />
                </ChartCard>
              </div>
            ))}

            {/* Extra chart (alpha waves with 3 bars) */}
            {effect.extraChart && (
              <div className="flex flex-col gap-3">
                <ChartLegendCustom items={effect.extraChart.legend} />
                <ChartCard
                  title={effect.extraChart.title}
                  subtitle={effect.extraChart.subtitle}
                >
                  <MiniBarChart
                    data={effect.extraChart.data}
                    domainMax={effect.extraChart.domainMax}
                  />
                </ChartCard>
              </div>
            )}
          </div>

          {/* Source */}
          <p className="mt-6 text-right text-[11px] text-muted-foreground">
            {"출처. 산림청"}
          </p>
        </div>
      ))}
    </div>
  )
}
