import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  if (req.query.secret !== 'mySuperSecret' || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid preview token' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(req.query.slug.toString());
}

export default handler;
