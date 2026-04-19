import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@relaix/shared"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
