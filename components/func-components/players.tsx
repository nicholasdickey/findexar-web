import React, { use, useCallback, useEffect, useState } from "react";
import Link from 'next/link'
import useSWR from 'swr';
import { UserButton, SignInButton, SignedOut, SignedIn, RedirectToSignIn } from "@clerk/nextjs";

import { styled ,useTheme} from "styled-components";

import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import { TeamPlayersKey, getTeamPlayers, recordEvent, RemoveTrackerListMemberParams, removeTrackerListMember, AddTrackerListMemberParams, addTrackerListMember } from '@/lib/api';
import { useAppContext } from '@/lib/context';

declare global {
    interface Window {
        Clerk: any;
    }
}

const SidePlayer = styled.div<SideProps>`
    //height: 40px;
    //width: 200px; 
   // color: #eee;
    //text-align: center;
    color:${props => props.highlight ? 'var(--myteam)' : 'var(--text)'};
    font-size: 16px;
    padding-left:20px;
    &:hover{
        color:var(--highlight);
      }
  
    margin: 10px;
    a{
      color:${props => props.highlight ? 'var(--myteam)' : 'var(--text)'} !important;//#ff8 !important;
      text-decoration: none;
      background-color:${props => props.highlight ? 'var(--myteam-bg)' : 'var(--background)'} !important;
      &:hover{
        color:var(--highlight) !important;
      }
    }
`;

const TeamName = styled.div`
    height: 30px;
    width: 100%; 
   // color: #aea;
    //text-align: center;
    //padding-left:20px;
    font-size: 20px;
    //margin: 10px;
    padding-top:2px;
    padding-bottom:35px;
  `;

const MobileTeamName = styled.div`
    height: 40px;
    color:var(--text); 
   // color: #aea;
    text-align: center;
    font-size: 20px;
    //margin: 10px;
    //padding-left:20px;
    padding-top:12px;
    padding-bottom:35px;
`;

const SideGroup = styled.div`
    display:flex;
   // width:280px;
   width: 260px;
    flex-direction:row;
    justify-content:space-between;
    padding-right:20px;
    align-items:center;
    border-left: 1px solid #aaa;
  
`;

interface SideProps {
    highlight?: boolean;
}
const SideIcon = styled.div<SideProps>`
   // margin-top:-8px;
    //color:#aaa;
    width:20px;
    height:20px;
    color:${props => props.highlight ? 'var(--selected))' : 'var(--link)'};
  
  `;
const SideButton = styled.div`
    //margin-top:-8px;
    width:40px;
   //color:#aaa;
  
  `;
const SelectedSidePlayer = styled.div<SideProps>`
   // height: 40px;
   // width: 200px;
   // color:var(--selected);// #ff8;
   color:${props => props.highlight ? 'var(--selected)' : 'var(--selected)'};
   // text-align: center;
    font-size: 16px;
    padding-left:20px;
    margin: 10px;
    a{
      color:${props => props.highlight ? 'var(--selected)' : 'var(--selected)'} !important;//#ff8 !important;
      text-decoration: none;
      background-color:${props => props.highlight ? 'var(--myteam-bg)' : 'var(--background)'} !important;
      &:hover{
        color:var(--highlight);
      }
    }
  `;

const SideLeagueName = styled.div`
    height: 40px;
    width: 200px; 
    color:var(--text);
    font-size: 20px;
`;
const SideTeam = styled.div`
    height: 20px;
    //margin-top:5px;
   //font-size: 16px;
    padding-left:20px;
    border-left: 1px solid #aaa;
    padding-bottom:20px;
    @media screen and (min-width: 1600px) {
      //font-size: 18px;
    }
`;

const SelectedSideTeam = styled.div`
    height: 20px;
    color:var(--selected);
    font-size: 16px;
    padding-left:20px;
    border-left: 1px solid #aaa;
    a{
        color:var(--selected) !important;
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
    }
`;

