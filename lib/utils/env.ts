import { isValidCollectionCodename } from "../types/perCollection";

const { NEXT_PUBLIC_KONTENT_COLLECTION_CODENAME } = process.env;

if (!isValidCollectionCodename(NEXT_PUBLIC_KONTENT_COLLECTION_CODENAME)) {
  throw new Error(`Invalid collection codename "${NEXT_PUBLIC_KONTENT_COLLECTION_CODENAME}".`);
}

/** Use only on server - for client use `useSiteCodename` hook */
export const siteCodename = NEXT_PUBLIC_KONTENT_COLLECTION_CODENAME;
