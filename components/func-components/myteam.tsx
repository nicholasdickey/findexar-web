import React, { use, useCallback, useEffect, useState } from "react";
import Link from 'next/link'
import useSWR from 'swr';
import { SignInButton, SignedOut, SignedIn, RedirectToSignIn } from "@clerk/nextjs";

import { styled, useTheme } from "styled-components";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LoginIcon from '@mui/icons-material/Login';

import { TrackerListMembersKey, getTrackerListMembers, recordEvent, RemoveTrackerListMemberParams, removeTrackerListMember, AddTrackerListMemberParams, addTrackerListMember } from '@/lib/api';
import { useAppContext } from '@/lib/context';

declare global {
    interface Window {
        Clerk: any;
    }
}

const SidePlayer = styled.div<SideProps>`
    color:${props => props.highlight ? 'var(--myteam)' : 'var(--text)'};
    font-size: 14px;
    padding-left:20px;
    &:hover{
        color:var(--highlight);
    }
    margin: 4px;
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
    width:20px;
    height:20px;
    color:${props => props.highlight ? 'var(--selected))' : 'var(--link)'};  
`;
const SideButton = styled.div`
    width:40px;
`;

const RightExplanation = styled.div`
    width: 270px; 
    line-height:1.5;
    font-size: 14px;
    margin-bottom:10px;
`;
const MobileRightExplanation = styled.div`
    max-width: 280px; 
    line-height:1.5;
    font-size: 14px;
    margin-bottom:10px;
    padding-right:20px;
`;
const MobilePlayersPanel = styled.div`
    height:100%;
    width:100%;
    min-height:180vw;
    color:var(--text);
    display:flex;
    padding-left:20px;
    padding-top:10px;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start; 
    a{
        color:var(--text);
        text-decoration: none;
        &:hover{
        color: var(--highlight);
        }
    }
    @media screen and (min-width: 1200px) {
            display: none;
    }
`;

const MobileSideGroup = styled.div`
    display:flex;
    width: 260px;
    margin-left:20px;
    height:40px;
    flex-direction:row;
    justify-content:space-around;
    align-items:center;
    padding-left:20px;
    padding-right:20px;
    border-left: 1px solid #aaa;
`;

const MobileSidePlayer = styled.div`
    width:240px; 
    font-size: 16px;
`;

