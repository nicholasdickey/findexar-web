import React, { use, useCallback, useEffect, useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'

import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";

import { styled} from "styled-components";

import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';

import { LeagueTeamsKey, getLeagueTeams, recordEvent, setCookie, AMentionKey, getAMention } from '@/lib/api';
import { useAppContext } from '@/lib/context';


const WelcomeWrap = styled.div`
    padding-top:18px;
    padding-right:40px;
    //font-size:13px;
    a{
      text-decoration: none;
      &:hover{
        color:var(--highlight);
      }
    }
`;
const Favorites = styled.div`
    margin-top:28px;
    margin-left:22px;
    width:100%;
    height:40px;
    font-size:12px;
    a{
        text-decoration: none;
        &:hover{
          color: var(--highlight);
        }
    }
`;
const LeftText = styled.div`
    padding-top:28px;
    padding-right:20px;
    line-height:1.5;
    //font-size:12px;
    a{
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
    }
`;

interface Props {
}
const Welcome:React.FC<Props>= () => {
    const router = useRouter();
    const { view,params2,tp2,noUser,mode, userId, isMobile, setLeague, setView, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName,setTeamName } = useAppContext();
    
   
        return <> <WelcomeWrap>
        Welcome to Findexar!<br /><hr />
        {false&&<span><em>That&apos;s the ticket!</em> <br/><br/><br/></span>}
        The indispensable Fantasy Sports<br />
         digest and real-time, annotated <br />
        media index.<br /><br />
        Finding and indexing <br />
        mentions of pro athletes<br />
        in the media.<br /><br /><hr />
        Powered by OpenAI.</WelcomeWrap>
        <br /><br />
        <Favorites><Button disabled={view == 'fav'} onClick={() => {
          if (view != 'readme') {
            setView("readme")
            router.push(`/pub?view=readme${params2}${tp2.replace('?', '&')}`);
          }
          else {
            setView("mentions")
            router.push(`/pub${params}${tp2.replace('?', '&')}`);
          }
        }} style={{ padding: 10 }} variant="outlined">{view == "readme" ? <HomeIcon /> : <HelpOutlineIcon />}&nbsp;&nbsp;{view == "readme" ? <span>Back to Home</span> : <span>Read Me</span>}</Button></Favorites>
        <br /><br />
        <LeftText><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in Minnesota. L&apos;Étoile du Nord.</LeftText>
        {noUser && <LeftText>Click here to sign-in or sign-up: <br /><br /><br /><SignInButton><Button style={{ padding: 10 }} size="small" variant="outlined"><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></LeftText>}
        <LeftText><hr />Contact: @findexar on X (Twitter)</LeftText>
        <LeftText><br />League News Digests on X (Twitter):</LeftText>
        <LeftText><Link href="https://twitter.com/nflpress_digest">NFL Digest</Link></LeftText>
        <LeftText><Link href="https://twitter.com/nhl_digest">NHL Digest</Link></LeftText>
        <LeftText><Link href="https://twitter.com/mlbpressdigest">MLB Digest</Link></LeftText>
        <LeftText><Link href="https://twitter.com/nba_digest">NBA Digest</Link></LeftText>
        <LeftText><Link href="https://twitter.com/mls_digest">MLS Digest</Link></LeftText>
      </>
  
}
export default Welcome;