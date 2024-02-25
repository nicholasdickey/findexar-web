import { unstable_serialize } from 'swr'
import { unstable_serialize as us } from 'swr/infinite';
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import axios from 'axios';
import { isbot } from '@/lib/isbot.js';
//import { getCookie, setCookie } from 'cookies-next';
import {
    GetServerSidePropsContext,
} from "next";

import {
    recordEvent, getLeagues,
    LeagueTeamsKey, getLeagueTeams, TeamPlayersKey, getTeamPlayers, DetailsKey,
    MentionsKey, TrackerListMembersKey, FavoritesKey, FetchedMentionsKey,
    AMentionKey, getAMention, MetaLinkKey, getMetaLink, FetchedStoriesKey, fetchStories,
    ASlugStoryKey, getASlugStory
} from '@/lib/api'
import { withSessionSsr, Options } from '@/lib/with-session';
const api_key = process.env.LAKE_API_KEY;
async function fetchData(t1:any,fallback:any,calls: { key: any, call: Promise<any> }[]) {
    //const fetchPromise1 = fetch(url1);
    //const fetchPromise2 = fetch(url2);
    const promises=calls.map(call=>call.call);
    try {
        console.log("========== ========= SSR CHECKPOINT 119:", new Date().getTime() - t1, "ms");

        const responses = await Promise.all(promises);
        console.log("========== ========= SSR CHECKPOINT 120:", new Date().getTime() - t1, "ms");

       // const dataPromises = responses.map(response => response.json()); // Assuming the fetch URLs return JSON data
        for(let i=0;i<calls.length;i++){
            fallback[calls[i].key]= responses[i];
            console.log(`========== ========= SSR CHECKPOINT 12${i}:`, new Date().getTime() - t1, "ms");

        }
        //   const data = await Promise.all(dataPromises);
      //  return data; // Returns an array of data from the two URLs
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow or handle as appropriate
    }
    return fallback;
}
const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            const t1 = new Date().getTime();
            let { tab, fbclid, utm_content, view = "mentions", id, story }:
                { fbclid: string, utm_content: string, view: string, tab: string, id: string, story: string } = context.query as any;
            let { userId }: { userId: string | null } = getAuth(context.req);
            // console.log("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
            // console.log("CLERK_SECRET_KEY",process.env.CLERK_SECRET_KEY);
            console.log("AUTH:", userId);
            if (userId == "null")
                userId = '';
            tab = tab || 'all';
            // sid = sid || '';
            story = story || '';
            console.log("SSR userid:", userId)
            let user;
            try {
                const props = await buildClerkProps(context.req);
                //console.log("CLERK PROPS:",{props});
                const users = await clerkClient.users.getUserList();
                // console.log("CLERK USERS:",{users});

                // const currentUserVar=await currentUser();
                // console.log("CURRENT USER:",{currentUserVar});
                user = userId ? await clerkClient.users.getUser(userId) : null;
            }
            catch (x) {
                console.log("GET USER ERROR:", x);
                user = null;
            }
            console.log("========== ========= SSR CHECKPOINT 0:", new Date().getTime() - t1, "ms");
            let calls: { key: any, call: Promise<any> }[] = [];
          
            const ssrDataMentions = async (url: string) => {
                const { data: dataMentions } = await axios.get(url);
                return dataMentions.mentions;
            }
            const ssrDataStories = async (url: string) => {
                const { data: dataStories } = await axios.get(url);
                return dataStories.stories;
            }
            const ssrDataFavorites = async (url: string) => {
                const { data } = await axios.get(url);
                return data.favorites;
            }
            const ssrDataTrackListMembers = async (url: string) => {
                const { data } = await axios.get(url);
                return data.members;
            }
            view = view.toLowerCase();
            if (view == 'feed')
                view = 'mentions';
            console.log("VIEW:", view)
            if (view == 'home')
                view = 'mentions';

            const createdAt = user?.createdAt;
            let freeUser = false;
            let tracker_filter = 0;
            if (userId && user?.emailAddresses) {
                for (let i = 0; i < user.emailAddresses.length; i++) {
                    const e = user.emailAddresses[i];
                    const email = e.emailAddress;
                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/options/get?userid=${userId || ""}&api_key=${api_key}&email=${email}`);
                    console.log("========== ========= SSR CHECKPOINT 01:", new Date().getTime() - t1, "ms");

                    freeUser = data.exists;
                    tracker_filter = data.options.tracker_filter;
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
            if (!arg1)
                pagetype = "league";
            league = arg2 || "";
            league = league.toUpperCase();
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

            let startoptions = context.req.session?.options || null;

            if (!startoptions) {
                var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                startoptions = {
                    sessionid: randomstring(),
                    dark: -1,
                }
                context.req.session.options = startoptions;
                await context.req.session.save();
            }
            let options1: Options = startoptions;
            if (!options1.sessionid) {
                options1.sessionid = randomstring();
            }
            const sessionid = options1.sessionid;
            const dark = options1.dark;
            console.log("========== ========= SSR CHECKPOINT 1:", new Date().getTime() - t1, "ms");

            let fresh = false;
            /*if (!sessionid) {
                console.log("NO SESSION ID");
                fresh = true;
                sessionid = randomstring();
                console.log("SET SESSION ID", sessionid);
               // setCookie('sessionid', sessionid, { req: context.req, res: context.res, maxAge: 60 * 60 * 24 * 365 });
            }*/
            console.log("SESSION ID:", sessionid);

            console.log("========== ========= SSR CHECKPOINT 2:", new Date().getTime() - t1, "ms");

            let trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser: userId ? false : true, noLoad: pagetype != 'league' };
            //let trackerListMembers = [];

            if (userId && pagetype == 'league') {
                // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId || ""}&league=${league}`);
                // trackerListMembers = data.members;
                calls.push({ key: unstable_serialize(trackerListMembersKey), call: ssrDataTrackListMembers(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId || ""}&league=${league}`) });
            }
            console.log("========== ========= SSR CHECKPOINT 21:", new Date().getTime() - t1, "ms");

            const leagues = await getLeagues();
            const keyLeagueTeams: LeagueTeamsKey = { func: "leagueTeams", league, noLoad: pagetype == "landing" };
            let leagueTeams = await getLeagueTeams(keyLeagueTeams);
            //calls.push({key:unstable_serialize(keyLeagueTeams),call:leagueTeams});
            //let teamPlayers = [];
            // let details = {};
            let keyTeamPlayers: TeamPlayersKey = { type: "teamPlayers", league, teamid: "" };
            //let keyDetails: DetailsKey = { type: "Details", teamid: "", name: "", noUser: userId ? false : true };
            /*let keyMentions: MentionsKey = { type: "mentions", league, noUser: userId ? false : true };
            if (tracker_filter == 1) {
                keyMentions = { type: "filtered-mentions", league, noUser: userId ? false : true };
            }*/
            let keyMentions = us(page => {
                const keyFetchedMentions: FetchedMentionsKey = { type: "FetchedMentions", teamid: team || "", name: player || "", noUser: userId ? false : true, page: page, league: league || "", myteam: tab == 'myteam' ? 1 : 0, noLoad: view != 'mentions' && tab != 'fav' }
                // console.log("FETCHED MENTIONS KEY:", keyFetchedMentions);
                return keyFetchedMentions;
            }
            );
            let keyStories = us(page => {
                const keyFetchedStories: FetchedStoriesKey = { type: "FetchedStories", noUser: userId ? false : true, page: page, league: league || "", noLoad: (view != 'mentions' && tab != 'fav') || team != '' }
                // console.log("FETCHED Stories KEY:", keyFetchedStories);
                return keyFetchedStories;
            }
            )
            //let fetchMentions = [];

            console.log("========== ========= SSR CHECKPOINT 3:", new Date().getTime() - t1, "ms");

            const getAMentionKey: AMentionKey = { type: "AMention", findexarxid: findexarxid || "", noLoad: findexarxid == "" ? false : true };
            let amention = null;

            const getASlugStoryKey: ASlugStoryKey = { type: "ASlugStory", slug: story, noLoad: story == "" ? true : false };
            //let astory = null;
            const metalinkKey: MetaLinkKey = { func: "meta", findexarxid, long: 1 };
            let metaLink = null;
            // console.log("userId:", userId)

            if (findexarxid) {
                amention = getAMention(getAMentionKey);
                metaLink = getMetaLink(metalinkKey);
                calls.push({ key: unstable_serialize(getAMentionKey), call: amention });
                calls.push({ key: unstable_serialize(metalinkKey), call: metaLink });
            }
            /*  if (sid) {
                  astory = await getAStory(getAStoryKey);
                  console.log("GOT ASTORY:", astory);
              }*/
            let astory = null;
            // console.log("story:",story)
            if (story) {
                astory = getASlugStory(getASlugStoryKey);
                calls.push({ key: unstable_serialize(getASlugStoryKey), call: astory });
                // console.log("GOT A SLUG STORY:", astory);
            }
            // let fetchStories = [];
            console.log("VIEW:", view, "tab:", tab, "team:", team, "player:", player, "league:", league, "userId", userId, "keyMentions:", keyMentions)
            let teamName = '';
            if (team) {
                console.log("in team")
                //const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&favorites=0`);
                //fetchMentions = dataMentions.mentions;
                calls.push({ key: keyMentions, call: ssrDataMentions(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&favorites=0`) });

                console.log(66666)
                //console.log('==>',leagueTeams,team)
                const t = leagueTeams?.find((t: any) => t.id == team);
                teamName = t.name;
                keyTeamPlayers = { type: 'teamPlayers', league, teamid: team };
                let teamPlayers = getTeamPlayers(keyTeamPlayers);
                calls.push({ key: unstable_serialize(keyTeamPlayers), call: teamPlayers });
            }
            else {
                // console.log(1111);
                /*if (options && options.tracker_filter == 1) {
                    console.log(222);
                    if (view == 'mentions') {
                        const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=1`);
                        fetchMentions = dataMentions.mentions;
                    }
                }
                else {*/
                // console.log(3333);

                if (tab == 'fav' || tab == 'myteam') {
                   // if (userId) {
                        if (view == 'mentions') {

                            console.log("========== ========= SSR CHECKPOINT 31:", new Date().getTime() - t1, "ms");

                            // const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`);

                            //  console.log("========== ========= SSR CHECKPOINT 32:", new Date().getTime() - t1, "ms");

                            calls.push({ key: keyMentions, call: ssrDataMentions(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`) });
                        }
                    /*}
                    else {
                        if (view == 'mentions') {
                            //  const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`);
                            //fetchMentions = dataMentions.mentions;
                            calls.push({ key: keyMentions, call: ssrDataMentions(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`) });

                        }
                    }*/
                }
                else {
                    //  console.log(4444);
                    // REFACTOR 1/25/2024
                    // Fetch stories instead of mentions for the top level (leagues or all)

                    if (userId) {
                        //console.log(5555);
                        if (view == 'mentions') {

                            console.log("========== ========= SSR CHECKPOINT 131:", new Date().getTime() - t1, "ms");

                            // const { data: dataStories } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&page=0&league=${league}`);

                            //console.log("========== ========= SSR CHECKPOINT 132:", new Date().getTime() - t1, "ms");

                            // fetchStories = dataStories.stories;
                            calls.push({ key: keyStories, call: ssrDataStories(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`) });

                        }
                    }
                    else {
                        if (view == 'mentions') {
                            //console.log(6666)
                            console.log("========== ========= SSR CHECKPOINT 332:", new Date().getTime() - t1, "ms");

                            //const { data: dataStories } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&page=0&league=${league}`);
                            //fetchStories = dataStories.stories;
                            //console.log("========== ========= SSR CHECKPOINT 333:", new Date().getTime() - t1, "ms");
                            calls.push({ key: keyStories, call: ssrDataStories(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&page=0&league=${league}`) });

                            // console.log(7777)
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
                // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`);
                // favorites = data.favorites;
                calls.push({ key: unstable_serialize(favoritesKey), call: ssrDataFavorites(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`) });
                console.log("FAVORITES:========================>", `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`, favorites);
            }

            let fallback = {
                [unstable_serialize(keyLeagueTeams)]: leagueTeams,
            };

            // fallback[unstable_serialize(keyTeamPlayers)] = teamPlayers;
            //fallback[unstable_serialize(keyDetails)] = details;
            //fallback[unstable_serialize(favoritesKey)] = favorites;
            // fallback[unstable_serialize({ type: "options", noUser: userId ? false : true })] = options;
            // fallback[unstable_serialize(trackerListMembersKey)] = trackerListMembers;
            // fallback[unstable_serialize(getAMentionKey)] = amention;
            // console.log("fallback:",getASlugStoryKey,astory)
            //fallback[unstable_serialize(getASlugStoryKey)] = astory;
            //  fallback[unstable_serialize(metalinkKey)] = metaLink;

            /* fallback[us(page => {
                 const keyFetchedMentions: FetchedMentionsKey = { type: "FetchedMentions", teamid: team || "", name: player || "", noUser: userId ? false : true, page: page, league: league || "", myteam: tab == 'myteam' ? 1 : 0, noLoad: view != 'mentions' && tab != 'fav' }
                 // console.log("FETCHED MENTIONS KEY:", keyFetchedMentions);
                 return keyFetchedMentions;
             }
             )] = fetchMentions;*/
            /*fallback[us(page => {
                const keyFetchedStories: FetchedStoriesKey = { type: "FetchedStories", noUser: userId ? false : true, page: page, league: league || "", noLoad: (view != 'mentions' && tab != 'fav') || team != '' }
                // console.log("FETCHED Stories KEY:", keyFetchedStories);
                return keyFetchedStories;
            }
            )] = fetchStories;*/
            // console.log("fetchedMentions:", fetchMentions)
            await fetchData(t1,fallback,calls);
            console.log("========== ========= SSR TIME:", new Date().getTime() - t1, "ms");
            if (!botInfo.bot) {
                try {
                    console.log("RECORD EVENT:", `ssr-pub${fresh ? '-init' : ''}`, `{"fbclid":"${fbclid}","ua":"${ua}","story":"${story}","findexarxid":"${findexarxid}","isMobile":"${isMobile}","utm_content":"${utm_content}","t1":"${t1}","userId":"${userId || ""}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`);
                    // await recordEvent(sessionid, `ssr-pub${fresh ? '-init' : ''}`, `{"fbclid":"${fbclid}","ua":"${ua}","story":"${story}","findexarxid":"${findexarxid}","isMobile":"${isMobile}","utm_content":"${utm_content}","t1":"${t1}","userId":"${userId || ""}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`);

                    const name = `ssr-pub${fresh ? '-init' : ''}`;
                    const params = `{"fbclid":"${fbclid}","ua":"${ua}","story":"${story}","findexarxid":"${findexarxid}","isMobile":"${isMobile}","utm_content":"${utm_content}","t1":"${t1}","userId":"${userId || ""}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`;
                    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
                    console.log("api url", url);
                    const ret = await fetch(url);

                } catch (x) {

                    console.log('ssr-landing-init-error', x);
                }
            }
            if (botInfo.bot) {
                try {
                    //await recordEvent(sessionid, 'ssr-bot-pub', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`);
                    const name = 'ssr-bot-pub';
                    const params = `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`;
                    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
                    console.log("api url", url);
                    const ret = await fetch(url);

                } catch (x) {
                    console.log('ssr-bot-landing-init-error', x);
                }
            }
            /* try {
                 await recordEvent(sessionid, `ssr-auth`,`userId":"${userId||""}"`);
             } catch (x) {
                 console.log('ssr-landing-init-error', x);
             }*/
            return {
                props: {
                    tracker_filter,
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
                    userId: userId || "",
                    createdAt: createdAt || "",
                    freeUser,
                    list,
                    t1,
                    tab,
                    findexarxid,
                    teamName,
                    slug: story,

                }
            }
        } catch (x) {
            console.log("FETCH SSR PROPS ERROR", x);
            context.res.statusCode = 503;
            return {
                props: { error: 503 }
            }
        }

    })

//export default ssr;
export default getServerSideProps;