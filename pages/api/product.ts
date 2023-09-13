import { NextApiHandler } from "next";

import { getItemByCodename } from "../../lib/kontentClient";
import { Product } from "../../models";

const handler: NextApiHandler = async (req, res) => {
  const productCodename = req.query.codename;
  if (typeof productCodename !== "string") {
    return res.status(400).json({ error: "You have to provide 'codename' query parameter with the product's codename." });
  }

  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const {currentEnvId, currentPreviewApiKey} = req.cookies;
  if (!currentEnvId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  const product = await getItemByCodename<Product>({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, productCodename, usePreview);

  return res.status(200).json({ product });
};

const parseBoolean = (str: string | string[] | undefined) => {
  if (typeof str !== "string" || !["true", "false"].includes(str)) {
    return null;
  }
  return str === "true";
}

export default handler;
