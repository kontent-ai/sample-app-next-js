import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    ficto_healthtech: "about_us_f9c172b",
    ficto_healthtech_surgical: "about_us_f9c172b",
    ficto_healthtech_imaging: "about_us_f9c172b",
  },
  // "terms": {
  //   ficto_healthtech: "terms_and_conditions",
  //   ficto_healthtech_surgical: null,
  //   ficto_healthtech_imaging: null,
  // }
} as const satisfies Record<string, PerCollectionCodenames>;

