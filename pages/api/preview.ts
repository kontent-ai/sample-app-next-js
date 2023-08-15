import { NextApiHandler } from "next";

import { resolveUrlPath } from "../../lib/routing";

const handler: NextApiHandler = async (req, res) => {
  if (req.query.secret !== 'mySuperSecret' || !req.query.slug || !req.query.type) {
    return res.status(401).json({ message: 'Invalid preview token, or no slug and type provided.' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  const path = await resolveUrlPath(req.query.slug.toString(), req.query.type.toString());

  // Redirect to the path from the fetched post
  res.redirect(path);
}

export default handler;
