import { NextApiHandler } from "next";

import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies";
import { ResolutionContext, resolveUrlPath } from "../../lib/routing";
import { defaultEnvId } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
  // TODO move secret to env variables
  if (req.query.secret !== 'mySuperSecret' || !req.query.slug || !req.query.type) {
    return res.status(401).json({ message: 'Invalid preview token, or no slug and type provided.' })
  }

  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = req.cookies[previewApiKeyCookieName];

  if (!currentPreviewApiKey && currentEnvId !== defaultEnvId) {
    return res.redirect(`/getPreviewApiKey?path=${encodeURIComponent(req.url ?? '')}`);
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({ currentPreviewApiKey });

  const path = resolveUrlPath({
    type: req.query.type.toString(),
    slug: req.query.slug.toString()
  } as ResolutionContext);

  // Redirect to the path from the fetched post
  res.redirect(path);
}

export default handler;
