import { NextApiHandler } from "next";

import { getProductTaxonomy } from "../../lib/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const {currentEnvId, currentPreviewApiKey} = req.cookies;
  if (!currentEnvId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  const productCategories = await getProductTaxonomy({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview);

  return res.status(200).json(productCategories);
};

export default handler;