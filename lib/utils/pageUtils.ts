import { getCookie } from "cookies-next";
import { GetStaticPropsContext, PreviewData } from "next";

import { defaultCookieOptions, envIdCookieName, previewApiKeyCookieName } from "../constants/cookies";
import { defaultEnvId } from "./env";

export const getEnvIdFromRouteParams = (context: GetStaticPropsContext): string => {
  const envId = context.params?.envId;
  const isEnvIdPresent = typeof envId === "string";
  if (!isEnvIdPresent) {
    console.warn("No envId in the route. Falling back to envId from the environment variable.")
  }

  return isEnvIdPresent ? envId : defaultEnvId;
}

export const getPreviewApiKeyFromPreviewData = (previewData: PreviewData | undefined) =>
  previewData && typeof previewData === 'object' && previewApiKeyCookieName in previewData
    ? previewData.currentPreviewApiKey as string
    : undefined;

export const getEnvIdFromCookie = () => getCookie(envIdCookieName, defaultCookieOptions);
