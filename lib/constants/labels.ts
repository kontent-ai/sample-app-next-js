import type { PerCollection } from "../types/perCollection.ts";

export const perCollectionSEOTitle = {
  ficto_healthtech: "Ficto Healthtech",
  ficto_imaging: "Ficto Imaging",
  ficto_surgical: "Ficto Surgical",
} as const satisfies PerCollection<string>;

export const perCollectionSiteName: PerCollection<string> = {
  ficto_healthtech: "| Healthtech",
  ficto_imaging: "| Imaging",
  ficto_surgical: "| Surgical",
};
