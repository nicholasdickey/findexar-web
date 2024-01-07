import * as React from 'react';
import { SWRConfig, unstable_serialize } from 'swr'
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import axios from 'axios';
import { isbot } from '@/lib/isbot.js';
import SinglePage from '@/components/single-page';
import {
    GetServerSidePropsContext,
} from "next";

import {
    recordEvent, getLeagues,
    LeagueTeamsKey, getLeagueTeams, TeamPlayersKey, getTeamPlayers, DetailsKey, getDetails,
    MentionsKey, getMentions, TrackerListMembersKey, getTrackerListMembers
} from '@/lib/api'
const api_key = process.env.LAKE_API_KEY;
interface Props {
    disable?: boolean;
    dark?: number;
    fbclid?: string;
    utm_content?: string;
    isbot?: number;
    isfb?: number;
    sessionid?: string;
    pagetype?: string;
    league?: string;
    team?: string;
    player?: string;
    fallback?: any,
    pageType?: string;
    leagues: string[];
    view: string;
    userId?: string;
    createdAt?: string;
    freeUser?: boolean;
}
export default function Home(props: Props) {
    const fallback = props.fallback;
    return <SWRConfig value={{ fallback }}><SinglePage  {...props} /></SWRConfig>
}
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            let { fbclid, utm_content, dark, view = "Home" }:
                { fbclid: string, utm_content: string, dark: number, view: string } = context.query as any;
            const { userId }: { userId: string | null } = getAuth(context.req);
            const user = userId ? await clerkClient.users.getUser(userId) : null;

            // console.log("USER:", user);
            const createdAt = user?.createdAt || "0";
            let freeUser = false;
            let options = { tracker_filter: 0 };
            if (user?.emailAddresses) {
                for (let i = 0; i < user.emailAddresses.length; i++) {
                    const e = user.emailAddresses[i];
                    const email = e.emailAddress;
                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/options/get?userid=${userId}&api_key=${api_key}&email=${email}`);
                    freeUser = data.exists;
                    //if (options)
                    options = data.options;
                    if (freeUser) {
                        break;
                    }
                }
            }
            console.log("OPTIONS:", userId, options)
            let pagetype = "league";
            utm_content = utm_content || '';
            fbclid = fbclid || '';
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });
            let host = context.req.headers.host || "";
            let ssr = context.params?.ssr as string[];
            // console.log("SSR:", ssr)
            if (!ssr)
                ssr = [''];

            let [arg1, arg2, arg3, arg4, arg5, arg6, arg7] = ssr;
            //  console.log(arg1, arg2, arg3, arg4, arg5, arg6, arg7)
            let league = '';
            let team = '';//'buffalo-bills';
            let player = '';
            let access = arg1;
            league = arg2 || "";
            if (arg3 == 'team') {
                team = arg4;
                pagetype = "team";
                if (arg5 == 'player') {
                    return {
                        redirect: {
                            permanent: false,
                            destination: "/sign-in"
                        }
                    }
                }
            }
            else if (arg3 == 'player') {
                player = arg4;
            }

            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const sessionid = randomstring();
            if (!botInfo.bot) {
                try {
                    recordEvent(sessionid, 'ssr-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-landing-init-error', x);
                }
            }
            if (botInfo.bot) {
                try {
                    await recordEvent(sessionid, 'ssr-bot-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-bot-landing-init-error', x);
                }
            }
            let trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league };
            let trackerListMembers = [];
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId}&league=${league}`);
            trackerListMembers = data.members;
            console.log("!!! TRACKER LIST MEMBERS:", trackerListMembers);
            const leagues = await getLeagues();
            const keyLeagueTeams: LeagueTeamsKey = { func: "leagueTeams", league };
            let leagueTeams = await getLeagueTeams(keyLeagueTeams);

            let teamPlayers = [];
            let details = {};
            let keyTeamPlayers: TeamPlayersKey={type:"teamPlayers",league,teamid:""};
            let keyDetails: DetailsKey = { type:"Details", teamid: "", name: "" };
            let keyMentions: MentionsKey = { type: "mentions", league };
            let mentions = [];
            //  console.log(111,options)
            if (team) {
                const t = leagueTeams?.find((t: any) => t.id == team);
                const teamName = t.name;
                keyTeamPlayers = { type: "teamPlayers", league, teamid: team };
                teamPlayers = await getTeamPlayers(keyTeamPlayers);
                console.log("player:", player)

                if (player) {
                    keyDetails = { type: "Details", teamid: team, name: player };
                    //details = await getDetails(keyDetails);
                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-details-favorites?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}`);
                    details = data.details;
                }
                else {
                  
                    keyDetails = { type: "Details", teamid: team, name: teamName };
                    console.log("SSR Details",keyDetails)
                    //details = await getDetails(keyDetails);
                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-details-favorites?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(teamName as string || "")}`);
                    details = data.details;

                }
            }
            else {
                if (options && options.tracker_filter == 1) {
                    keyMentions = { type: "filtered-mentions", league };
                    const url = league ? `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-filtered-mentions-favorites?league=${encodeURIComponent(league as string)}&userid=${encodeURIComponent(userId as string)}&api_key=${api_key}` : `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-filtered-mentions-favorites?userid=${encodeURIComponent(userId as string)}&api_key=${api_key}`;
                    const { data } = await axios.get(url);
                    //  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", url,data.mentions)
                    mentions = data.mentions;
                }
                else
                    mentions = await getMentions(keyMentions);
            }
            // let userLists:{member:string,teamid:string,xid:string}[]=[];
            // const keyLists:UserListsKey={type:"userLists"};
            /* if(pagetype=='league'&&!league){
                
                 userLists=await getUserLists(keyLists);
             }*/
            let fallback = {
                [unstable_serialize(keyLeagueTeams)]: leagueTeams,
            };


            //if (teamPlayers)
            fallback[unstable_serialize(keyTeamPlayers)] = teamPlayers;
            //if (details && keyDetails)
            fallback[unstable_serialize(keyDetails)] = details;
            //if (mentions && mentions.length > 0)
            fallback[unstable_serialize(keyMentions)] = mentions;
            //fallback[unstable_serialize(keyLists)]= userLists;    
            fallback[unstable_serialize({ type: "options" })] = options;
            fallback[unstable_serialize(trackerListMembersKey)] = trackerListMembers;
            // console.log("view:", view)
            return {
                props: {
                    sessionid,
                    fbclid,
                    utm_content,
                    isbot: botInfo.bot,
                    isfb: botInfo.fb || fbclid ? 1 : 0,
                    dark: dark || 0,
                    league,
                    team,
                    player,
                    leagues,
                    pagetype,
                    fallback,
                    view,
                    userId,
                    createdAt,
                    freeUser,
                }
            }
        } catch (x) {
            console.log("FETCH SSR PROPS ERROR", x);
            context.res.statusCode = 503;
            return {
                props: { error: 503 }
            }
        }
    }
