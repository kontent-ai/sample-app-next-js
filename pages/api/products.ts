import { NextApiHandler } from "next";
import { getProductsForListing } from "../../lib/kontentClient";

const handler: NextApiHandler = async (req, res) => {
    const page = req.query.page;
    let category = req.query.category;

    if(typeof category === 'string'){
        category = [category]
    }

    const pageNumber = parseInt(page as string)

    if(page && isNaN(pageNumber)){
        return res.status(400).json({ error: "The value you provided for page is not a number" }); 
    }
  
    const products = await getProductsForListing(false, isNaN(pageNumber) ? undefined : pageNumber, category);
  
    return res.status(200).json({ products });
  };
  
  export default handler;