import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/FE-blog",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
