import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { envIdCookieName, previewApiKeyCookieName } from "../../../lib/constants/cookies.ts";
import { getProductsForListing } from "../../../lib/kontentClient.ts";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const category = searchParams.getAll("category");
  const page = searchParams.get("page");

  const pageNumber = parseInt(page as string, 10);

  if (page && Number.isNaN(pageNumber)) {
    return new Response("The value you provided for page is not a number", { status: 400 });
  }

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

  const products = await getProductsForListing(
    { envId: currentEnvId.value, previewApiKey: currentPreviewApiKey?.value },
    usePreview,
    Number.isNaN(pageNumber) ? undefined : pageNumber,
    category.length ? category : undefined,
  );

  return Response.json({ products: products.items, totalCount: products.pagination.totalCount });
};
