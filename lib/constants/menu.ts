import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

export const perCollectionRootItems = {
  healthtech: "healthtech",
  healthtech_imaging: "healthtech_imaging",
  healthtech_surgical: "healthtech_surgical"
} as const satisfies PerCollection<string>;

export const getRootCodename = (siteCodename: ValidCollectionCodename) => perCollectionRootItems[siteCodename];

