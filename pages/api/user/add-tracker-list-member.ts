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
  let { member,teamid} = req.query;
  const {data}= await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/add?api_key=${api_key}&userid=${userId}&member=${encodeURIComponent(member as string||"")}&teamid=${teamid}`);
  console.log("API: add tracker list member",data.success)
  res.status(200).json({members:data.members});
};
export default handler;