import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, JobClassResponse, TakeJobClassResponse } from "@/types/api";

export async function fetchJobClasses(token: string) {
  const response = await apiClient.get<ApiEnvelope<JobClassResponse[]>>("/api/classes", {
    authToken: token,
  });
  return response.data;
}

export async function takeJobClass(token: string, classId: number) {
  const response = await apiClient.post<ApiEnvelope<TakeJobClassResponse>>(
    `/api/classes/${classId}/take`,
    undefined,
    { authToken: token },
  );
  return response.data;
}
