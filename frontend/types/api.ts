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

export type QuestType =
  | "TALK"
  | "VISIT"
  | "TAKE_CLASS"
  | "MINIGAME"
  | "PURCHASE"
  | "PROMOTION_PREP";

export type QuestStatus = "LOCKED" | "ACTIVE" | "COMPLETED" | "CLAIMED";
export type QuestTargetType =
  | "CHARACTER_CREATED"
  | "MAIN_PLAZA_VISIT"
  | "JOB_SELECTED"
  | "CLASS_TAKE"
  | "MINIGAME_PLAY"
  | "SHOPPING_STREET_VISIT"
  | "ITEM_PURCHASE"
  | "LEVEL_REACHED";

export type UnlockFeature = "ACADEMY" | "MINIGAMES" | "SHOPPING_STREET" | "PROMOTION";

export interface QuestResponse {
  id: number;
  code: string;
  title: string;
  description: string;
  questType: QuestType;
  jobRestriction: CharacterJob | null;
  prerequisiteQuestId: number | null;
  requiredTargetType: QuestTargetType;
  requiredTargetId: number | null;
  requiredCount: number;
  rewardBeads: number;
  rewardExp: number;
  rewardItemId: number | null;
  rewardTitle: string | null;
  unlockFeature: UnlockFeature | null;
  promotionQuest: boolean;
  sortOrder: number;
  status: QuestStatus;
  progressCount: number;
  startedAt: string | null;
  completedAt: string | null;
  claimable: boolean;
}

export interface QuestProgressOverviewResponse {
  totalCount: number;
  activeCount: number;
  completedCount: number;
  claimedCount: number;
  lockedCount: number;
  currentLevel: number;
  currentExp: number;
}

export interface ClaimQuestResponse {
  quest: QuestResponse;
  rewardBeads: number;
  rewardExp: number;
  rewardTitle: string | null;
  character: CharacterResponse;
}

export interface JobClassStatRewardResponse {
  statType: StatType;
  rewardAmount: number;
}

export interface JobClassResponse {
  id: number;
  name: string;
  job: CharacterJob;
  costBeads: number;
  rewardExp: number;
  repeatable: boolean;
  unlockLevel: number;
  unlockPromotionTier: PromotionTier;
  available: boolean;
  statRewards: JobClassStatRewardResponse[];
}

export interface TakeJobClassResponse {
  jobClass: JobClassResponse;
  spentBeads: number;
  rewardExp: number;
  previousLevel: number;
  currentLevel: number;
  leveledUp: boolean;
  character: CharacterResponse;
}
