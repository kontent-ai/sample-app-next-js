import { NextApiHandler } from "next";

import { ResolutionContext, resolveUrlPath } from "../../lib/routing";

const handler: NextApiHandler = async (req, res) => {
  // TODO move secret to env variables
  if (req.query.secret !== 'mySuperSecret' || !req.query.slug || !req.query.type) {
    return res.status(401).json({ message: 'Invalid preview token, or no slug and type provided.' })
  }

  const {currentPreviewApiKey} = req.cookies

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({currentPreviewApiKey})

  const path = await resolveUrlPath({
    type: req.query.type.toString(),
    slug: req.query.slug.toString()
  } as ResolutionContext);

  // Redirect to the path from the fetched post
  res.redirect(path);
}

export default handler;
