import { NextApiHandler } from "next";

import { ignoreMissingApiKeyCookieName } from "../../lib/constants/cookies";

const handler: NextApiHandler = (req, res) => {
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  res.setHeader("Set-Cookie", `${ignoreMissingApiKeyCookieName}=; Path=/; SameSite=None; Secure; Max-Age=-1`);

  // Redirect the user back to the index page.
  // Might be implemented return URL by the query string.
  res.redirect(typeof req.query.callback === "string" ? req.query.callback : "/");
}

export default handler;
