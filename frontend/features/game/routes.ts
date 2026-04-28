export interface RouteDefinition {
  href: string;
  label: string;
  description: string;
}

export const publicRoutes: RouteDefinition[] = [
  {
    href: "/login",
    label: "로그인",
    description: "현재 게임 진행 상태로 다시 이어서 플레이합니다.",
  },
  {
    href: "/signup",
    label: "회원가입",
    description: "새 계정을 만들고 바닐라드림 온보딩을 시작합니다.",
  },
];

export const gameRoutes: RouteDefinition[] = [
  {
    href: "/character/create",
    label: "캐릭터 생성",
    description: "게임 진입 전에 기본 외형을 설정합니다.",
  },
  {
    href: "/job/select",
    label: "직업 선택",
    description: "디자이너, MD, 모델 중 첫 진로를 고릅니다.",
  },
  {
    href: "/plaza",
    label: "메인 플라자",
    description: "캐릭터 생성과 직업 선택 이후의 중심 허브입니다.",
  },
  {
    href: "/academy",
    label: "아카데미",
    description: "수업을 듣고 EXP와 직업 스탯을 올립니다.",
  },
  {
    href: "/quests",
    label: "퀘스트 저널",
    description: "활성 퀘스트와 완료 보상을 확인하고 수령합니다.",
  },
  {
    href: "/minigames",
    label: "미니게임",
    description: "다음 단계에서 연결될 아르바이트 미니게임 화면입니다.",
  },
  {
    href: "/shop",
    label: "상점",
    description: "다음 단계에서 연결될 쇼핑과 아이템 구매 화면입니다.",
  },
  {
    href: "/inventory",
    label: "인벤토리",
    description: "다음 단계에서 연결될 보유 아이템과 코디 화면입니다.",
  },
  {
    href: "/profile",
    label: "프로필",
    description: "현재 캐릭터 요약과 칭호를 확인합니다.",
  },
  {
    href: "/promotion",
    label: "승급",
    description: "다음 단계에서 연결될 승급 목표 화면입니다.",
  },
];
