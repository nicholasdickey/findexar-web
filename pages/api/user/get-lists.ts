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
  const {data}=await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-lists?api_key=${api_key}&userId=${userId}`);
  res.status(200).json({lists:data.lists});
};
export default handler;