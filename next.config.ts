import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
    qualities: [100, 75],
  },
};

export default nextConfig;
