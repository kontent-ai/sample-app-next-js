import { cookies, draftMode } from "next/headers";
import { envIdCookieName, previewApiKeyCookieName } from "../../../lib/constants/cookies";
import { getItemsByCodenames } from "../../../lib/kontentClient";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const codenames = searchParams.getAll("codenames");
  
  if (typeof codenames !== "string") {
    return new Response("You have to provide 'codenames' query parameter with the your items codenames.", {status: 400});
  }

  const usePreview = (await draftMode()).isEnabled

  const cookiesList = await cookies();

  const currentEnvId = cookiesList.get(envIdCookieName);
  const currentPreviewApiKey = cookiesList.get(previewApiKeyCookieName);

  if (!currentEnvId) {
    return new Response("Missing envId cookie", {status: 400})
  }

  if (usePreview && !currentPreviewApiKey) {
    return new Response("Missing previewApiKey cookie", {status: 400})
  }

  const data = await getItemsByCodenames({ envId: currentEnvId.value, previewApiKey: currentPreviewApiKey?.value }, codenames,  usePreview);

  return Response.json(data);
}