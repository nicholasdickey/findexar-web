import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = getAuth(req);
    if (!userId) {
        res.status(401).send("Not logged in");
        return;
    }
    let { league } = req.query;
    const url = league ? `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-mentions-favorites?league=${encodeURIComponent(league as string)}&userid=${encodeURIComponent(userId)}&api_key=${api_key}` : `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-mentions-favorites?userid=${encodeURIComponent(userId)}&api_key=${api_key}`;
    const { data } = await axios.get(url);
   // console.log("$$$$$$$$$$$$$$$$$$$$ get-filtered-mentions.ts: data:", url,data)
    res.status(200).json(data);
};
export default handler;