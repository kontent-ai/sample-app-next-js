import { NextApiHandler } from "next";

import { getItemByCodename } from "../../lib/kontentClient";
import { PerCollection } from "../../lib/types/perCollection";

const handler: NextApiHandler = async (req, res) => {
  const productCodename = req.query.codename;
  if (typeof productCodename !== "string") {
    return res.status(400).json({ error: "You have to provide 'codename' query parameter with the product's codename." });
  }

  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const product = await getItemByCodename(forAllCodenames(productCodename), usePreview);

  return res.status(200).json({ product });
};

const parseBoolean = (str: string | string[] | undefined) => {
  if (typeof str !== "string" || !["true", "false"].includes(str)) {
    return null;
  }
  return str === "true";
}

const forAllCodenames = (value: string): PerCollection<string> => ({
  ficto_healthtech: value,
  ficto_healthtech_imaging: value,
  ficto_surgical: value,
});

export default handler;
