import { unstable_serialize } from 'swr'
import { unstable_serialize as us } from 'swr/infinite';
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
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
async function fetchData(t1: any, fallback: any, calls: { key: any, call: Promise<any> }[]) {
    const promises = calls.map(call => call.call);
    try {
        console.log("========== ========= SSR CHECKPOINT 119:", new Date().getTime() - t1, "ms");

        const responses = await Promise.all(promises);
        console.log("========== ========= SSR CHECKPOINT 120:", new Date().getTime() - t1, "ms");
        for (let i = 0; i < calls.length; i++) {
            fallback[calls[i].key] = responses[i];
            console.log(`========== ========= SSR CHECKPOINT 12${i}:`, new Date().getTime() - t1, "ms");
        }

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
                const fetchResponse = await fetch(url);
                const dataMentions = await fetchResponse.json();
                return dataMentions.mentions;
            }
            const ssrDataStories = async (url: string) => {
                const fetchResponse = await fetch(url);
                const dataStories = await fetchResponse.json();
                return dataStories.stories;
            }
            const ssrDataFavorites = async (url: string) => {
                const fetchResponse = await fetch(url);
                const dataFavorites = await fetchResponse.json();
                return dataFavorites.favorites;
            }
            const ssrDataTrackListMembers = async (url: string) => {
                const fetchResponse = await fetch(url);
                const dataTrackListMembers = await fetchResponse.json();
                return dataTrackListMembers.members;
            }
            view = view.toLowerCase();
            if (view == 'feed')
                view = 'mentions';
            console.log("VIEW:", view)
            if (view == 'home')
                view = 'mentions';

            const createdAt = user?.createdAt;
            let freeUser = false;
            let fresh = false;
            let tracker_filter = 0;
            if (userId && user?.emailAddresses) {
                for (let i = 0; i < user.emailAddresses.length; i++) {
                    const e = user.emailAddresses[i];
                    const email = e.emailAddress;
                    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/options/get?userid=${userId || ""}&api_key=${api_key}&email=${email}`);
                    const data = await fetchResponse.json();
                    console.log("========== ========= SSR CHECKPOINT 1:", new Date().getTime() - t1, "ms");

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
            //let host = context.req.headers.host || "";
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
            console.log("========== ========= SSR CHECKPOINT 2:", new Date().getTime() - t1, "ms");

            let trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser: userId ? false : true, noLoad: pagetype != 'league' };


            if (userId && pagetype == 'league') {
                calls.push({ key: unstable_serialize(trackerListMembersKey), call: ssrDataTrackListMembers(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/tracker-list/get?api_key=${api_key}&userid=${userId || ""}&league=${league}`) });
            }

            console.log("========== ========= SSR CHECKPOINT 21:", new Date().getTime() - t1, "ms");

            const leagues = await getLeagues();
            const keyLeagueTeams: LeagueTeamsKey = { func: "leagueTeams", league, noLoad: pagetype == "landing" };
            let leagueTeams = await getLeagueTeams(keyLeagueTeams);
            let keyTeamPlayers: TeamPlayersKey = { type: "teamPlayers", league, teamid: "" };
            let keyMentions = us(page => {
                const keyFetchedMentions: FetchedMentionsKey = { type: "FetchedMentions", teamid: team || "", name: player || "", noUser: userId ? false : true, page: page, league: league || "", myteam: tab == 'myteam' ? 1 : 0, noLoad: view != 'mentions' && tab != 'fav' }
                return keyFetchedMentions;
            });
            let keyStories = us(page => {
                const keyFetchedStories: FetchedStoriesKey = { type: "FetchedStories", noUser: userId ? false : true, page: page, league: league || "", noLoad: (view != 'mentions' && tab != 'fav') || team != '' }
                return keyFetchedStories;
            });

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
            let astory = null;

            if (story) {
                astory = getASlugStory(getASlugStoryKey);
                calls.push({ key: unstable_serialize(getASlugStoryKey), call: astory });
            }

            console.log("VIEW:", view, "tab:", tab, "team:", team, "player:", player, "league:", league, "userId", userId, "keyMentions:", keyMentions)
            let teamName = '';
            if (team) {
                console.log("in team")
                calls.push({ key: keyMentions, call: ssrDataMentions(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&favorites=0`) });
                const t = leagueTeams?.find((t: any) => t.id == team);
                teamName = t.name;
                keyTeamPlayers = { type: 'teamPlayers', league, teamid: team };
                let teamPlayers = getTeamPlayers(keyTeamPlayers);
                calls.push({ key: unstable_serialize(keyTeamPlayers), call: teamPlayers });
            }
            else {
                if (tab == 'fav' || tab == 'myteam') {
                    if (view == 'mentions') {
                        console.log("========== ========= SSR CHECKPOINT 31:", new Date().getTime() - t1, "ms");
                        calls.push({ key: keyMentions, call: ssrDataMentions(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`) });
                    }
                }
                else {
                    // REFACTOR 1/25/2024
                    // Fetch stories instead of mentions for the top level (leagues or all)

                    if (userId) {
                        if (view == 'mentions') {
                            console.log("========== ========= SSR CHECKPOINT 131:", new Date().getTime() - t1, "ms");
                            calls.push({ key: keyStories, call: ssrDataStories(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=${userId || ""}&teamid=${team}&name=${encodeURIComponent(player as string || "")}&page=0&league=${league}&myteam=${tab == 'myteam' ? 1 : 0}`) });
                        }
                    }
                    else {
                        if (view == 'mentions') {
                            console.log("========== ========= SSR CHECKPOINT 332:", new Date().getTime() - t1, "ms");
                            calls.push({ key: keyStories, call: ssrDataStories(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-stories?api_key=${api_key}&userid=${userId}&page=0&league=${league}`) });
                        }
                    }
                }
            }
            console.log("========== ========= SSR CHECKPOINT 4:", new Date().getTime() - t1, "ms");
            let favoritesKey: FavoritesKey = { type: "Favorites", noUser: userId ? false : true, noLoad: tab != 'fav' };
            let favorites: any[] = [];
            if (tab == 'fav' && userId) {
                calls.push({ key: unstable_serialize(favoritesKey), call: ssrDataFavorites(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`) });
                console.log("FAVORITES:========================>", `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/favorites/get?api_key=${api_key}&userid=${userId}`, favorites);
            }
            let fallback = {
                [unstable_serialize(keyLeagueTeams)]: leagueTeams,
            };
            await fetchData(t1, fallback, calls);
            console.log("========== ========= SSR TIME:", new Date().getTime() - t1, "ms");
            if (!botInfo.bot) {
                try {
                    console.log("RECORD EVENT:", `ssr-pub${fresh ? '-init' : ''}`, `{"fbclid":"${fbclid}","ua":"${ua}","story":"${story}","findexarxid":"${findexarxid}","isMobile":"${isMobile}","utm_content":"${utm_content}","t1":"${t1}","userId":"${userId || ""}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`);
                    const name = `ssr-pub${fresh ? '-init' : ''}`;
                    const params = `{"fbclid":"${fbclid}","ua":"${ua}","story":"${story}","findexarxid":"${findexarxid}","isMobile":"${isMobile}","utm_content":"${utm_content}","t1":"${t1}","userId":"${userId || ""}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`;
                    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
                    fetch(url).then(res => res.json());

                } catch (x) {
                    console.log('ssr-landing-init-error', x);
                }
            }
            if (botInfo.bot) {
                try {
                    const name = 'ssr-bot-pub';
                    const params = `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}","ssrTime":"${new Date().getTime() - t1}","league":"${league}","team":"${team}","player":"${player}"}`;
                    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
                    fetch(url).then(res => res.json());
                } catch (x) {
                    console.log('ssr-bot-landing-init-error', x);
                }
            }

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

export default getServerSideProps;