const RightScroll = styled.div`
    position:sticky;
    height:auto !important;
    top:-110px;
    overflow-y: hidden;
`;
interface Props {
}
const MyTeam: React.FC<Props> = () => {
    const { userId, isMobile, noUser, setLeague, setView, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName, setTeamName } = useAppContext();

    const trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser, noLoad: false };
    const { data: trackerListMembers, error: trackerListError, isLoading: trackerListLoading, mutate: trackerListMutate } = useSWR(trackerListMembersKey, getTrackerListMembers);

    const theme = useTheme();
    //@ts-ignore
    const mode = theme.palette.mode;
    const palette = theme[mode].colors;
    return (
        <>{!isMobile ? <RightScroll>
            <TeamName>My Team{league ? ` for ${league}` : ``}: </TeamName>
            {(!trackerListMembers || trackerListMembers.length == 0) && <><RightExplanation>
                <b>My Team</b> is a premium feature designed for Fantasy Sports fans who need to track media
                mentions of the selected athletes.<br /><br />
                The functionality to track and annotate mentions is powered by OpenAI (ChatGPT). We have to pay to provide the service and
                have no choice but to pass the costs to the users. You can create an account and try the feature for free for a week before you will be nagged to subscribe.
                <br /><br />Imaging the power of getting a feed of your athletes mentions across the media! No need to spend hours hunting and searching.
                <hr />
            </RightExplanation>
                <RightExplanation>Use  &nbsp;<PlaylistAddIcon sx={{/* color: "#aea" */ }} />&nbsp;  icon to the right of the<br /> player&apos;s name in the team roster<br />(click on the league and the team name)<br />to add to &ldquo;My Team&ldquo; tracking list.<br /><br /><SignedOut>Note, My Team featue requires the user to be signed into their Findexar account.<br /><br /><SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></SignedOut>
                    <br /><br />To view the My Team&apos;s mentions feed<br /> go to Home <HomeIcon /> or select a League. Then select a &ldquo;My Feed&ldquo; tab.
                </RightExplanation></>}
            {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
                return <SideGroup key={`3fdsdvb-${i}`}>
                    <SidePlayer>
                        <Link onClick={() => { setPlayer(member); setView("mentions"); }} href={`/pub/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}`}>
                            {member}
                        </Link>
                    </SidePlayer>
                    <SideButton>
                        <IconButton
                            onClick={async () => {
                                const removeTrackerListMemberParams: RemoveTrackerListMemberParams = { member, teamid: teamid || "" };
                                const newTrackerListMembers = trackerListMembers.filter((p: any) => p.member != member);
                                trackerListMutate(newTrackerListMembers, false);
                                await removeTrackerListMember(removeTrackerListMemberParams);
                            }} size="large" aria-label="Add new list">
                            <SideIcon>
                                <PlaylistRemoveIcon sx={{ color: palette.selected }} />
                            </SideIcon>
                        </IconButton>
                    </SideButton>
                </SideGroup>
            })}
        </RightScroll> :
            <MobilePlayersPanel>
                <MobileTeamName>My Team: </MobileTeamName>
                {(!trackerListMembers || trackerListMembers.length == 0) &&
                    <><MobileRightExplanation>
                        <b>My Team</b> is a premium feature designed for Fantasy Sports fans who need to track media
                        mentions of the selected athletes.<br /><br />
                        The functionality to track and annotate mentions is powered by OpenAI (ChatGPT). We have to pay to provide the service and
                        have no choice but to pass the costs to the users. You can create an account and try the feature for free for a week before you will be nagged to subscribe.
                        <br /><br />Imaging the power of getting a feed of your athletes mentions across the media! No need to spend hours hunting and searching.
                        <hr />
                    </MobileRightExplanation>
                        <MobileRightExplanation>Use  &nbsp;<PlaylistAddIcon />&nbsp;  icon to the right of the player&apos;s name in the team roster (&ldquo;players&ldquo; tab) to add to &ldquo;My Team&ldquo; tracking list.<br /><br /><SignedOut>Note, My Team featue requires the user to be signed into their Findexar account.<br /><br /><SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></SignedOut>
                            <br /><br />To view My Team&apos;s mentions feed go to <br />Home <HomeIcon /> or select a League. Then select a &ldquo;My Feed&ldquo; tab.
                        </MobileRightExplanation></>}
                {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
                    return <MobileSideGroup key={`3fdsdvb-${i}`}>
                        <MobileSidePlayer>
                            <Link onClick={() => { setPlayer(member); setView("mentions"); }} href={`/pub/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}${params}`}>
                                {member}
                            </Link>
                        </MobileSidePlayer>
                        <SideButton>
                            <IconButton
                                onClick={async () => {
                                    console.log("TRACKED", member)
                                    const removeTrackerListMemberParams: RemoveTrackerListMemberParams = { member, teamid: teamid || "" };
                                    const newTrackerListMembers = trackerListMembers.filter((p: any) => p.member != member);
                                    trackerListMutate(newTrackerListMembers, false);
                                    await removeTrackerListMember(removeTrackerListMemberParams);
                                }} size="large" aria-label="Add new list">
                                <SideIcon>
                                    <PlaylistRemoveIcon sx={{ color: "var(--selected)" }} />
                                </SideIcon>
                            </IconButton>
                        </SideButton>
                    </MobileSideGroup>
                })}
            </MobilePlayersPanel>}
        </>
    );
}

export default MyTeam;