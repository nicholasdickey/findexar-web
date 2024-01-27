import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { userId } = getAuth(req);
  /*if(!userId){
    res.status(401).send("Not logged in");
    return;
  }*/
  let { league,page} = req.query;
  userId=userId||"";
  page=page||"0";
  const {data}= await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&league=${encodeURIComponent(league as string||"")}&page=${encodeURIComponent(page as string||"")}`);
  console.log("API: fetch-stories",`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&league=${encodeURIComponent(league as string||"")}&page=${encodeURIComponent(page as string||"")}`);
  res.status(200).json(data);
};
export default handler;