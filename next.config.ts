import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` keeps .next; `next build` writes to .next-build (see the npm
  // scripts). Without this, building while the dev server runs deletes the
  // chunks it is serving and the browser throws ChunkLoadError.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Emits a self-contained server at .next/standalone for the Docker runtime.
  output: "standalone",
  // better-sqlite3 ships a native binary; keep it out of the server bundle so
  // Next's file tracing copies it as-is instead of trying to webpack it.
  serverExternalPackages: ["better-sqlite3"],
  images: {
    // When real photography is added under /public/projects, these formats
    // keep the full-bleed images light without visible degradation.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
