import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  // Redirect the user back to the index page.
  // Might be implemented return URL by the query string.
  res.redirect(req.query.callback && typeof req.query.callback === "string" ? req.query.callback : "/");
}

export default handler;
