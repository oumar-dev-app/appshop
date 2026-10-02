import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hrl9n2vaoubj8efb.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;