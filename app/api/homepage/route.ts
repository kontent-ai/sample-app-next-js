import { cookies, draftMode } from "next/headers";
import { envIdCookieName, previewApiKeyCookieName } from "../../../lib/constants/cookies.ts";
import { getHomepage } from "../../../lib/kontentClient.ts";

export const GET = async () => {
  const usePreview = (await draftMode()).isEnabled;

  const cookiesList = await cookies();

  const currentEnvId = cookiesList.get(envIdCookieName);
  const currentPreviewApiKey = cookiesList.get(previewApiKeyCookieName);
  if (!currentEnvId) {
    return new Response("Missing envId cookie", { status: 400 });
  }

  if (usePreview && !currentPreviewApiKey) {
    return new Response("Missing previewApiKey cookie", { status: 400 });
  }

  const data = await getHomepage(
    { envId: currentEnvId.value, previewApiKey: currentPreviewApiKey?.value },
    usePreview,
  );

  return Response.json(data);
};
