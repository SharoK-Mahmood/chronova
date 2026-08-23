import type { ApiError } from "@/shared/types/common.types";
import { env } from "@/config/env";

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

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
