import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: ['cdn.sanity.io'],
    remotePatterns: [
      {
          hostname: "fantastic-eel-761.convex.cloud",
      },
  ],
  },
  
};

export default nextConfig;
