import { NextApiHandler } from "next";

import { getProductsForListing } from "../../lib/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
    const page = req.query.page;
    const category = typeof req.query.category === "string" ? [req.query.category] : req.query.category;

    const pageNumber = parseInt(page as string)

    if(page && isNaN(pageNumber)){
        return res.status(400).json({ error: "The value you provided for page is not a number" }); 
    }

    const usePreview = parseBoolean(req.query.preview);
    if (usePreview === null) {
        return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
    }

    const products = await getProductsForListing(usePreview, isNaN(pageNumber) ? undefined : pageNumber, category);
  
    return res.status(200).json({ products: products.items, totalCount: products.pagination.totalCount});
  };
  
  export default handler;