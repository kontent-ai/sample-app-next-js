import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    healthtech: "about_us_f9c172b",
    healthtech_surgical: "about_us_f9c172b",
    healthtech_imaging: "about_us_f9c172b",
  },
  "terms": {
    healthtech: "terms_and_conditions",
    healthtech_surgical: null,
    healthtech_imaging: null,
  },
} as const satisfies Record<string, PerCollectionCodenames>;

