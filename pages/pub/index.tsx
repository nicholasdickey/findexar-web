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
    t1: number;
}
export default function Home(props: Props) {
    const fallback = props.fallback;
    return <SWRConfig value={{ fallback }}><SinglePage  {...props} /></SWRConfig>
}
/*
export async function getStaticProps() {
    const t1=Date.now();
    const res = await fetch('https://api.vercel.app/blog');
    const posts = await res.json();
    const { data: dataMentions } = await axios.get(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/user/fetch-mentions?api_key=${api_key}&userid=&teamid=&name=&page=0&league=&myteam=0`);
    const fetchMentions = dataMentions.mentions;
    const keyLeagueTeams: LeagueTeamsKey = { func: "leagueTeams", league:"" };
    let leagueTeams = ["NFL","NHL","MLB","NBA"];
    let fallback = {
        [unstable_serialize(keyLeagueTeams)]: leagueTeams,
    };
    fallback[us(page => {
        const keyFetchedMentions: FetchedMentionsKey = { type: "FetchedMentions", teamid: "", name: "", noUser: true, page: 0, league:  "", myteam:  0,noLoad: false }
        console.log("STATIC FETCHED MENTIONS KEY:", keyFetchedMentions);
        return keyFetchedMentions;
    }
    )] = fetchMentions;
    console.log("ISR!!!");    
    return {
      props: {
        leagues: ["NFL","NHL","MLB","NBA"],
        fallback,
        view:"mentions",
        t1
      },
      revalidate: 60,
    };
  }
  */
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        return await ssr(context);
    }
