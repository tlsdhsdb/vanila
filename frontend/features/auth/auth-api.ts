import { apiClient } from "@/lib/api-client";
import type { AccountResponse, ApiEnvelope, AuthResponse } from "@/types/api";

export interface SignupInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function signupAccount(input: SignupInput) {
  const response = await apiClient.post<ApiEnvelope<AuthResponse>>("/api/auth/signup", input);
  return response.data;
}

export async function loginAccount(input: LoginInput) {
  const response = await apiClient.post<ApiEnvelope<AuthResponse>>("/api/auth/login", input);
  return response.data;
}

export async function fetchCurrentAccount(token: string) {
  const response = await apiClient.get<ApiEnvelope<AccountResponse>>("/api/auth/me", {
    authToken: token,
  });
  return response.data;
}

