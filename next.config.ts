import type { NextConfig } from "next";

// STATIC=1 builds a view-only copy for GitHub Pages (see .github/workflows/pages.yml); BASE_PATH is "/<repo-name>".
const nextConfig: NextConfig = process.env.STATIC
  ? { output: "export", trailingSlash: true, basePath: process.env.BASE_PATH || "", env: { NEXT_PUBLIC_STATIC: "1", NEXT_PUBLIC_BASE_PATH: process.env.BASE_PATH || "" } }
  : {};

export default nextConfig;
