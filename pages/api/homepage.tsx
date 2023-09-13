import { NextApiHandler } from "next";

import { getHomepage } from "../../lib/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const currentEnvId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  if (!currentEnvId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }
  const currentPreviewApiKey = process.env.KONTENT_PREVIEW_API_KEY;

  const data = await getHomepage({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview);

  res.status(200).json(data);
}

export default handler;