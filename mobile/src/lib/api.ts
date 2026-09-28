import { env } from "@/src/config/env";
import { getAccessToken } from "@/src/storage/token";

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
  const token = await getAccessToken();

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = response.statusText;
    let code: string | undefined;

    try {
      const error = (await response.json()) as {
        message?: string;
        code?: string;
      };
      message = error.message ?? message;
      code = error.code;
    } catch {
      // Non-JSON error body.
    }

    throw new ApiClientError(message || "Request failed", response.status, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
