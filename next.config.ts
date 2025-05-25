import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  base: process.env.NEXT_BASE_PATH || "/app-risk"
};

export default nextConfig;
