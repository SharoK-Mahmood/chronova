/**
 * Public env must use static `process.env.EXPO_PUBLIC_*` access so Expo
 * inlines values into the client bundle.
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/api",
  webUrl: process.env.EXPO_PUBLIC_WEB_URL ?? "http://localhost:3000",
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "",
} as const;

export const apiOrigin = env.apiUrl.replace(/\/api\/?$/, "");
