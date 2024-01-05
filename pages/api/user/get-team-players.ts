import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { userId } = getAuth(req);
  userId = userId || "";
  let { league,teamid} = req.query;
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-team-players?league=${encodeURIComponent(league as string||"")}&teamid=${encodeURIComponent(teamid as string||"")}&api_key=${api_key}&userid=${encodeURIComponent(userId as string||"")}`;
  const {data} = await axios.get(url);
  res.status(200).json(data);
};
export default handler;