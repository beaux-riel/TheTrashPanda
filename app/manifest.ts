import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HarvestLink",
    short_name: "HarvestLink",
    description: "Powell River's community food network.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E8",
    theme_color: "#D94F30",
    icons: [
      {
        src: "/bandit/loading.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
