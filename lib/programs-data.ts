import {
  Music,
  Palette,
  Heart,
  Dumbbell,
  Sparkles,
  Coffee,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function getProgramBySlug(slug: string): Program | null {
  return programs.find((p) => p.slug === slug) || null;
}

export interface SubProgram {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  duration: string;
  target: string;
  image: string;
  highlights: string[];
  activities: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Program {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  duration: string;
  target: string;
  price: string;
  capacity: string;
  details: string[];
  effects: string[];
  features: string[];
  notices: string[];
  steps: { title: string; description: string }[];
  subPrograms: SubProgram[];
  faqs: FAQ[];
}

export const programs: Program[] = [
  {
    slug: "singing-bowl",
    number: "06",
    title: "싱잉볼 테라피",
    subtitle: "Singing Bowl Therapy",
    icon: Music,
    image: "/images/singing-bowl.jpg",
    shortDescription:
      "싱잉볼의 진동과 소리를 통해 깊은 이완과 치유를 경험하는 소리 명상 프로그램입니다.",
    fullDescription:
      "싱잉볼 테라피는 티벳 전통의 싱잉볼(명상 종)을 사용하여 진행하는 소리 치유 프로그램입니다. 싱잉볼의 깊고 풍부한 진동이 몸과 마음에 전달되어 긴장을 풀어주고 깊은 이완 상태를 유도합니다. 스트레스 해소, 숙면 유도, 명상 집중력 향상에 효과적입니다.",
    location: "실내 명상실 또는 야외 숲속",
    duration: "약 60분",
    target: "스트레스 해소가 필요한 분, 명상에 관심 있는 분, 불면증이 있는 분",
    price: "프로그램별 상이 (문의)",
    capacity: "최소 5명 ~ 최대 15명",
    details: [
      "싱잉볼 소리 명상",
      "진동 체험",
      "차크라 밸런싱",
      "그라운딩 명상",
      "소리 목욕",
    ],
    effects: ["깊은 이완", "스트레스 해소", "숙면 유도", "에너지 정화"],
    features: [
      "전문 싱잉볼 테라피스트 진행",
      "다양한 크기의 싱잉볼 사용",
      "개인 맞춤 세션 가능",
      "자연 속 야외 세션 진행",
    ],
    notices: [
      "편안한 복장을 착용해주세요",
      "요가매트나 담요를 지참하시면 좋습니다",
      "세션 중에는 휴대폰을 무음으로 해주세요",
      "식사 직후 참여는 피해주세요",
    ],
    steps: [
      { title: "준비", description: "편안한 자세로 눕기, 호흡 안정" },
      {
        title: "소리 명상 시작",
        description: "싱잉볼 소리에 집중, 몸의 긴장 풀기",
      },
      {
        title: "진동 체험",
        description: "싱잉볼을 몸 가까이 대어 진동 느끼기",
      },
      { title: "마무리", description: "천천히 일어나기, 소감 나누기" },
    ],
    subPrograms: [
      {
        id: "sound-bath",
        title: "사운드 배스",
        description: "싱잉볼 소리로 온몸을 감싸는 소리 목욕 체험",
        fullDescription:
          "여러 개의 싱잉볼이 만들어내는 풍부한 소리의 물결 속에 온몸을 적시는 듯한 체험입니다. 누워서 눈을 감고 소리에 온전히 맡기면, 마치 소리의 바다에서 떠다니는 것 같은 깊은 이완을 경험합니다. 뇌파가 알파파 상태로 전환되어 깊은 휴식과 명상 효과를 얻을 수 있습니다.",
        duration: "60분",
        target: "깊은 이완이 필요한 분, 명상 초보자",
        image: "/images/sub-sound-bath.jpg",
        highlights: [
          "다중 싱잉볼 연주",
          "깊은 이완 체험",
          "뇌파 안정",
          "에너지 충전",
        ],
        activities: [
          "자리 잡기",
          "호흡 안정",
          "소리 목욕",
          "자유 명상",
          "깨어나기",
        ],
      },
      {
        id: "chakra-healing",
        title: "차크라 힐링",
        description: "7개 차크라에 맞춘 싱잉볼 치유 세션",
        fullDescription:
          "인체의 7개 에너지 센터인 차크라에 맞춰 싱잉볼을 사용하는 치유 세션입니다. 각 차크라에 해당하는 주파수의 싱잉볼을 사용하여 막힌 에너지를 풀어주고 균형을 맞춥니다.",
        duration: "90분",
        target: "에너지 밸런스가 필요한 분",
        image: "/images/sub-chakra-healing.jpg",
        highlights: [
          "7차크라 이해",
          "차크라별 싱잉볼",
          "에너지 밸런싱",
          "깊은 치유",
        ],
        activities: [
          "차크라 설명",
          "루트 차크라부터 시작",
          "순차적 힐링",
          "통합",
          "마무리",
        ],
      },
      {
        id: "forest-singing-bowl",
        title: "숲속 싱잉볼",
        description: "자연 속에서 진행하는 싱잉볼 명상",
        fullDescription:
          "숲속에서 진행하는 특별한 싱잉볼 세션입니다. 새소리, 바람소리, 나뭇잎 소리와 싱잉볼의 진동이 어우러져 자연과 하나 되는 깊은 명상을 경험합니다.",
        duration: "90분",
        target: "자연 속 명상을 원하는 분",
        image: "/images/sub-forest-singing-bowl.jpg",
        highlights: [
          "자연 속 명상",
          "자연음과 싱잉볼 조화",
          "그라운딩",
          "깊은 치유",
        ],
        activities: [
          "숲으로 이동",
          "자리 잡기",
          "자연음 청취",
          "싱잉볼 세션",
          "자연 연결 명상",
        ],
      },
      {
        id: "personal-session",
        title: "1:1 개인 세션",
        description: "개인 맞춤형 싱잉볼 테라피",
        fullDescription:
          "개인의 상태와 필요에 맞춤화된 1:1 싱잉볼 세션입니다. 사전 상담을 통해 현재 몸과 마음의 상태를 파악하고, 이에 맞는 싱잉볼과 기법을 적용합니다.",
        duration: "60분",
        target: "깊은 치유가 필요한 분",
        image: "/images/sub-personal-session.jpg",
        highlights: ["맞춤형 세션", "심층 상담", "개인 케어", "집중 치유"],
        activities: [
          "상담",
          "맞춤 세션 설계",
          "싱잉볼 테라피",
          "피드백",
          "홈케어 안내",
        ],
      },
    ],
    faqs: [
      {
        question: "싱잉볼 테라피는 어떤 효과가 있나요?",
        answer:
          "스트레스 해소, 깊은 이완, 숙면 유도, 집중력 향상 등의 효과가 있습니다.",
      },
      {
        question: "임산부도 참여 가능한가요?",
        answer:
          "임신 초기에는 참여를 권장하지 않습니다. 임신 중기 이후 의사와 상담 후 참여해주세요.",
      },
      {
        question: "세션 중 잠이 들어도 되나요?",
        answer: "네, 깊은 이완 상태에서 잠이 드는 것은 자연스러운 현상입니다.",
      },
    ],
  },
  {
    slug: "color-therapy",
    number: "07",
    title: "컬러 테라피",
    subtitle: "Color Therapy",
    icon: Palette,
    image: "/images/color-therapy.jpg",
    shortDescription:
      "색채의 에너지를 활용하여 심리적 안정과 감정 치유를 돕는 색채 치료 프로그램입니다.",
    fullDescription:
      "컬러 테라피는 색채가 가진 고유한 에너지와 심리적 효과를 활용하는 치유 프로그램입니다. 각 색깔은 특정한 파장과 에너지를 가지고 있어 우리의 감정과 몸에 영향을 미칩니다. 색채 명상, 컬러 호흡, 색채 미술 활동 등을 통해 감정을 표현하고 치유합니다.",
    location: "실내 치유실 또는 야외 자연",
    duration: "약 90분",
    target:
      "감정 표현이 어려운 분, 심리적 안정이 필요한 분, 창의력 향상을 원하는 분",
    price: "프로그램별 상이 (재료비 포함)",
    capacity: "최소 5명 ~ 최대 12명",
    details: [
      "컬러 심리 진단",
      "색채 명상",
      "컬러 호흡법",
      "색채 미술 활동",
      "자연 속 색깔 찾기",
    ],
    effects: ["감정 정화", "심리적 안정", "창의력 향상", "자기 이해 증진"],
    features: [
      "전문 컬러 테라피스트 진행",
      "다양한 색채 도구 활용",
      "개인 맞춤 색채 처방",
      "자연 색채와의 연계",
    ],
    notices: [
      "흰색 또는 밝은 색상의 편한 복장을 권장합니다",
      "미술 재료는 모두 제공됩니다",
      "작품은 가져가실 수 있습니다",
      "색맹이나 색약이 있으신 분은 미리 알려주세요",
    ],
    steps: [
      {
        title: "컬러 진단",
        description: "현재 끌리는 색깔 선택, 심리 상태 파악",
      },
      { title: "색채 명상", description: "선택한 색깔로 명상, 에너지 느끼기" },
      {
        title: "색채 활동",
        description: "그림 그리기, 만들기 등 색채 미술 활동",
      },
      { title: "마무리", description: "작품 감상, 의미 나누기, 색채 처방" },
    ],
    subPrograms: [],
    faqs: [
      {
        question: "미술을 못해도 참여할 수 있나요?",
        answer:
          "물론입니다! 컬러 테라피는 미술 실력과 관계없이 누구나 참여할 수 있습니다.",
      },
      {
        question: "어떤 색깔이 저에게 맞나요?",
        answer:
          "프로그램 시작 시 컬러 진단을 통해 현재 필요한 색깔을 찾아드립니다.",
      },
      {
        question: "작품을 가져갈 수 있나요?",
        answer: "네, 세션에서 만든 모든 작품은 가져가실 수 있습니다.",
      },
    ],
  },
  {
    slug: "props-therapy",
    number: "08",
    title: "소도구 테라피",
    subtitle: "Props Therapy",
    icon: Heart,
    image: "/images/props-therapy.jpg",
    shortDescription:
      "다양한 치유 소도구를 활용하여 몸과 마음의 긴장을 풀어주는 테라피 프로그램입니다.",
    fullDescription:
      "소도구 테라피는 마사지볼, 폼롤러, 테라밴드, 명상 도구 등 다양한 치유 소도구를 활용하여 몸의 긴장을 풀고 마음을 이완시키는 프로그램입니다. 전문 지도사의 안내에 따라 안전하고 효과적으로 소도구를 사용하는 방법을 배웁니다.",
    location: "실내 또는 야외",
    duration: "약 60분",
    target: "근육 긴장이 있는 분, 사무직 종사자, 운동 전후 케어가 필요한 분",
    price: "프로그램별 상이 (문의)",
    capacity: "최소 8명 ~ 최대 20명",
    details: [
      "마사지볼 테라피",
      "폼롤러 스트레칭",
      "테라밴드 운동",
      "명상 소도구 활용",
      "셀프 케어 기법",
    ],
    effects: ["근육 이완", "혈액 순환 촉진", "유연성 향상", "스트레스 해소"],
    features: [
      "전문 지도사 진행",
      "다양한 소도구 제공",
      "개인별 맞춤 지도",
      "집에서 활용 가능한 기법 전수",
    ],
    notices: [
      "운동하기 편한 복장을 착용해주세요",
      "개인 요가매트가 있으면 지참해주세요",
      "부상이나 질환이 있으신 분은 미리 알려주세요",
      "물을 충분히 지참해주세요",
    ],
    steps: [
      { title: "준비운동", description: "가벼운 스트레칭으로 몸 풀기" },
      {
        title: "소도구 소개",
        description: "오늘 사용할 소도구 설명 및 사용법 안내",
      },
      { title: "소도구 테라피", description: "다양한 소도구로 몸 전체 케어" },
      { title: "마무리", description: "이완 스트레칭, 효과적인 사용 팁 안내" },
    ],
    subPrograms: [],
    faqs: [
      {
        question: "소도구를 구매할 수 있나요?",
        answer: "프로그램에서 사용하는 소도구 구매를 원하시면 안내해드립니다.",
      },
      {
        question: "허리 디스크가 있는데 참여 가능한가요?",
        answer: "사전에 알려주시면 허리에 부담이 없는 동작으로 진행해드립니다.",
      },
      {
        question: "집에서도 할 수 있나요?",
        answer: "네, 프로그램에서 배운 기법은 집에서도 혼자 할 수 있습니다.",
      },
    ],
  },
  {
    slug: "body-activity",
    number: "09",
    title: "신체활동",
    subtitle: "Body Activity",
    icon: Dumbbell,
    image: "/images/body-activity.jpg",
    shortDescription:
      "자연 속에서 진행하는 건강한 신체활동 프로그램입니다. 몸을 움직여 활력을 되찾으세요.",
    fullDescription:
      "신체활동 프로그램은 자연 환경에서 진행되는 다양한 신체 활동을 통해 체력을 키우고 활력을 되찾는 프로그램입니다. 스트레칭, 요가, 가벼운 유산소 운동, 자연 피트니스 등 누구나 쉽게 참여할 수 있는 활동으로 구성됩니다.",
    location: "야외 공원 또는 숲",
    duration: "약 60분",
    target:
      "체력 향상이 필요한 분, 운동 습관을 기르고 싶은 분, 활력이 필요한 분",
    price: "프로그램별 상이 (문의)",
    capacity: "최소 10명 ~ 최대 25명",
    details: [
      "아침 스트레칭",
      "자연 속 요가",
      "노르딕 워킹",
      "자연 피트니스",
      "그라운딩 운동",
    ],
    effects: ["체력 향상", "활력 증진", "스트레스 해소", "건강한 습관 형성"],
    features: [
      "전문 운동 지도사 진행",
      "체력 수준별 맞춤 지도",
      "자연 환경 활용",
      "즐거운 그룹 활동",
    ],
    notices: [
      "운동하기 편한 복장과 운동화를 착용해주세요",
      "물을 충분히 지참해주세요",
      "부상이나 질환이 있으신 분은 미리 알려주세요",
      "프로그램 시작 10분 전까지 집합해주세요",
    ],
    steps: [
      { title: "워밍업", description: "가벼운 스트레칭과 준비 운동" },
      { title: "메인 활동", description: "오늘의 신체활동 프로그램 진행" },
      { title: "쿨다운", description: "이완 스트레칭과 호흡 정리" },
      { title: "마무리", description: "수분 보충, 소감 나누기" },
    ],
    subPrograms: [],
    faqs: [
      {
        question: "운동을 안 해본 사람도 참여할 수 있나요?",
        answer:
          "네, 체력 수준에 맞게 조절하여 진행하므로 누구나 참여 가능합니다.",
      },
      {
        question: "비가 오면 어떻게 되나요?",
        answer:
          "우천 시에는 실내 공간에서 대체 프로그램을 진행하거나 일정을 조정합니다.",
      },
      {
        question: "노르딕 워킹 폴은 어디서 구하나요?",
        answer:
          "프로그램에서 폴을 대여해드립니다. 구매를 원하시면 안내해드립니다.",
      },
    ],
  },
  {
    slug: "aroma-therapy",
    number: "10",
    title: "아로마 테라피",
    subtitle: "Aroma Therapy",
    icon: Sparkles,
    image: "/images/aroma-therapy.jpg",
    shortDescription:
      "식물에서 추출한 천연 에센셜 오일의 향기로 심신의 균형을 되찾는 향기 치유 프로그램입니다.",
    fullDescription:
      "아로마 테라피는 라벤더, 로즈마리, 페퍼민트 등 식물에서 추출한 천연 에센셜 오일의 향기를 활용하는 치유 프로그램입니다. 후각은 뇌의 감정 중추와 직접 연결되어 있어 향기만으로도 기분 전환과 심리적 안정 효과를 얻을 수 있습니다.",
    location: "실내 치유실 또는 야외",
    duration: "약 90분",
    target: "스트레스 해소가 필요한 분, 향기를 좋아하는 분, 숙면이 어려운 분",
    price: "프로그램별 상이 (재료비 포함)",
    capacity: "최소 5명 ~ 최대 15명",
    details: [
      "아로마 심리 진단",
      "향기 명상",
      "아로마 블렌딩",
      "아로마 마사지",
      "숲 속 아로마 체험",
    ],
    effects: ["심리 안정", "숙면 유도", "두통 완화", "기분 전환"],
    features: [
      "전문 아로마테라피스트 진행",
      "100% 천연 에센셜 오일 사용",
      "나만의 블렌드 제작",
      "숲 속 자연 향기와 연계",
    ],
    notices: [
      "향에 민감하신 분은 미리 알려주세요",
      "임산부는 사용 가능한 오일이 제한됩니다",
      "피부 알레르기가 있으신 분은 사전에 말씀해주세요",
      "만든 제품은 가져가실 수 있습니다",
    ],
    steps: [
      { title: "아로마 소개", description: "에센셜 오일 종류와 효능 설명" },
      {
        title: "향기 체험",
        description: "다양한 향기 맡아보고 선호하는 향 찾기",
      },
      { title: "블렌딩 체험", description: "나만의 아로마 블렌드 만들기" },
      { title: "마무리", description: "향기 명상, 일상 활용법 안내" },
    ],
    subPrograms: [],
    faqs: [
      {
        question: "에센셜 오일과 일반 향수의 차이가 무엇인가요?",
        answer:
          "에센셜 오일은 식물에서 100% 추출한 천연 성분이고, 향수는 합성 향료가 포함됩니다.",
      },
      {
        question: "임산부도 참여 가능한가요?",
        answer:
          "일부 오일은 임산부에게 사용이 제한됩니다. 사전에 알려주시면 안전한 오일만 사용합니다.",
      },
      {
        question: "만든 제품을 가져갈 수 있나요?",
        answer: "네, 직접 만든 아로마 제품은 모두 가져가실 수 있습니다.",
      },
    ],
  },
  {
    slug: "tea-therapy",
    number: "11",
    title: "차 테라피",
    subtitle: "Tea Therapy",
    icon: Coffee,
    image: "/images/tea-therapy.jpg",
    shortDescription:
      "자연 속에서 다양한 차를 천천히 우리고 마시며 마음을 고요하게 다스리는 차 명상 프로그램입니다.",
    fullDescription:
      "차 테라피는 한국의 전통 다도(茶道) 정신에 자연 치유를 결합한 프로그램입니다. 바쁜 일상에서 벗어나 차를 우리는 과정 하나하나에 집중하며 마음챙김(Mindfulness)을 실천합니다. 녹차, 허브차, 야생화차 등 다양한 종류의 차를 체험하고, 차의 색과 향과 맛을 온전히 느끼며 오감을 깨웁니다. 숲 속이나 정원에서 진행하는 야외 차 명상은 자연의 소리와 함께 더욱 깊은 이완을 선사합니다.",
    location: "실내 다실 또는 야외 숲 · 정원",
    duration: "약 90분",
    target: "마음의 여유가 필요한 분, 전통 문화에 관심 있는 분, 명상 초보자",
    price: "프로그램별 상이 (다구 및 차 재료 포함)",
    capacity: "최소 4명 ~ 최대 12명",
    details: [
      "차 명상",
      "다도 체험",
      "야생화차 · 허브차 블렌딩",
      "숲 속 야외 다례",
      "마음챙김 차 마시기",
    ],
    effects: ["마음 고요함", "집중력 향상", "소화 촉진", "자연 치유력 회복"],
    features: [
      "전통 다도와 현대 명상의 융합",
      "국내산 자연 재료 사용",
      "소규모 소그룹 운영",
      "야외 자연 환경에서 진행",
    ],
    notices: [
      "편안한 복장을 착용해주세요",
      "다구는 모두 제공됩니다",
      "카페인에 민감하신 분은 미리 알려주세요",
      "세션 시작 30분 전 과도한 음식 섭취는 피해주세요",
    ],
    steps: [
      { title: "차 소개", description: "오늘 사용할 차의 종류와 효능 설명" },
      { title: "다구 준비", description: "찻잔과 다구를 정성껏 준비하기" },
      {
        title: "차 우리기",
        description: "물 온도와 우리는 시간에 집중하며 천천히 차 우리기",
      },
      {
        title: "차 명상",
        description: "차의 색·향·맛을 온전히 느끼며 마음챙김 실천",
      },
    ],
    subPrograms: [],
    faqs: [
      {
        question: "차를 잘 못 마셔도 괜찮나요?",
        answer:
          "물론입니다. 카페인이 없는 허브차나 야생화차도 준비되어 있어 누구나 참여할 수 있습니다.",
      },
      {
        question: "다도 경험이 없어도 참여할 수 있나요?",
        answer:
          "네, 전문 지도사가 처음부터 차근차근 안내해드리므로 전혀 경험이 없어도 괜찮습니다.",
      },
      {
        question: "야외 진행 시 날씨가 좋지 않으면 어떻게 되나요?",
        answer: "우천 시에는 실내 다실에서 동일하게 진행됩니다.",
      },
    ],
  },
];
