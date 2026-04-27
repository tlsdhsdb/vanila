import { API_BASE_URL } from "@/lib/config";

type JsonBody = object;

type ApiRequestInit = Omit<RequestInit, "body"> & {
  authToken?: string;
  body?: BodyInit | JsonBody;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const { authToken, body: requestBody, ...requestInit } = init;
  const headers = new Headers(requestInit.headers);
  const body =
    requestBody && !(requestBody instanceof FormData) && typeof requestBody !== "string"
      ? JSON.stringify(requestBody)
      : requestBody;

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(url, {
    ...requestInit,
    headers,
    body,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiClientError(`Request failed with status ${response.status}`, response.status, payload);
  }

  return payload as T;
}

export const apiClient = {
  get<T>(path: string, init?: ApiRequestInit) {
    return request<T>(path, { ...init, method: "GET" });
  },
  post<T>(path: string, body?: ApiRequestInit["body"], init?: ApiRequestInit) {
    return request<T>(path, { ...init, method: "POST", body });
  },
};

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (
      error.payload &&
      typeof error.payload === "object" &&
      "message" in error.payload &&
      typeof error.payload.message === "string"
    ) {
      return error.payload.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}

export function isAuthenticationError(error: unknown): boolean {
  return error instanceof ApiClientError && (error.status === 401 || error.status === 403);
}
