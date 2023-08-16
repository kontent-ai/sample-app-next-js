import { serialize } from 'cookie';
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const envId = req.query.envId;
    if (typeof envId !== "string") {
        return res.status(400).json({ error: "You have to provide 'envId' query parameter with the environmentId." });
    }

    res.setHeader('Set-Cookie', serialize('envId', envId, { path: '/' }));
    res.redirect('/');
    return res;
}

export default handler