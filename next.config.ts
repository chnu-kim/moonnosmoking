import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/moonnosmoking",
  assetPrefix: "/moonnosmoking/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
