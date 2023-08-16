import { NextApiHandler } from "next";

import { getProductTaxonomy } from "../../lib/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
    const usePreview = parseBoolean(req.query.preview);
    if (usePreview === null) {
      return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
    }

    const envId = req.query.envId;
    if (typeof envId !== "string") {
      return res.status(400).json({ error: "You have to provide 'envid' query parameter with the project environment id." });
    }
  
    const productCategories = await getProductTaxonomy(envId, usePreview);
  
    return res.status(200).json(productCategories);
  };
  
  export default handler;