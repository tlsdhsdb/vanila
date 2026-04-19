import { API_BASE_URL } from "@/lib/config";

type JsonBody = Record<string, unknown>;

type ApiRequestInit = Omit<RequestInit, "body"> & {
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
  const headers = new Headers(init.headers);
  const body =
    init.body && !(init.body instanceof FormData) && typeof init.body !== "string"
      ? JSON.stringify(init.body)
      : init.body;

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
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

