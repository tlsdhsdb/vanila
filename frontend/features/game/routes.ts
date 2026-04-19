export interface RouteDefinition {
  href: string;
  label: string;
  description: string;
}

export const publicRoutes: RouteDefinition[] = [
  {
    href: "/login",
    label: "로그인",
    description: "회원 로그인 골격과 추후 인증 연결 지점",
  },
  {
    href: "/signup",
    label: "회원가입",
    description: "계정 생성 흐름이 연결될 공개 화면",
  },
];

export const gameRoutes: RouteDefinition[] = [
  {
    href: "/character/create",
    label: "캐릭터 생성",
    description: "아바타 초기 생성 화면",
  },
  {
    href: "/character/job",
    label: "직업 선택",
    description: "Designer / MD / Model 선택 화면",
  },
  {
    href: "/plaza",
    label: "메인 플라자",
    description: "도시 허브와 소셜 존재감 표시 영역",
  },
  {
    href: "/academy",
    label: "아카데미",
    description: "직업 수업과 스탯 성장 진입점",
  },
  {
    href: "/minigames",
    label: "미니게임",
    description: "Clothing Fold / Display Styling 연결 지점",
  },
  {
    href: "/shop",
    label: "상점",
    description: "의상 구매 화면 골격",
  },
  {
    href: "/inventory",
    label: "인벤토리",
    description: "보유 아이템과 코디 장착 화면 골격",
  },
  {
    href: "/profile",
    label: "내 방 / 프로필",
    description: "내 캐릭터 상태와 코디 확인 화면",
  },
  {
    href: "/quests",
    label: "퀘스트 저널",
    description: "튜토리얼과 성장 루프를 안내할 화면",
  },
  {
    href: "/promotion",
    label: "승급",
    description: "입문 → 수습 1단계 승급 화면 골격",
  },
];

