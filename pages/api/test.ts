import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  console.log("fdsa");
  res.redirect('/');
}

export default handler;