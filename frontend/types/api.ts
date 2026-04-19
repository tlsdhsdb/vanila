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
