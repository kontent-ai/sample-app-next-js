import type { PerCollection, ValidCollectionCodename } from "../types/perCollection.ts";

export const perCollectionRootItems = {
  ficto_healthtech: "ficto_healthtech",
  ficto_imaging: "ficto_imaging",
  ficto_surgical: "ficto_surgical",
} as const satisfies PerCollection<string>;

export const getRootCodename = (siteCodename: ValidCollectionCodename) =>
  perCollectionRootItems[siteCodename];
