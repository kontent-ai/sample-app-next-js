import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    ficto_healthtech: "about_us_f9c172b",
    ficto_surgical: "about_us_f9c172b",
    ficto_healthtech_imaging: "about_us_f9c172b",
  },
} as const satisfies Record<string, PerCollectionCodenames>;

