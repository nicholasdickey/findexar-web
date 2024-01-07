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

  let { teamid,name} = req.query;
  userId=userId||"";
  const {data}= await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-details-favorites?api_key=${api_key}&userid=${userId}&teamid=${teamid}&name=${encodeURIComponent(name as string||"")}`);
  console.log("API: get details favorites",data.success);
  res.status(200).json(data);
};
export default handler;