import type { NextConfig } from "next";

const apiOrigin = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
).replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
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
