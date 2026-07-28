import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "Platinum_Edition";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? `/${repoName}` : "",
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined,
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
