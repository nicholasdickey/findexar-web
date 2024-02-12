import React, { use, useCallback, useEffect, useState } from "react";
import Link from 'next/link'
import useSWR from 'swr';
import { UserButton, SignInButton, SignedOut, SignedIn, RedirectToSignIn } from "@clerk/nextjs";
import { styled, useTheme } from "styled-components";
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
    color:${props => props.highlight ? 'var(--myteam)' : 'var(--text)'};
    padding-left:20px;
    width: 100%;
    &:hover{
        color:var(--highlight);
    }  
    margin: 4px;
    a{
        color:${props => props.highlight ? 'var(--myteam)' : 'var(--text)'} !important;
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
    font-size: 20px;
    padding-top:2px;
    padding-bottom:35px;
`;

const MobileTeamName = styled.div`
    height: 40px;
    color:var(--text); 
    text-align: center;
    font-size: 20px;
    padding-top:12px;
    padding-bottom:35px;
`;

const SideGroup = styled.div`
    display:flex;
    width: 300px;
    height:30px;
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
    width:20px;
    height:30px;
    color:${props => props.highlight ? 'var(--selected))' : 'var(--link)'};  
`;

const SideButton = styled.div`
    width:40px;
`;

const SelectedSidePlayer = styled.div<SideProps>`
    color:${props => props.highlight ? 'var(--selected)' : 'var(--selected)'};
    padding-left:20px;
    width: 100%;
    margin: 4px;
    a{
        color:${props => props.highlight ? 'var(--selected)' : 'var(--selected)'} !important;//#ff8 !important;
        text-decoration: none;
        background-color:${props => props.highlight ? 'var(--myteam-bg)' : 'var(--background)'} !important;
        &:hover{
            color:var(--highlight);
        }
    }
`;

const MobilePlayersPanel = styled.div`
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start; 
    padding-left:20px;
    a{
        color:var(--text); // #eee;
        text-decoration: none;
        &:hover{
        color: var(--highlight);//#4f8;
        }
    }
`;
interface ScrollProps {
    numPlayers: number;
}
const RightScroll = styled.div<ScrollProps>`
    position:sticky;
    height:auto !important;
    top:-${({ numPlayers }) => numPlayers > 60 ? numPlayers * numPlayers * 0.30 : numPlayers * numPlayers *0.30}px;
    overflow-y: hidden;
    padding-bottom:20px;
    width:100%;
`;
interface Props {
}
const Players: React.FC<Props> = () => {
    const [signin, setSignin] = React.useState(false);
    const { userId, isMobile, setLeague, setView, setTab, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName, setTeamName } = useAppContext();
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
        setTab("all");
        await recordEvent(sessionid as string || "",
            'player-nav',
            `{"params":"${params}","player":"${name}"}`
        );
    }

    const PlayersNav = players && players?.map((p: { name: string, findex: string, mentions: string, tracked: boolean }, i: number) => {
        return <SideGroup key={`ewfggvfn-${i}`}>{p.name == player ?
            <SelectedSidePlayer highlight={p.tracked}>
                <Link onClick={async () => { await onPlayerNav(p.name) }} href={`/pub/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}${params}`} shallow>
                    {p.name} ({`${p.mentions?p.mentions:0}`})
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
        {!isMobile ?
            <RightScroll numPlayers={players?.length}>
                <TeamName>{teamName}:</TeamName>
                {PlayersNav}
            </RightScroll>
            :
            <MobilePlayersPanel>
                <MobileTeamName>{teamName}</MobileTeamName>
                {PlayersNav}
            </MobilePlayersPanel>
        }
    </>
    );
}

export default Players;