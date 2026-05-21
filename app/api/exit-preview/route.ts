import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getSafeRedirectPath } from "../../../lib/routing.ts";

export const GET = async (req: NextRequest) => {
  const callback = req.nextUrl.searchParams.get("callback");
  const draft = await draftMode();

  // Exit the current user from "Draft Mode". This function accepts no args.
  draft.disable();

  // Redirect the user back to the page from the `callback` query string, but only
  // when it stays on this origin - otherwise fall back to the index page.
  redirect(getSafeRedirectPath(callback, req.nextUrl.origin));
};
