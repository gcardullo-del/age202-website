import type {
  MetadataRoute,
} from "next";


export default function manifest():
  MetadataRoute.Manifest {
  return {
    name:
      "AGE202 | The Digital Tennis Museum",

    short_name:
      "AGE202",

    description:
      "AGE202 — The Digital Tennis Museum.",

    start_url:
      "/",

    display:
      "standalone",

    background_color:
      "#050B18",

    theme_color:
      "#050B18",

    orientation:
      "portrait",

    icons: [
      {
        src:
          "/icon.png",

        sizes:
          "512x512",

        type:
          "image/png",

        purpose:
          "any",
      },
      {
        src:
          "/apple-icon.png",

        sizes:
          "180x180",

        type:
          "image/png",

        purpose:
          "any",
      },
    ],
  };
}