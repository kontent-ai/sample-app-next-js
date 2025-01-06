import { NextApiHandler } from "next";
import { NextRequest } from "next/server";
import { parseBoolean } from "../../../lib/utils/parseBoolean";
import { cookies } from "next/headers";
import { envIdCookieName, previewApiKeyCookieName } from "../../../lib/constants/cookies";
import { getItemByCodename } from "../../../lib/kontentClient";
import { Product } from "../../../models";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const productCodename = searchParams.get("codename");
  
  if (typeof productCodename !== "string") {
    return new Response("You have to provide 'codename' query parameter with the product's codename.", {status: 400});
  }

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

  const product = await getItemByCodename<Product>({ envId: currentEnvId.value, previewApiKey: currentPreviewApiKey?.value }, productCodename, usePreview);

  return Response.json({ product });
};
