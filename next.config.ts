import type {
  NextConfig,
} from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "usobdaccetjzdjydqbof.supabase.co",
        pathname:
          "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;