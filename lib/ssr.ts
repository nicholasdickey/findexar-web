import { unstable_serialize } from 'swr'
import { unstable_serialize as us } from 'swr/infinite';
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import axios from 'axios';
import { isbot } from '@/lib/isbot.js';
import { getCookie, setCookie } from 'cookies-next';
import {
    GetServerSidePropsContext,
} from "next";

import {
    recordEvent, getLeagues,
    LeagueTeamsKey, getLeagueTeams, TeamPlayersKey, getTeamPlayers, DetailsKey,
    MentionsKey, TrackerListMembersKey, FavoritesKey, FetchedMentionsKey,
    AMentionKey, getAMention, MetaLinkKey, getMetaLink, FetchedStoriesKey, fetchStories,
    AStoryKey, getAStory
} from '@/lib/api'
const api_key = process.env.LAKE_API_KEY

const ssr = async (context: GetServerSidePropsContext) => {
    try {
        const t1 = new Date().getTime();
        let { tab, fbclid, utm_content, dark, view = "mentions", id,sid }:
            { fbclid: string, utm_content: string, dark: number, view: string, tab: string, id: string,sid:string } = context.query as any;
        let { userId }: { userId: string | null } = getAuth(context.req);
        if (userId == "null")
            userId = '';
        tab = tab || 'all';
        sid=sid||'';
        console.log("SSR userid:", userId)
        const user = userId ? await clerkClient.users.getUser(userId) : null;
        console.log("========== ========= SSR CHECKPOINT 0:", new Date().getTime() - t1, "ms");

        view = view.toLowerCase();
        if(view=='feed')
        view='mentions';
        console.log("VIEW:", view)
        if (view == 'home')
            view = 'mentions';
        const createdAt = user?.createdAt;
        let freeUser = false;
        let options = { tracker_filter: 0 };
        if (userId && user?.emailAddresses) {
            for (let i = 0; i < user.emailAddresses.length; i++) {
                const e = user.emailAddresses[i];
                const email = e.emailAddress;
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/options/get?userid=${userId}&api_key=${api_key}&email=${email}`);
                freeUser = data.exists;
                options = data.options;
                if (freeUser) {
                    break;
                }
            }
        }
        let pagetype = "league";
        utm_content = utm_content || '';
        fbclid = fbclid || '';
        const ua = context.req.headers['user-agent'] || "";
        const botInfo = isbot({ ua });
        let isMobile = Boolean(ua.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        ))
        let host = context.req.headers.host || "";
        let ssr = context.params?.ssr as string[];
        console.log("SSR:", ssr)
        if (!ssr)
            ssr = [''];

        let [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8] = ssr;
        console.log("ARGS", arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
        let league = '';
        let team = '';//'buffalo-bills';
        let player = '';
        let list = '';
        let findexarxid = id || "";
        if(!arg1)
            pagetype="league";
        league = arg2 || "";
        league=league.toUpperCase();
        if (arg3 == 'team') {
            team = arg4;
            pagetype = "team";
            if (arg5 == 'player') {
                player = arg6.replaceAll('_', ' ');
                pagetype = "player";
            }
        }
        else if (arg3 == 'player') {
            player = arg4.replaceAll('_', ' ');
        }
        if (arg7 == 'xid' || arg7 == 'id' || arg7 == 'findexarxid') {
            findexarxid = arg8;
        }
        console.log("NAME:", player);
        var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let sessionid = getCookie('sessionid', { req: context.req, res: context.res });
        let mode = getCookie('mode', { req: context.req, res: context.res }) || "light";

        console.log("========== ========= SSR CHECKPOINT 1:", new Date().getTime() - t1, "ms");

        let fresh = false;
        if (!sessionid) {
            fresh = true;
            sessionid = randomstring();
            setCookie('sessionid', sessionid, { req: context.req, res: context.res, maxAge: 60 * 60 * 24 * 365 });
        }
        if (!botInfo.bot) {
            try {
                recordEvent(sessionid, `ssr-pub${fresh ? '-init' : ''}`, `{"fbclid":"${fbclid}","ua":"${ua}","isMobile":"${isMobile}","utm_content":"${utm_content}"}`);
            } catch (x) {
                console.log('ssr-landing-init-error', x);
            }
        }
        if (botInfo.bot) {
            try {
                await recordEvent(sessionid, 'ssr-bot-pub', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
            } catch (x) {
                console.log('ssr-bot-landing-init-error', x);
            }
        }
        console.log("========== ========= SSR CHECKPOINT 2:", new Date().getTime() - t1, "ms");

        let trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser: userId ? false : true, noLoad: pagetype != 'league' };
        let trackerListMembers = [];

        if (userId && pagetype == 'league') {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId}&league=${league}`);
            trackerListMembers = data.members;
        }
        const leagues = await getLeagues();
        const keyLeagueTeams: LeagueTeamsKey = { func: "leagueTeams", league, noLoad: pagetype == "landing" };
        let leagueTeams = await getLeagueTeams(keyLeagueTeams);

        let teamPlayers = [];
        let details = {};
        let keyTeamPlayers: TeamPlayersKey = { type: "teamPlayers", league, teamid: "" };
        let keyDetails: DetailsKey = { type: "Details", teamid: "", name: "", noUser: userId ? false : true };
        let keyMentions: MentionsKey = { type: "mentions", league, noUser: userId ? false : true };
        if (options && options.tracker_filter == 1) {
            keyMentions = { type: "filtered-mentions", league, noUser: userId ? false : true };
        }
        let fetchMentions = [];

        console.log("========== ========= SSR CHECKPOINT 3:", new Date().getTime() - t1, "ms");
        
        const getAMentionKey: AMentionKey = { type: "AMention", findexarxid: findexarxid, noLoad: findexarxid == "" ? false : true };
        let amention = null;
        const getAStoryKey: AStoryKey = { type: "AStory", sid, noLoad: sid == "" ? true : false };
        let astory = null;
        const metalinkKey: MetaLinkKey = { func: "meta", findexarxid, long: 1 };
        let metaLink = null;
        console.log("userId:", userId)
        if (findexarxid) {
            amention = await getAMention(getAMentionKey);
            metaLink = await getMetaLink(metalinkKey);
        }
        if(sid){
            astory = await getAStory(getAStoryKey);
            console.log("GOT ASTORY:",astory);
        }
        let fetchStories = [];
        console.log("VIEW:", view, "tab:", tab, "team:", team, "player:", player, "league:", league, "userId", userId, "options:", options, "keyMentions:", keyMentions)
        let teamName = '';
        if (team) {
            console.log("in team")
            const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&favorites=0`);
            fetchMentions = dataMentions.mentions;
            console.log(66666)
            console.log('==>',leagueTeams,team)
            const t = leagueTeams?.find((t: any) => t.id == team);
            teamName = t.name;
            keyTeamPlayers = { type: 'teamPlayers', league, teamid: team };
            teamPlayers = await getTeamPlayers(keyTeamPlayers);
        }
        else {
            console.log(1111);
            /*if (options && options.tracker_filter == 1) {
                console.log(222);
                if (view == 'mentions') {
                    const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=1`);
                    fetchMentions = dataMentions.mentions;
                }
            }
            else {*/
            console.log(3333);
            if (tab == 'fav' || tab == 'myteam') {
                if (userId) {
                    if (view == 'mentions') {

                        console.log("========== ========= SSR CHECKPOINT 31:", new Date().getTime() - t1, "ms");

                        const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`);

                        console.log("========== ========= SSR CHECKPOINT 32:", new Date().getTime() - t1, "ms");

                        fetchMentions = dataMentions.mentions;
                    }
                }
                else {
                    if (view == 'mentions') {
                        const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`);
                        fetchMentions = dataMentions.mentions;
                    }
                }
            }
            else {
                console.log(4444);
                // REFACTOR 1/25/2024
                // Fetch stories instead of mentions for the top level (leagues or all)

                if (userId) {
                    console.log(5555);
                    if (view == 'mentions') {

                        console.log("========== ========= SSR CHECKPOINT 131:", new Date().getTime() - t1, "ms");

                        const { data: dataStories } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&page=0&league=${league}`);

                        console.log("========== ========= SSR CHECKPOINT 132:", new Date().getTime() - t1, "ms");

                        fetchStories = dataStories.stories;
                    }
                }
                else {
                    if (view == 'mentions') {
                        console.log(6666)
                        const { data: dataStories } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&page=0&league=${league}`);
                        fetchStories = dataStories.stories;
                       // console.log(fetchStories)
                    }
                }
            }
            //}
        }
        console.log("========== ========= SSR CHECKPOINT 4:", new Date().getTime() - t1, "ms");
        let favoritesKey: FavoritesKey = { type: "Favorites", noUser: userId ? false : true, noLoad: tab != 'fav' };
        let favorites: any[] = [];
        if (tab == 'fav' && userId) {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`);
            favorites = data.favorites;
            console.log("FAVORITES:========================>", `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`, favorites);
        }

        let fallback = {
            [unstable_serialize(keyLeagueTeams)]: leagueTeams,
        };

        fallback[unstable_serialize(keyTeamPlayers)] = teamPlayers;
        fallback[unstable_serialize(keyDetails)] = details;
        fallback[unstable_serialize(favoritesKey)] = favorites;
        fallback[unstable_serialize({ type: "options", noUser: userId ? false : true })] = options;
        fallback[unstable_serialize(trackerListMembersKey)] = trackerListMembers;
        fallback[unstable_serialize(getAMentionKey)] = amention;
        fallback[unstable_serialize(getAStoryKey)] = astory;
        fallback[unstable_serialize(metalinkKey)] = metaLink;

        fallback[us(page => {
            const keyFetchedMentions: FetchedMentionsKey = { type: "FetchedMentions", teamid: team || "", name: player || "", noUser: userId ? false : true, page: page, league: league || "", myteam: tab == 'myteam' ? 1 : 0, noLoad: view != 'mentions' && tab != 'fav' }
            // console.log("FETCHED MENTIONS KEY:", keyFetchedMentions);
            return keyFetchedMentions;
        }
        )] = fetchMentions;
        fallback[us(page => {
            const keyFetchedStories: FetchedStoriesKey = { type: "FetchedStories", noUser: userId ? false : true, page: page, league: league || "", noLoad: (view != 'mentions' && tab != 'fav') || team != '' }
           // console.log("FETCHED Stories KEY:", keyFetchedStories);
            return keyFetchedStories;
        }
        )] = fetchStories;
        // console.log("fetchedMentions:", fetchMentions)
        console.log("========== ========= SSR TIME:", new Date().getTime() - t1, "ms");

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
                t1,
                tab,
                mode,
                findexarxid,
                sid,
                teamName

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