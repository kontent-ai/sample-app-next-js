import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

export const perCollectionRootItems = {
  healthtech: "ficto_healthtech",
  healthtech_imaging: "ficto_healthtech_imaging",
  healthtech_surgical: "ficto_healthtech_surgical"
} as const satisfies PerCollection<string>;

export const getRootCodename = (siteCodename: ValidCollectionCodename) => perCollectionRootItems[siteCodename];

