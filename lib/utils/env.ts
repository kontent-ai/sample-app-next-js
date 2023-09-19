import { isValidCollectionCodename } from "../types/perCollection";

const { KONTENT_COLLECTION_CODENAME, NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID} = process.env;

if (!isValidCollectionCodename(KONTENT_COLLECTION_CODENAME)) {
  throw new Error(`Invalid collection codename "${KONTENT_COLLECTION_CODENAME}".`);
}

if(!NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID) {
  throw new Error(`Environment variable NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID is missing`);
}

/** Use only on server - for client use `useSiteCodename` hook */
export const siteCodename = KONTENT_COLLECTION_CODENAME;
export const commonCollection = "common";

export const defaultEnvId = NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;

