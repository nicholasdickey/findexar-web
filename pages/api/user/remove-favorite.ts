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
  let { findexarxid} = req.query;
  const {data}= await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/remove?api_key=${api_key}&userid=${userId}&findexarxid=${encodeURIComponent(findexarxid as string||"")}`);
  console.log("API: remove favorite",data.success)
  res.status(200).json(data);
};
export default handler;