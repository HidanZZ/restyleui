import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // `/docs/<path>.md` serves the markdown of a docs page. The internal handler is
  // `/docs-md/<path>` so it cannot collide with the docs page routes.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/docs.md", destination: "/docs-md" },
        { source: "/docs/:path*.md", destination: "/docs-md/:path*" },
      ],
    }
  },
}

export default nextConfig;
