import { NextApiRequest } from "next";
import { envIdCookieName, previewApiKeyCookieName } from "../../../lib/constants/cookies";
import { getProductTaxonomy } from "../../../lib/kontentClient";
import { parseBoolean } from "../../../lib/utils/parseBoolean";
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
    return new Response("Missing envId cookie", {status: 400});
  }

  if (usePreview && !currentPreviewApiKey) {
    return new Response("Missing previewApiKey cookie", {status: 400});
  }

  const productCategories = await getProductTaxonomy({ envId: currentEnvId.value, previewApiKey: currentPreviewApiKey?.value }, usePreview);
  
  return Response.json(productCategories);
};
