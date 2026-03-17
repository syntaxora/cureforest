import { MapPin, Trees, Flower2, Mountain, TreePine } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface LocationProgram {
  slug: string
  number: string
  title: string
  subtitle: string
  icon: LucideIcon
  image: string
  shortDescription: string
  fullDescription: string
  address: string
  duration: string
  target: string
  price: string
  capacity: string
  features: string[]
  notices: string[]
}

export const locationPrograms: LocationProgram[] = [
  {
    slug: "dongtan-healing",
    number: "01",
    title: "동탄호수공원 힐링프로그램",
    subtitle: "Dongtan Lake Park Healing",
    icon: MapPin,
    image: "/images/program-dongtan-healing.jpg",
    shortDescription: "동탄호수공원의 아름다운 호수와 숲에서 진행되는 힐링 프로그램입니다.",
    fullDescription: "동탄호수공원은 화성시의 대표적인 도심 속 자연공간입니다. 넓은 호수와 잘 조성된 산책로, 풍부한 수목이 어우러진 이곳에서 일상의 스트레스를 해소하고 심신의 안정을 찾는 다양한 힐링 프로그램을 운영합니다.",
    address: "경기도 화성시 동탄호수공원",
    duration: "프로그램별 60~120분",
    target: "스트레스 해소가 필요한 분, 가족 단위, 직장인 단체",
    price: "프로그램별 상이 (문의)",
    capacity: "최소 10명 ~ 최대 30명",
    features: [
      "도심 속 자연 힐링 공간",
      "아름다운 호수 전망",
      "잘 정비된 산책로",
      "사계절 다양한 풍경",
    ],
    notices: [
      "편안한 복장과 운동화를 착용해주세요",
      "개인 물과 간식을 지참해주세요",
      "우천 시 일정이 조정될 수 있습니다",
      "주차장 이용 가능 (유료)",
    ],
  },
  {
    slug: "dongtan-ecology",
    number: "02",
    title: "동탄호수공원 생태 프로그램",
    subtitle: "Dongtan Ecology Program",
    icon: Trees,
    image: "/images/program-dongtan-ecology.jpg",
    shortDescription: "동탄호수공원의 다양한 생태계를 관찰하고 배우는 자연 교육 프로그램입니다.",
    fullDescription: "동탄호수공원에 서식하는 다양한 동식물을 관찰하고 생태계의 원리를 배우는 교육 프로그램입니다. 조류 관찰, 곤충 탐사, 습지 생태 탐방 등 다양한 활동을 통해 자연과 더 가까워지는 시간을 제공합니다.",
    address: "경기도 화성시 동탄호수공원",
    duration: "프로그램별 60~90분",
    target: "어린이, 학생 단체, 생태에 관심 있는 분",
    price: "프로그램별 상이 (문의)",
    capacity: "최소 10명 ~ 최대 25명",
    features: [
      "전문 생태해설사 동행",
      "다양한 동식물 관찰",
      "체험 중심 교육",
      "환경 보전 의식 함양",
    ],
    notices: [
      "관찰 도구는 제공됩니다",
      "긴 바지와 긴 팔을 권장합니다",
      "생태계 보호를 위해 식물 채취는 금지됩니다",
      "모자와 선크림을 지참해주세요",
    ],
  },
  {
    slug: "daol-garden",
    number: "03",
    title: "다올공원 온뜰정원 힐링가드너",
    subtitle: "Daol Park Healing Gardener",
    icon: Flower2,
    image: "/images/program-daol-garden.jpg",
    shortDescription: "다올공원 온뜰정원에서 진행되는 원예치료와 정원 가꾸기 프로그램입니다.",
    fullDescription: "다올공원 내 온뜰정원은 시민들을 위한 치유 정원 공간입니다. 이곳에서 허브 가드닝, 꽃 심기, 정원 치유 등 다양한 원예치료 프로그램을 통해 흙을 만지며 마음의 안정을 찾고 자연의 생명력을 느낄 수 있습니다.",
    address: "경기도 화성시 다올공원 온뜰정원",
    duration: "프로그램별 60~90분",
    target: "원예에 관심 있는 분, 심리적 안정이 필요한 분, 가족",
    price: "프로그램별 상이 (재료비 포함)",
    capacity: "최소 8명 ~ 최대 20명",
    features: [
      "전문 원예치료사 진행",
      "다양한 식물 체험",
      "작품 가져가기 가능",
      "사계절 프로그램 운영",
    ],
    notices: [
      "흙이 묻어도 되는 편안한 복장을 착용해주세요",
      "장갑은 제공됩니다",
      "식물 알레르기가 있으시면 미리 알려주세요",
      "완성 작품은 가져가실 수 있습니다",
    ],
  },
  {
    slug: "mubongsan",
    number: "04",
    title: "무봉산 자연휴양림",
    subtitle: "Mubongsan Recreation Forest",
    icon: Mountain,
    image: "/images/program-mubongsan.jpg",
    shortDescription: "무봉산 자연휴양림에서 진행되는 본격적인 산림치유 프로그램입니다.",
    fullDescription: "무봉산 자연휴양림은 깊은 숲과 맑은 공기, 계곡이 어우러진 천혜의 산림치유 공간입니다. 피톤치드 가득한 숲길 트레킹, 계곡 명상, 산림욕 등 자연의 치유력을 온전히 느낄 수 있는 프로그램을 운영합니다.",
    address: "경기도 화성시 무봉산 자연휴양림",
    duration: "프로그램별 90~180분",
    target: "깊은 힐링이 필요한 분, 트레킹 애호가, 자연 속 휴식을 원하는 분",
    price: "프로그램별 상이 (휴양림 입장료 별도)",
    capacity: "최소 8명 ~ 최대 20명",
    features: [
      "깊은 산림 환경",
      "피톤치드 풍부",
      "맑은 계곡",
      "다양한 난이도 코스",
    ],
    notices: [
      "등산화 또는 트레킹화를 착용해주세요",
      "자연휴양림 입장료는 별도입니다",
      "물과 간식을 충분히 지참해주세요",
      "체력에 따른 코스 선택이 가능합니다",
    ],
  },
  {
    slug: "hwaseong-forest",
    number: "05",
    title: "화성시 숲해설",
    subtitle: "Hwaseong Forest Guide",
    icon: TreePine,
    image: "/images/program-hwaseong-forest.jpg",
    shortDescription: "화성시 일대의 숲에서 진행되는 전문 숲해설 프로그램입니다.",
    fullDescription: "화성시 곳곳에 있는 아름다운 숲에서 전문 숲해설가와 함께하는 프로그램입니다. 숲의 역사와 문화, 나무와 식물 이야기, 계절별 숲의 변화 등 다양한 주제로 숲을 더 깊이 이해하고 즐길 수 있습니다.",
    address: "화성시 관내 숲 (장소는 프로그램별 상이)",
    duration: "프로그램별 60~120분",
    target: "숲에 대해 배우고 싶은 분, 가족, 단체",
    price: "프로그램별 상이 (문의)",
    capacity: "최소 10명 ~ 최대 25명",
    features: [
      "전문 숲해설가 동행",
      "다양한 장소 선택 가능",
      "맞춤형 프로그램 가능",
      "계절별 특화 프로그램",
    ],
    notices: [
      "편안한 복장과 운동화를 착용해주세요",
      "프로그램 장소는 사전에 안내드립니다",
      "단체의 경우 맞춤 프로그램 설계가 가능합니다",
      "우천 시 일정이 조정될 수 있습니다",
    ],
  },
]
