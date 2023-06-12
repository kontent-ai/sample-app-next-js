import { NextApiHandler } from "next";
import { getProductsForListing } from "../../lib/kontentClient";

const handler: NextApiHandler = async (req, res) => {
    const page = req.query.page;
    const category = typeof req.query.category === "string" ? [req.query.category] : req.query.category;

    const pageNumber = parseInt(page as string)

    if(page && isNaN(pageNumber)){
        return res.status(400).json({ error: "The value you provided for page is not a number" }); 
    }
  
    const products = await getProductsForListing(false, isNaN(pageNumber) ? undefined : pageNumber, category);
  
    return res.status(200).json({ products: products.items, totalCount: products.pagination.totalCount});
  };
  
  export default handler;