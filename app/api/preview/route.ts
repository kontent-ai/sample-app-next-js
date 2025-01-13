import { ResolutionContext, resolveUrlPath } from "../../../lib/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies, draftMode, headers } from "next/headers";

const DRAFT_MODE_COOKIE_NAME = "__prerender_bypass";

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

  const draft = await draftMode();
  draft.enable();

  const cookieStore = await cookies();

  const path = resolveUrlPath({
    type: type.toString(),
    slug: slug.toString(),
  } as ResolutionContext);

  const response = NextResponse.redirect(new URL(path, req.url));

  response.cookies.set(DRAFT_MODE_COOKIE_NAME, cookieStore.get(DRAFT_MODE_COOKIE_NAME)?.value as string, {path: "/", sameSite:"none", secure: true})

  return response;
}
