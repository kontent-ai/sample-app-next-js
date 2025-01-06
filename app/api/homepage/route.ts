import { NextApiHandler } from "next";
import { parseBoolean } from "../../../lib/utils/parseBoolean";
import { envIdCookieName, previewApiKeyCookieName } from "../../../lib/constants/cookies";
import { getHomepage } from "../../../lib/kontentClient";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const usePreview = parseBoolean(searchParams.get("preview"));

  if (usePreview === null) {
    return new Response("Please provide 'preview' query parameter with value 'true' or 'false'.", {status: 400});
  }

  const cookiesList = await cookies();

  const currentEnvId = cookiesList.get(envIdCookieName);
  const currentPreviewApiKey = cookiesList.get(previewApiKeyCookieName);
  if (!currentEnvId) {
    return new Response("Missing envId cookie", {status: 400})
  }

  if (usePreview && !currentPreviewApiKey) {
    return new Response("Missing previewApiKey cookie", {status: 400})
  }

  const data = await getHomepage({ envId: currentEnvId.value, previewApiKey: currentPreviewApiKey?.value }, usePreview);

  return Response.json(data);
}
