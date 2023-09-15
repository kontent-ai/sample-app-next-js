import { NextApiHandler } from "next";

import { getHomepage } from "../../lib/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const { currentEnvId, currentPreviewApiKey } = req.cookies;
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (usePreview && !currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  const data = await getHomepage({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview);

  res.status(200).json(data);
}

export default handler;