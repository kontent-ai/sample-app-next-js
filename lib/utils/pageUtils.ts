import { getCookie } from "cookies-next";
import { PreviewData } from "next";

export const getEnvIdFromRouteParams = (envId: string | undefined) => {
  if (!envId) {
    throw new Error("The envId route parameter is missing");
  }

  return envId;
}

export const getPreviewApiKeyFromPreviewData = (previewData: PreviewData | undefined) =>
  previewData && typeof previewData === 'object' && 'currentPreviewApiKey' in previewData
    ? previewData.currentPreviewApiKey as string
    : undefined;

export const getEnvIdFromCookie = () => getCookie('currentEnvId', { path: '/', sameSite: 'none' });
