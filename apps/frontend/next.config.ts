import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@relaix/shared"],
};

export default nextConfig;
