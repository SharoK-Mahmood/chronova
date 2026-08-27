import "dotenv/config";

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET", "change-me-in-production"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@chronova.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "ChronovaAdmin123!",
  adminFirstName: process.env.ADMIN_FIRST_NAME ?? "Chronova",
  adminLastName: process.env.ADMIN_LAST_NAME ?? "Admin",
} as const;
