import { isValidCollectionCodename } from "../types/perCollection";

const { KONTENT_COLLECTION_CODENAME } = process.env;

if (!isValidCollectionCodename(KONTENT_COLLECTION_CODENAME)) {
  throw new Error(`Invalid collection codename "${KONTENT_COLLECTION_CODENAME}".`);
}

export const siteCodename = KONTENT_COLLECTION_CODENAME;
