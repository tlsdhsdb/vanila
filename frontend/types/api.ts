export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface HealthCheckResponse {
  status: string;
  application: string;
  timestamp: string;
}

export type AccountRole = "USER";

export interface AccountResponse {
  id: number;
  email: string;
  username: string;
  role: AccountRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  tokenType: "Bearer";
  accessToken: string;
  account: AccountResponse;
}

export type SkinTone = "FAIR" | "LIGHT" | "TAN" | "DEEP";
export type HairStyle = "BOB" | "LONG" | "SHORT" | "WAVY";
export type HairColor = "BLACK" | "BROWN" | "BLONDE" | "PINK";
export type FacePreset = "SOFT" | "CHIC" | "BRIGHT";
export type CharacterJob = "DESIGNER" | "MD" | "MODEL";
export type PromotionTier = "BEGINNER";
export type CharacterLocation = "MAIN_PLAZA";
export type StatType =
  | "CREATIVITY"
  | "PATTERN_SENSE"
  | "COLOR_SENSE"
  | "MERCHANDISING"
  | "ANALYSIS"
  | "COMMUNICATION"
  | "POSE"
  | "WALKING"
  | "EXPRESSION";

export interface CharacterStatResponse {
  statType: StatType;
  value: number;
}

export interface CharacterResponse {
  id: number;
  accountId: number;
  name: string;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  facePreset: FacePreset;
  job: CharacterJob | null;
  level: number;
  exp: number;
  promotionTier: PromotionTier;
  beads: number;
  currentLocation: CharacterLocation;
  title: string;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
  stats: CharacterStatResponse[];
}
