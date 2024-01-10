import { SWRConfig, unstable_serialize } from 'swr'
import { unstable_serialize as us } from 'swr/infinite';
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import axios from 'axios';
import { isbot } from '@/lib/isbot.js';
import SinglePage from '@/components/single-page';
import { getCookie,setCookie } from 'cookies-next';
import {
    GetServerSidePropsContext,
} from "next";

import {
    recordEvent, getLeagues,
    LeagueTeamsKey, getLeagueTeams, TeamPlayersKey, getTeamPlayers, DetailsKey, getDetails,
    MentionsKey, getMentions, TrackerListMembersKey, FavoritesKey, FetchedMentionsKey
} from '@/lib/api'
const api_key = process.env.LAKE_API_KEY

const ssr = async (context: GetServerSidePropsContext) => {
    try {
        const t1=new Date().getTime();
        let { fbclid, utm_content, dark, view = "mentions" }:
            { fbclid: string, utm_content: string, dark: number, view: string } = context.query as any;
        let { userId }: { userId: string | null } = getAuth(context.req);
        if(userId=="null")
            userId=null;
        console.log("SSR userid:", userId   )
        const user = userId ? await clerkClient.users.getUser(userId) : null;
        console.log("========== ========= SSR CHECKPOINT 0:", new Date().getTime() - t1, "ms");
      
        view = view.toLowerCase();
        console.log("VIEW:", view)
        if(view=='home')
            view='mentions';
     
        //console.log("USER:",user);
        const createdAt = user?.createdAt;
        let freeUser = false;
        let options = { tracker_filter: 0 };
        if (userId && user?.emailAddresses) {
            for (let i = 0; i < user.emailAddresses.length; i++) {
                const e = user.emailAddresses[i];
                const email = e.emailAddress;
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/options/get?userid=${userId}&api_key=${api_key}&email=${email}`);
                freeUser = data.exists;
                //  if (!options)

                options = data.options;
                if (freeUser) {
                    break;
                }
            }
        }
        // console.log("OPTIONS:", options)
        let pagetype = "league";
        utm_content = utm_content || '';
        fbclid = fbclid || '';
        const ua = context.req.headers['user-agent'];
        const botInfo = isbot({ ua });
        let host = context.req.headers.host || "";
        let ssr = context.params?.ssr as string[];
        console.log("SSR(pro):", ssr)
        if (!ssr)
            ssr = [''];

        let [arg1, arg2, arg3, arg4, arg5, arg6, arg7] = ssr;
        console.log(arg1, arg2, arg3, arg4, arg5, arg6, arg7)
        let league = '';
        let team = '';//'buffalo-bills';
        let player = '';
        let list = '';
        let access = arg1;
        if (arg1 == 'league') {
            league = arg2 || "";
        }
        if (arg3 == 'team') {
            team = arg4;
            pagetype = "team";
            if (arg5 == 'player') {
                player = arg6;
                pagetype = "player";
            }
        }
        else if (arg3 == 'player') {
            player = arg4;
        }
        if (arg1 == 'list') {
            pagetype = "list";
            list = (arg2 || "");
        }
        console.log({ pagetype, league, team, player })
        var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let sessionid=getCookie('sessionid', { req:context.req, res:context.res });
        console.log("========== ========= SSR CHECKPOINT 1:", new Date().getTime() - t1, "ms");
      
        if(!sessionid){
            sessionid = randomstring();
            setCookie('sessionid', sessionid, { req:context.req, res:context.res, maxAge: 60 * 6 * 24 });  
        }
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
        console.log("========== ========= SSR CHECKPOINT 2:", new Date().getTime() - t1, "ms");
      
        let trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser: userId ? false : true, noLoad: view != 'my team' };
        let trackerListMembers = [];
       //console.log("view==>", view, view == 'my team');
        if (userId && view == 'my team') {
            // create milliseconds timestamp
            console.log("TRACKER LIST MEMBERS START")
            const timestamp = new Date().getTime();
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId}&league=${league}`);
            console.log("TRACKER LIST MEMBERS TIME:", new Date().getTime() - timestamp, "ms");
            trackerListMembers = data.members;
        }

        const leagues = await getLeagues();
        const keyLeagueTeams: LeagueTeamsKey = { func: "leagueTeams", league };
        let leagueTeams = await getLeagueTeams(keyLeagueTeams);

        let teamPlayers = [];
        let details = {};
        let keyTeamPlayers: TeamPlayersKey = { type: "teamPlayers", league, teamid: "" };
        let keyDetails: DetailsKey = { type: "Details", teamid: "", name: "", noUser: userId ? false : true };
        let keyMentions: MentionsKey = { type: "mentions", league, noUser: userId ? false : true };
        if (options && options.tracker_filter == 1) {
            keyMentions = { type: "filtered-mentions", league, noUser: userId ? false : true };
        }
        // let mentions = [];
        let fetchMentions = [];
        console.log("========== ========= SSR CHECKPOINT 3:", new Date().getTime() - t1, "ms");
      
        console.log("VIEW:", view,"team:",team,"player:",player,"league:",league,"userId",userId,"options:",options,"keyMentions:",keyMentions)
        if (team) {
            console.log("in team")
            const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&favorites=0`);
            fetchMentions = dataMentions.mentions;

            const t = leagueTeams?.find((t: any) => t.id == team);
            const teamName = t.name;
            keyTeamPlayers = { type: 'teamPlayers', league, teamid: team };
            teamPlayers = await getTeamPlayers(keyTeamPlayers);
            //console.log("player:",keyTeamPlayers, player,teamPlayers)
        }
        else {
            if (options && options.tracker_filter == 1) {
                // keyMentions = { type: "filtered-mentions", league, noUser: userId ? false : true };
                // const url = league ? `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-filtered-mentions-favorites?league=${encodeURIComponent(league as string)}&userid=${encodeURIComponent(userId as string)}&api_key=${api_key}` : `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-filtered-mentions-favorites?userid=${encodeURIComponent(userId as string)}&api_key=${api_key}`;
                console.log("fetrhin mentions for my team")
                if (view == 'mentions') {
                    const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=1`);
                    fetchMentions = dataMentions.mentions;
                }
                //const { data } = await axios.get(url);
                // mentions = data.mentions;
            }
            else {
                if (userId) {
                    console.log("getting mentions with userId:", userId)
                    /*  const url = league ? `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-mentions-favorites?league=${encodeURIComponent(league as string)}&userid=${encodeURIComponent(userId)}&api_key=${api_key}` : `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/get-mentions-favorites?userid=${encodeURIComponent(userId)}&api_key=${api_key}`;
                      const { data } = await axios.get(url);
                      mentions = data.mentions;
                      */
                    if (view == 'mentions') {
                        console.log("FETCH MENTIONS SSR")
                        const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=0`);
                        fetchMentions = dataMentions.mentions;
                    }
                }
                else {
                    if (view == 'mentions') {
                        const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=0`);
                        fetchMentions = dataMentions.mentions;
                    }
                }
                // mentions = await getMentions(keyMentions);
            }

        }
        let favoritesKey: FavoritesKey = { type: "Favorites", noUser: userId ? false : true, noLoad: view != 'fav' };
        let favorites: any[] = [];
        if (view == 'fav' && userId) {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`);
            favorites = data.favorites;
            console.log("FAVORITES:========================>", `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`, favorites);
        }
        /* let userLists:{member:string,teamid:string,xid:string}[]=[];
          const keyLists:UserListsKey={type:"userLists"};
          if(pagetype=='league'&&!league||pagetype=='list'){
             
              userLists=await getUserLists(keyLists);
          }*/


        let fallback = {
            [unstable_serialize(keyLeagueTeams)]: leagueTeams,
        };
        //if(teamPlayers)
        fallback[unstable_serialize(keyTeamPlayers)] = teamPlayers;
        //if(details&&keyDetails) 
        fallback[unstable_serialize(keyDetails)] = details;
        // if(mentions&&mentions.length>0)
        //   fallback[unstable_serialize(keyMentions)] = mentions;
        fallback[unstable_serialize(favoritesKey)] = favorites;
        //fallback[unstable_serialize(keyLists)]= userLists;    
        fallback[unstable_serialize({ type: "options", noUser: userId ? false : true })] = options;
        fallback[unstable_serialize(trackerListMembersKey)] = trackerListMembers;
        fallback[us(page => {
            const keyFetchedMentions: FetchedMentionsKey = { type: "FetchedMentions", teamid: team || "", name: player || "", noUser: userId ? false : true, page: page, league: league || "", myteam: options && options.tracker_filter == 1 ? 1 : 0,noLoad: view != 'mentions'&&view!='fav' }
            console.log("FETCHED MENTIONS KEY:", keyFetchedMentions);
            return keyFetchedMentions;
        }
        )] = fetchMentions;
       // console.log("fetchedMentions:", fetchMentions)
       console.log("========== ========= SSR TIME:", new Date().getTime() - t1, "ms");
       console.log("SSR league:",league)
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
                createdAt: createdAt || "",
                freeUser,
                list,
                t1

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

export default ssr;