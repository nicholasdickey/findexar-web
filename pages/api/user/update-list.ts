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
  let { listxid,name,description} = req.query;
  const {data}=await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/update-list?api_key=${api_key}&userId=${userId}&name=${name}&description=${description}&listxid=${listxid}`);
  res.status(200).json({lists:data.lists})
};
export default handler;