const MobilePlayersPanel = styled.div`
  height:100%;
 // background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-left:20px;
  //font-family: roboto;
  a{
    color:var(--text); // #eee;
    text-decoration: none;
    &:hover{
      color: var(--highlight);//#4f8;
    }
  }
`;

interface Props {
}
const Players: React.FC<Props> = () => {
    const [signin, setSignin] = React.useState(false);

    const { userId, isMobile, setLeague, setView, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName, setTeamName } = useAppContext();

    const teamPlayersKey: TeamPlayersKey = { type: 'teamPlayers', league: league || "", teamid: team || "" };
    const { data: players, error, isLoading, mutate: mutatePlayers } = useSWR(teamPlayersKey, getTeamPlayers);

    const theme = useTheme();
    //@ts-ignore
    const mode = theme.palette.mode;
    const palette = theme[mode].colors;

    const onPlayerNav = async (name: string) => {
        console.log("onPlayerNav", name)
        setPagetype("player");
        setPlayer(name);
        setView("mentions");
        //setGlobalLoading(true);
        await recordEvent(sessionid as string || "",
            'player-nav',
            `{"params":"${params}","player":"${name}"}`
        );
    }

    const PlayersNav = players && players?.map((p: { name: string, findex: string, mentions: string, tracked: boolean }, i: number) => {
        return <SideGroup key={`ewfggvfn-${i}`}>{p.name == player ?
            <SelectedSidePlayer highlight={p.tracked}>
                <Link onClick={async () => { await onPlayerNav(p.name) }} href={`/pub/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}${params}${tp}`} shallow>
                    {p.name} ({`${p.mentions}`})
                </Link>
            </SelectedSidePlayer>
            :
            <SidePlayer highlight={p.tracked}>
                <Link onClick={async () => { await onPlayerNav(p.name) }} href={`/pub/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}${params}${tp}`} shallow>
                    {p.name} ({`${p.mentions || 0}`})
                </Link>
            </SidePlayer>}
            <SideButton>
                <IconButton
                    onClick={async () => {
                        setPlayer(p.name);

                        if (window && window.Clerk) {
                            const Clerk = window.Clerk;
                            const user = Clerk.user;
                            const id = Clerk.user?.id;
                            if (!id) {
                                setSignin(true);
                                return;
                            }
                        }

                        if (p.tracked == true) {
                            console.log("TRACKED", p.name)
                            const removeTrackerListMemberParams: RemoveTrackerListMemberParams = { member: p.name, teamid: team || "" };

                            //to copilot: find in players the item with name p.name and set tracked to true.
                            mutatePlayers((players: any) => {
                                return players.map((player: any) => {
                                    if (player.name == p.name) {
                                        player.tracked = false;
                                    }
                                    return player;
                                })
                            }, false);
                            await removeTrackerListMember(removeTrackerListMemberParams);
                        }
                        else {
                            const addTrackerListMemberParams: AddTrackerListMemberParams = { member: p.name, teamid: team || "" };
                            mutatePlayers((players: any) => {
                                return players.map((player: any) => {
                                    if (player.name == p.name) {
                                        player.tracked = true;
                                    }
                                    return player;
                                })
                            }, false);
                            console.log("after mutatePlayers");
                            await addTrackerListMember(addTrackerListMemberParams);
                        }
                    }} size="large" aria-label="Add new list">
                    <SideIcon highlight={p.tracked}>
                        {p.tracked ? <PlaylistRemoveIcon sx={{ color: palette.selected }} /> : <PlaylistAddIcon />}
                        {signin && <RedirectToSignIn />}
                    </SideIcon>
                </IconButton>
            </SideButton>
        </SideGroup>
    });
    return (<>
        {!isMobile?<>
            <TeamName>{teamName}:</TeamName>
            {PlayersNav}
        </>:
        <MobilePlayersPanel>
        <MobileTeamName>{teamName}</MobileTeamName>
        {PlayersNav}
      </MobilePlayersPanel>}
      </>
    );
}
export default Players;