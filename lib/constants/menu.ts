import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

export const perCollectionRootItems = {
  ficto_healthtech: "ficto_healthtech",
  ficto_healthtech_imaging: "ficto_healthtech_imaging",
  ficto_healthtech_surgical: "ficto_healthtech_surgical"
} as const satisfies PerCollection<string>;

export const getRootCodename = (siteCodename: ValidCollectionCodename) => perCollectionRootItems[siteCodename];

