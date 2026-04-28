import type { CharacterJob, FacePreset, HairColor, HairStyle, SkinTone, StatType } from "@/types/api";

export const skinToneOptions: Array<{ value: SkinTone; label: string }> = [
  { value: "FAIR", label: "밝은 톤" },
  { value: "LIGHT", label: "라이트 톤" },
  { value: "TAN", label: "탄 톤" },
  { value: "DEEP", label: "딥 톤" },
];

export const hairStyleOptions: Array<{ value: HairStyle; label: string }> = [
  { value: "BOB", label: "보브" },
  { value: "LONG", label: "롱" },
  { value: "SHORT", label: "숏" },
  { value: "WAVY", label: "웨이브" },
];

export const hairColorOptions: Array<{ value: HairColor; label: string }> = [
  { value: "BLACK", label: "블랙" },
  { value: "BROWN", label: "브라운" },
  { value: "BLONDE", label: "블론드" },
  { value: "PINK", label: "핑크" },
];

export const facePresetOptions: Array<{ value: FacePreset; label: string }> = [
  { value: "SOFT", label: "소프트" },
  { value: "CHIC", label: "시크" },
  { value: "BRIGHT", label: "브라이트" },
];

export const jobLabelMap: Record<CharacterJob, string> = {
  DESIGNER: "디자이너",
  MD: "MD",
  MODEL: "모델",
};

export const statLabelMap: Record<StatType, string> = {
  CREATIVITY: "창의력",
  PATTERN_SENSE: "패턴 감각",
  COLOR_SENSE: "컬러 감각",
  MERCHANDISING: "머천다이징",
  ANALYSIS: "분석력",
  COMMUNICATION: "소통력",
  POSE: "포즈",
  WALKING: "워킹",
  EXPRESSION: "표현력",
};

export const jobOptions: Array<{
  value: CharacterJob;
  label: string;
  description: string;
  stats: string;
}> = [
  {
    value: "DESIGNER",
    label: "디자이너",
    description: "스케치와 스타일링 감각으로 패션을 설계하는 직업입니다.",
    stats: "창의력 / 패턴 감각 / 컬러 감각",
  },
  {
    value: "MD",
    label: "MD",
    description: "상품 기획과 판매 흐름을 설계하는 머천다이저 직군입니다.",
    stats: "머천다이징 / 분석력 / 소통력",
  },
  {
    value: "MODEL",
    label: "모델",
    description: "포즈와 워킹, 표현력으로 무대를 완성하는 직업입니다.",
    stats: "포즈 / 워킹 / 표현력",
  },
];
