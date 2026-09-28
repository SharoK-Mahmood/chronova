import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const apiOrigin = apiUrl.replace(/\/api\/?$/, "");

// #region agent log
fetch("http://127.0.0.1:7242/ingest/e48f63ee-04ff-42df-9270-03f44f8af41e", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "fc00a4",
  },
  body: JSON.stringify({
    sessionId: "fc00a4",
    runId: "pre-fix",
    hypothesisId: "A",
    location: "next.config.ts:load",
    message: "next.config.ts evaluated (server may be restarting)",
    data: {
      pid: process.pid,
      hasParentLockfileHint: true,
      configDir: path.dirname(fileURLToPath(import.meta.url)),
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

function apiRemotePattern():
  | {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
      pathname: string;
    }
  | null {
  try {
    const url = new URL(apiOrigin);
    const protocol = url.protocol === "https:" ? "https" : "http";
    return {
      protocol,
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/uploads/**",
    };
  } catch {
    return null;
  }
}

const apiPattern = apiRemotePattern();

const nextConfig: NextConfig = {
  // Allow Cloudflare quick tunnels (and similar) to load Next.js dev assets.
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "192.168.1.60",
  ],
  // Hide the Next.js DevTools "N" badge during local development.
  // Error overlays still appear if something breaks.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.trycloudflare.com",
        pathname: "/uploads/**",
      },
      ...(apiPattern ? [apiPattern] : []),
    ],
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
      {
        pathname: "/products/**",
      },
      {
        pathname: "/chronova-logo-light.png",
      },
      {
        pathname: "/chronova-logo-dark.png",
      },
      {
        pathname: "/chronova-icon.png",
      },
      {
        pathname: "/favicon.png",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
