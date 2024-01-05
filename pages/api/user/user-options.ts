import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs";
import axios from "axios";
const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req);
  if(!userId){
    res.status(401).send("Not logged in");
    return;
  }
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  if (!user) {
    res.status(401).send("Not logged in");
    return;
  }
 // console.log("/api/subscriptions/index.ts: user:",user);
  const email=user?.emailAddresses?.[0]?.emailAddress;
  const {data}=await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/options/get?api_key=${api_key}&email=${email}&userid=${userId}`);
  res.status(200).json(data);
};
export default handler;