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
  let {league} = req.query;
  league=league||"";
  if(league.length<3)
    league="";
 // console.log("===> getTraclerListMembers:",league,`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId}&league=${league}`)
  const {data}=await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId}&league=${league}`);
  //console.log("===>> getTraclerListMembers:",data)
  res.status(200).json(data);
};
export default handler;