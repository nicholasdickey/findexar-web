import { NextApiRequest, NextApiResponse } from "next";
import { getCookie,setCookie } from 'cookies-next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
let { name,value} = req.query;
    setCookie(name as string|"", value, { req, res, maxAge: 365*3600*24 });  
  res.status(200).json({success:true});
};
export default handler;