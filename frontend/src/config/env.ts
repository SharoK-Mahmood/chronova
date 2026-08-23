function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  apiUrl: getEnv("NEXT_PUBLIC_API_URL", "http://localhost:3001/api"),
} as const;
