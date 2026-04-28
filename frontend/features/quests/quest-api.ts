import { apiClient } from "@/lib/api-client";
import type {
  ApiEnvelope,
  ClaimQuestResponse,
  QuestProgressOverviewResponse,
  QuestResponse,
} from "@/types/api";

export async function fetchAllQuests(token: string) {
  const response = await apiClient.get<ApiEnvelope<QuestResponse[]>>("/api/quests", {
    authToken: token,
  });
  return response.data;
}

export async function fetchActiveQuests(token: string) {
  const response = await apiClient.get<ApiEnvelope<QuestResponse[]>>("/api/quests/active", {
    authToken: token,
  });
  return response.data;
}

export async function fetchQuestProgress(token: string) {
  const response = await apiClient.get<ApiEnvelope<QuestProgressOverviewResponse>>("/api/quests/progress", {
    authToken: token,
  });
  return response.data;
}

export async function claimQuestReward(token: string, questId: number) {
  const response = await apiClient.post<ApiEnvelope<ClaimQuestResponse>>(
    `/api/quests/${questId}/claim`,
    undefined,
    { authToken: token },
  );
  return response.data;
}
