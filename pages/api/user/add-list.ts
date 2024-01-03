import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req);
  if(!userId){
    res.status(401).send("Not logged in");
    return;
  }
  let { name,description} = req.query;
  await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/add-list?api_key=${api_key}&userId=${userId}&name=${name}&description=${description}`);
  res.status(200).json({})
};
export default handler;