import * as React from 'react';
import { SWRConfig, unstable_serialize } from 'swr'
//import { withSessionSsr, Options } from '../lib/with-session';
import { isbot } from '../../lib/isbot.js';
import SinglePage from '../../components/single-page';
import {
    GetServerSidePropsContext,
} from "next";
//import { DocumentHeadTags, DocumentHeadTagsProps, documentGetInitialProps } from '@mui/material-nextjs/v14-pagesRouter';


import { /*fetchSession,updateSession,*/ recordEvent, getLeagues, 
LeagueTeamsKey, getLeagueTeams, TeamPlayersKey, getTeamPlayers, DetailsKey, getDetails,
MentionsKey,getMentions } from '../../lib/api'

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
}
export default function Home(props: Props) {
    const fallback = props.fallback;
   // delete props.fallback;
    return <SWRConfig value={{ fallback }}><SinglePage  {...props} /></SWRConfig>
}
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            let { fbclid, utm_content, dark }:
                { fbclid: string, utm_content: string, dark: number } = context.query as any;


            let pagetype="league";
            console.log("IRON_PASSWORD:", process.env.IRON_PASSWORD);
            utm_content = utm_content || '';
        
            fbclid = fbclid || '';
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });

            let host = context.req.headers.host || "";

            let ssr = context.params?.ssr as string[];

            if (!ssr)
                ssr = [''];
            let [arg1, arg2, arg3, arg4, arg5, arg6] = ssr;
            let league = '';
            let team = '';//'buffalo-bills';
            let player = '';
            league = arg1;
            if (arg2 == 'team') {
                team = arg3;
                pagetype="team";
                if (arg4 == 'player') {
                    player = arg5;
                    pagetype="player";
                }
            }
            else if (arg2 == 'player') {
                player = arg3;
            }
           // console.log("SSR TEAM:",team,arg1,arg2,arg3,arg4,arg5,arg6)

            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // let sessionid = context.req.session?.sessionid || randomstring();
            // const fresh = !context.req.session.sessionid;
            const sessionid = randomstring();
            if (!botInfo.bot) {
                console.log('ssr-landing-init');
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
            /*      if (fresh || context.req.session.sessionid != sessionid) {
                      context.req.session.sessionid = sessionid;
      
                      await context.req.session.save();
                  }*/

            const leagues = await getLeagues();
            const keyLeagueTeams: LeagueTeamsKey = { func:"leagueTeams",league };
            let leagueTeams = await getLeagueTeams(keyLeagueTeams);
           // console.log("GOT leagueTeams",team,player,leagueTeams)
            let teamPlayers;
            let details;
            let keyTeamPlayers: TeamPlayersKey;
            let keyDetails: DetailsKey={teamid:"",name:""};
            let keyMentions:MentionsKey={func:"mentions",league};
            let mentions = [];
            if (team) {
                const t=leagueTeams?.find((t:any)=>t.id==team);
                console.log("finding team to match t.id",t.id,team)
                const teamName=t.name;    
                keyTeamPlayers = { league, teamid: team };
                teamPlayers = await getTeamPlayers(keyTeamPlayers);
                console.log("player:",player)
              //  console.log("teamPlayers=",keyTeamPlayers,teamPlayers) 
                if (player) {
                    keyDetails = { teamid: team, name: player };
                    details = await getDetails(keyDetails);
                    //console.log("go details",keyDetails,details)
                }
                else {
                    keyDetails= { teamid: team, name: teamName };
                    details = await getDetails(keyDetails);
                }   
            }
            else {
                mentions=await getMentions(keyMentions);
               // console.log("GOT MENTIONS",keyMentions,mentions)
            }
            let fallback={   
                [unstable_serialize(keyLeagueTeams)]: leagueTeams,
               
            };
            
            if(teamPlayers)
                fallback[unstable_serialize(teamPlayers)]= teamPlayers;
            if(details&&keyDetails) 
                fallback[unstable_serialize(keyDetails)]= details;  
            if(mentions&&mentions.length>0)
                fallback[unstable_serialize(keyMentions)]= mentions;       
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
                    fallback
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
