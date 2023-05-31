import { NextApiHandler } from "next";
import { getHomepage } from "../../lib/kontentClient";

const handler: NextApiHandler = async (req, res) => {
    const data = await getHomepage(true);

    res.status(200).json(data);
}

export default handler;