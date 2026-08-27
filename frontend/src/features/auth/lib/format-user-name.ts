import type { User } from "@/features/auth/types/auth.types";

/** Build a display name from auth user fields. */
export function formatUserDisplayName(user: Pick<User, "firstName" | "lastName">): string {
  return [user.firstName, user.lastName]
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part.toLowerCase() !== "customer")
    .join(" ")
    .trim();
}
