import { apiClient, ApiClientError } from "@/lib/api-client";
import type {
  ApiEnvelope,
  CharacterJob,
  CharacterResponse,
  FacePreset,
  HairColor,
  HairStyle,
  SkinTone,
} from "@/types/api";

export interface CharacterCreateInput {
  name: string;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  facePreset: FacePreset;
}

export async function createCharacter(token: string, input: CharacterCreateInput) {
  const response = await apiClient.post<ApiEnvelope<CharacterResponse>>("/api/characters", input, {
    authToken: token,
  });
  return response.data;
}

export async function fetchCurrentCharacter(token: string) {
  const response = await apiClient.get<ApiEnvelope<CharacterResponse>>("/api/characters/me", {
    authToken: token,
  });
  return response.data;
}

export async function selectCharacterJob(token: string, job: CharacterJob) {
  const response = await apiClient.post<ApiEnvelope<CharacterResponse>>(
    "/api/characters/me/job",
    { job },
    { authToken: token },
  );
  return response.data;
}

export function isCharacterMissingError(error: unknown) {
  return error instanceof ApiClientError && error.status === 404;
}
