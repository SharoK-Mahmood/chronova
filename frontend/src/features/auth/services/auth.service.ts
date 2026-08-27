import { apiClient } from "@/shared/lib/api/client";
import type { AuthSession, User } from "@/features/auth/types/auth.types";

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function registerAccount(input: RegisterInput): Promise<AuthSession> {
  return apiClient<AuthSession>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export async function loginAccount(input: LoginInput): Promise<AuthSession> {
  return apiClient<AuthSession>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function loginWithGoogleCredential(
  credential: string,
): Promise<AuthSession> {
  return apiClient<AuthSession>("/auth/google", {
    method: "POST",
    body: { credential },
  });
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient<{ user: User }>("/auth/me");
  return response.user;
}
