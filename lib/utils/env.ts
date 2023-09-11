import { isValidCollectionCodename } from "../types/perCollection";

const { KONTENT_COLLECTION_CODENAME } = process.env;

if (!isValidCollectionCodename(KONTENT_COLLECTION_CODENAME)) {
  throw new Error(`Invalid collection codename "${KONTENT_COLLECTION_CODENAME}".`);
}

/** Use only on server - for client use `useSiteCodename` hook */
export const siteCodename = KONTENT_COLLECTION_CODENAME;
export const commonCollection = "common";

