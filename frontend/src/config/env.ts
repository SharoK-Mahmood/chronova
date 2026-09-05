/**
 * Public env must use static `process.env.NEXT_PUBLIC_*` access so Next.js
 * inlines values into the client bundle. Dynamic `process.env[key]` stays
 * undefined in the browser and silently falls back to localhost.
 */
export const env = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
} as const;
