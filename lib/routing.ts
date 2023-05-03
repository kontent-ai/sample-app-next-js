import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    healthtech: "about_us",
    healthtech_surgical: "about_us_0d30999",
    healthtech_imaging: "about_us_f1ef38e",
  },
  "terms": {
    healthtech: "terms_and_conditions",
    healthtech_surgical: null,
    healthtech_imaging: null,
  },
} as const satisfies Record<string, PerCollectionCodenames>;

