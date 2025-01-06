import { previewApiKeyCookieName } from "../../../lib/constants/cookies";
import { ResolutionContext, resolveUrlPath } from "../../../lib/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies, draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  // TODO move secret to env variables
  if (secret !== 'mySuperSecret' || !slug || !type) {
    // res.status(401).json({ message: 'Invalid preview token, or no slug and type provided.' });
    return new Response("Invalid preview token, or no slug and type provided.", {status: 401});
  }

  const cookieStore = await cookies();

  const currentPreviewApiKey = cookieStore.get(previewApiKeyCookieName);

  const draft = await draftMode();
  draft.enable();

  const response = new NextResponse();

  // Enable Preview Mode by setting the cookies
  // const newCookieHeader = await makeCookiesCrossOrigin();
  // if (newCookieHeader) {
  //   res.setHeader("Set-Cookie", newCookieHeader);
  // }

  // response.cookies.set(newCookieHeader)

  const path = resolveUrlPath({
    type: type.toString(),
    slug: slug.toString(),
  } as ResolutionContext);

  // Redirect to the path from the fetched post
  redirect(path);
}

const makeCookieCrossOrigin = (header: string) => {
  const cookie = header.split(";")[0];

  return cookie
    ? `${cookie}; Path=/; SameSite=None; Secure`
    : "";
};

const makeCookiesCrossOrigin = async () => {
  const headersList = await headers();
  const header = headersList.getSetCookie();

  if (typeof header === "string") {
    return makeCookieCrossOrigin(header);
  }
  if (Array.isArray(header)) {
    return header.map(makeCookieCrossOrigin);
  }


  return header;
}
