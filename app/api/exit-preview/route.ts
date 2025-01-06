import { NextApiHandler } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const callback = req.nextUrl.searchParams.get('callback');
  const draft = await draftMode();
  
  // Exit the current user from "Draft Mode". This function accepts no args.
  draft.disable();

  // Redirect the user back to the index page.
  // Might be implemented return URL by the query string.
  redirect(callback && typeof callback === "string" ? callback : "/");
}
