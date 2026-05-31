import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname),
  serverExternalPackages: ['pdfjs-dist'],
  turbopack: {
    root: path.resolve(__dirname),
  },

  async redirects() {
    return [];
  },
};

export default nextConfig;
