import * as React from 'react';
import { SWRConfig, unstable_serialize } from 'swr'
import { unstable_serialize as us } from 'swr/infinite';
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
    MentionsKey, getMentions, TrackerListMembersKey, FavoritesKey, FetchedMentionsKey
} from '@/lib/api'
import ssr from '@/lib/ssr';
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
    t1:number;
    tab:string;
    mode:string;
}
export default function Home(props: Props) {
    const fallback = props.fallback;
    return <SWRConfig value={{ fallback }}><SinglePage  {...props} /></SWRConfig>
}
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    return await ssr(context);
    }
