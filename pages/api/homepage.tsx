import { NextApiHandler } from "next";

import { getHomepage } from "../../lib/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
    const usePreview = parseBoolean(req.query.preview);
    if (usePreview === null) {
      return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
    }

    const data = await getHomepage(usePreview);

    res.status(200).json(data);
}

export default handler;