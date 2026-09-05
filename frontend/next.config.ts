import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const apiOrigin = apiUrl.replace(/\/api\/?$/, "");

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
    "glucose-alice-amino-candy.trycloudflare.com",
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
        pathname: "/chronova-logo.png",
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
