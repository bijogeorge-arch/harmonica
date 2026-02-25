import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles image optimization automatically
  images: {
    unoptimized: false,
  },
  // Strict mode for better development experience
  reactStrictMode: true,
  // Ensure env vars are validated at build time
  env: {
    // These will be undefined at build time on Vercel unless set in dashboard
  },
  // Optimize for serverless
  serverExternalPackages: [],
};

export default nextConfig;
