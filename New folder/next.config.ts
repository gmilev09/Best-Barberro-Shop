import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = isStaticExport
  ? {
      // Режим GitHub Pages — изцяло статичен износ в ./out
      output: "export",
      trailingSlash: true,
      basePath,
      assetPrefix: basePath || undefined,
      images: {
        unoptimized: true,
        remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
      },
    }
  : {
      // Fullstack режим — Next.js сървър + PostgreSQL
      images: {
        remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
      },
    };

export default nextConfig;
