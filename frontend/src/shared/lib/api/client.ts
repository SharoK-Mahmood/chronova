import type { ApiError } from "@/shared/types/common.types";
import { env } from "@/config/env";
import { getAccessToken } from "@/features/auth/lib/token-storage";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, cache, ...rest } = options;
  const token = getAccessToken();
  const formData = isFormDataBody(body);

  const response = await fetch(`${env.apiUrl}${path}`, {
    cache: cache ?? "no-store",
    ...rest,
    headers: {
      ...(body !== undefined && !formData
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : formData
          ? body
          : JSON.stringify(body),
  });

  if (!response.ok) {
    let error: ApiError = { message: response.statusText };

    try {
      error = (await response.json()) as ApiError;
    } catch {
      // Response body is not JSON — use status text.
    }

    throw new ApiClientError(
      error.message ?? "Request failed",
      response.status,
      error.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
