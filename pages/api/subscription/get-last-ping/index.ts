import { subscriptionHandler } from "use-stripe-subscription";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const api_key = process.env.LAKE_API_KEY;
// Placeholder function for findOrCreateCustomerId
const getLastPing = async (userId:string) => {
 /* const user = userId ? await clerkClient.users.getUser(userId) : null;
  if (!user) {
    throw new Error("User not found");
  }
  console.log("/api/subscriptions/index.ts: user:",user);
  const email=user?.emailAddresses?.[0]?.emailAddress;
 */
  const {data} = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-last-userping?api_key=${api_key}&userId=${userId}`);
  const ping = data.ping;
  // Implement your logic here
  // ...
  return ping;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req);
  if(!userId){
    res.status(401).send("Not logged in");
    return;
  }
  const ping = await getLastPing(userId);
  res.status(200).json({ping})
};
export default handler;