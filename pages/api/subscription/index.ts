import { subscriptionHandler } from "use-stripe-subscription";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { findOrCreateCustomerId } from "@/lib/findOrCreateCustomerId";
const api_key = process.env.LAKE_API_KEY;
// Placeholder function for findOrCreateCustomerId
/*const findOrCreateCustomerId = async (userId:string) => {
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  if (!user) {
    throw new Error("User not found");
  }
  //console.log("/api/subscriptions/index.ts: user:",user);
  const email=user?.emailAddresses?.[0]?.emailAddress;
  console.log("/api/subscriptions/index.ts: email:",{email,api_key,userId});
  const {data} = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-subscriberid?api_key=${api_key}&email=${email}&userId=${userId}`);
  const subscriberId = data.subscriberId;
  console.log("/api/subscriptions/index.ts: subscriberId:",`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-subscriberid?api_key=${api_key}&email=${email}`,subscriberId);
  // Implement your logic here
  // ...
  return subscriberId
};*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   //console.log("SUBSCRIPTION HANDLER")
  const { userId } = getAuth(req);
 // console.log("SUBSCRIPTION HANDLER userId",userId)
  if(!userId){
    res.status(401).send("Not logged in");
    return;
  }
  const customerId = await findOrCreateCustomerId({
    clerkUserId: userId,
  });
  //console.log("SUBSCRIPTION HANDLER customerId",customerId);
  res.json(
    await subscriptionHandler({ customerId, query: req.query, body: req.body })
  );
};
export default handler;