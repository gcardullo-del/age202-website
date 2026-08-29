import type {
  NextConfig,
} from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },

  images: {
    unoptimized: true,

    deviceSizes: [
      640,
      768,
      1024,
      1280,
      1536,
    ],

    imageSizes: [
      64,
      96,
      128,
      256,
      384,
    ],

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