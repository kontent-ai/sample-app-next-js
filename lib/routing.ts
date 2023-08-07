import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

// Those are used for static site generation in pages/[slug].tsx
export const pageCodenamesForGenericPrerender = {
  "about-us": {
    ficto_healthtech: "about_us_f9c172b",
    ficto_healthtech_surgical: "about_us_f9c172b",
    ficto_healthtech_imaging: "about_us_f9c172b",
  },
} as const satisfies Record<string, PerCollectionCodenames>;

export const pageCodenames = {
  products: {
    ficto_healthtech: null,
    ficto_healthtech_imaging: null,
    ficto_healthtech_surgical: "products_surgical"
  },
  articles: {
    ficto_healthtech: "articles",
    ficto_healthtech_imaging: null,
    ficto_healthtech_surgical: "articles_surgical"
  },
  ...pageCodenamesForGenericPrerender
} as const satisfies Record<string, PerCollectionCodenames>;

