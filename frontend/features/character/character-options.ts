import type { CharacterJob, FacePreset, HairColor, HairStyle, SkinTone } from "@/types/api";

export const skinToneOptions: Array<{ value: SkinTone; label: string }> = [
  { value: "FAIR", label: "Fair" },
  { value: "LIGHT", label: "Light" },
  { value: "TAN", label: "Tan" },
  { value: "DEEP", label: "Deep" },
];

export const hairStyleOptions: Array<{ value: HairStyle; label: string }> = [
  { value: "BOB", label: "Bob" },
  { value: "LONG", label: "Long" },
  { value: "SHORT", label: "Short" },
  { value: "WAVY", label: "Wavy" },
];

export const hairColorOptions: Array<{ value: HairColor; label: string }> = [
  { value: "BLACK", label: "Black" },
  { value: "BROWN", label: "Brown" },
  { value: "BLONDE", label: "Blonde" },
  { value: "PINK", label: "Pink" },
];

export const facePresetOptions: Array<{ value: FacePreset; label: string }> = [
  { value: "SOFT", label: "Soft" },
  { value: "CHIC", label: "Chic" },
  { value: "BRIGHT", label: "Bright" },
];

export const jobOptions: Array<{
  value: CharacterJob;
  label: string;
  description: string;
  stats: string;
}> = [
  {
    value: "DESIGNER",
    label: "Designer",
    description: "패션 디자인과 스타일 창작 중심 직업입니다.",
    stats: "Creativity / Pattern Sense / Color Sense",
  },
  {
    value: "MD",
    label: "MD",
    description: "상품 기획과 판매 흐름을 읽는 직업입니다.",
    stats: "Merchandising / Analysis / Communication",
  },
  {
    value: "MODEL",
    label: "Model",
    description: "포즈, 워킹, 표현력으로 무대를 만드는 직업입니다.",
    stats: "Pose / Walking / Expression",
  },
];
