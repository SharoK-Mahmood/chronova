import type { NextConfig } from "next";

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
    ],
  },
};

export default nextConfig;
