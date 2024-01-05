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
  const body = req.body;
  let { members } = body;
  let { listxid} = req.query;
  const {data}= await axios.put(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/update-list-members?api_key=${api_key}&userId=${userId}&listxid=${listxid}`,{
    members
  });
  res.status(200).json({members:data.members});
};
export default handler;