import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

export const perCollectionRootItems = {
  ficto_healthtech: "ficto_healthtech",
  ficto_healthtech_imaging: "ficto_healthtech_imaging",
  ficto_healthtech_surgical: "ficto_healthtech_surgical"
} as const satisfies PerCollection<string>;

export const externalUrlsMapping = Object.fromEntries(
  process.env.NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS?.split(",")
    .map(collectionPair => collectionPair.split(":"))
    .map(([collectionCodename, domain]) => [collectionCodename, "https://" + domain]) ?? []
);

export const getRootCodename = (siteCodename: ValidCollectionCodename) => perCollectionRootItems[siteCodename];

