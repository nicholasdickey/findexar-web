import React, { useEffect } from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { UserButton, SignInButton } from "@clerk/nextjs";
import { styled } from "styled-components";
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoginIcon from '@mui/icons-material/Login';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import IconButton from '@mui/material/IconButton';
import { MentionsKey, getMentions, getFilteredMentions, getOptions, UserOptionsKey, SetTrackerFilterParams, setTrackerFilter, TrackerListMembersKey, getTrackerListMembers, removeTrackerListMember, RemoveTrackerListMemberParams,getFavorites,FavoritesKey } from '@/lib/api';

import Mention from "./mention";

const MentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:100%;
    height:100%;

    font-family: 'Roboto', sans-serif;
   // padding-left:20px;
    padding-right:20px;
    a{
        font-size: 15px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }
    @media screen and (max-width: 1199px) {
    display: none;
  }
`;
const MobileMentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:100%;
    height:100%;
    font-family: 'Roboto', sans-serif;
    align-content:flex-start;
   // padding-left:2px;
   // padding-right:2px;
    a{
        font-size: 18px;
      
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }
    @media screen and (min-width: 1200px) {
    display: none;
  }
`;

const MentionsBody = styled.div`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:flex-start;
    //padding-right:120px;
`;

const MentionsHeader = styled.div`
    padding-top:10px;
    font-size: 18px;
    //width:100%;
    padding-left:20px;
    padding-right:20px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
`;
const OuterContainer = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    width:100%;
    height:100%;
    margin:0px;
    @media screen and (max-width: 1199px) {
        display: none;
  }
`;
const TeamName = styled.div`
  height: 30px;
  width: 100%; 
  color: #aea;
  //text-align: center;
 // padding-left:20px;
  font-size: 20px;
  padding-top:2px;
  padding-bottom:20px;
  //margin: 10px;
`;
const MobileTeamName = styled.div`
  height: 30px;
  //width: 200px; 
  color: #aea;
  //text-align: center;
 // padding-left:20px;
 padding-top:12px;
 margin-bottom:20px;
  font-size: 24px;
  //margin: 10px;
`;


const RightPanel = styled.div`
  height:auto !important;
  height:100%;
  width:300px;
  padding-left:20px;
  min-height: 1000vh;
  background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-top:18px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;

const MobilePlayersPanel = styled.div`
  height:100%;
  width:100%;
  min-height:180vw;
  background-color:  #668;
  display:flex;
  padding-left:20px;
  padding-right:20px;
  padding-top:10px;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
  @media screen and (min-width: 1200px) {
        display: none;
  }
`;
const SideGroup = styled.div`
  display:flex;
  width: 260px;
  height:40px;
  flex-direction:row;
  justify-content:space-between;
  padding-right:20px;
  align-items:center;
 
`;
const MobileSideGroup = styled.div`
  display:flex;
  width: 100%;
  padding-right:120px;
  height:40px;
  flex-direction:row;
  justify-content:space-around;
  padding-right:20px;
  align-items:center;
 
`;
const SideIcon = styled.div`
 // margin-top:-8px;
  color:#aaa;
  width:20px;
  height:40px;

`;
const SideButton = styled.div`
  //margin-top:-8px;
  width:45px;
  color:#aaa;

`;
const MobileSidePlayer = styled.div`
  ///height: 40px;
  width:240px; 
  color: #fff;
  //text-align: center;
  font-size: 16px;
  //margin-top: 10px;
 // margin-bottom:10px;
`;
const SidePlayer = styled.div`
  height: 30px;
  width: 140px; 
  color: #fff;
  //text-align: center;
  font-size: 16px;
  //margin-top: 10px;
 // margin-bottom:10px;
`;
const SelectedSidePlayer = styled.div`
  height: 40px;
  width: 200px;
  color: #ff8;
  text-align: center;
  font-size: 14px;
  margin: 10px;
  a{
    color: #ff8 !important;
    text-decoration: none;
    &:hover{
      color: #F8F;
    }
  }
`;
const Empty = styled.div`
width:100%;
text-align:center;
//color:red;
//background-color:#888;
`;
const RightExplanation = styled.div`
  //height: 30px;
  width: 270px; 
  color: #ccc;
 // text-align: center;
  font-size: 13px;
  margin-top: 20px;
  margin-bottom:10px;
`;

interface Props {
  league: string;
  noUser: boolean;
  setLocalPageType: (pageType: string) => void;
  setLocalPlayer: (player: string) => void;
  view: string;

}

const LeagueMentions: React.FC<Props> = ({ league, noUser, setLocalPageType, setLocalPlayer, view }) => {

  const optionsKey: UserOptionsKey = { type: "options" };
  const { data: options, error: optionsError, isLoading: optionsLoading, mutate: optionsMutate } = useSWR(optionsKey, getOptions);
  const [localTrackerFilter, setLocalTrackerFilter] = React.useState(options.tracker_filter);
  const [globalLoading, setGlobalLoading] = React.useState(false);
  const [v, setV] = React.useState((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
  useEffect(() => {
    if (optionsLoading) return;
    setLocalTrackerFilter(options.tracker_filter);
  }, [optionsLoading, options]);
  useEffect(() => {
    setV((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
  }, [view]);



  const mentionsKey: MentionsKey = { type: localTrackerFilter == 1 ? "filtered-mentions" : "mentions", league };
  console.log("MentionsKey", mentionsKey)
  let { data: mentions, error, isLoading } = useSWR(mentionsKey, localTrackerFilter == 1 ? getFilteredMentions : getMentions);
  const favoritesKey:FavoritesKey={type:"Favorites"};
  const { data: favoritesMentions } = useSWR(favoritesKey, getFavorites);
  console.log("favoritesMentions",favoritesMentions)
  if(view=="fav"){
    mentions=favoritesMentions;
  }
  const trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league };
  const { data: trackerListMembers, error: trackerListError, isLoading: trackerListLoading, mutate: trackerListMutate } = useSWR(trackerListMembersKey, getTrackerListMembers);
  console.log("trackerListMembers", trackerListMembers)
  const Mentions = mentions && mentions.map((m: any, i: number) => {
    const { league, type, team, name, date, url, findex, summary, findexarxid,fav } = m;
    // console.log("XID:",league,name,xid)
    return (<Mention noUser={noUser} mentionType="top" league={league} type={type} team={team} name={name} date={date} url={url} findex={findex} summary={summary} findexarxid={findexarxid} fav={fav} key={`mention${i}`} />)
  });
  //console.log("league-mentions:", { v, mentions, isLoading })
  /* if (isLoading) return (<Stack spacing={1}>
       <Skeleton variant="rounded" animation="pulse" height={160} />
       <Skeleton variant="rounded" animation="pulse" height={80} />
       <Skeleton variant="rounded" animation="pulse" height={120} />
       <Skeleton variant="rounded" animation="pulse" height={160} />
   </Stack>)*/

  return (
    <>
      <OuterContainer>
        <MentionsOuterContainer>
          {view!="fav"&&<MentionsHeader><span>Latest Mentions:</span><FormControlLabel control={<Checkbox size="small" disabled={noUser} checked={localTrackerFilter == 1} onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalTrackerFilter(event.target.checked);
              const params: SetTrackerFilterParams = { tracker_filter: event.target.checked ? 1 : 0 };
              setTrackerFilter(params);

            }} />} label="My Team Filter" />
            {noUser && <SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
          </MentionsHeader>}
          {view=="fav"&&<MentionsHeader><span>Favorites:</span></MentionsHeader>}
          <MentionsBody>
            {mentions && mentions.length > 0 ? Mentions : isLoading ? <Stack spacing={1}>
              <Skeleton variant="rounded" animation="pulse" height={160} />
              <Skeleton variant="rounded" animation="pulse" height={80} />
              <Skeleton variant="rounded" animation="pulse" height={120} />
              <Skeleton variant="rounded" animation="pulse" height={160} />
            </Stack> : <Empty>No Mentions Available</Empty>}
          </MentionsBody>
        </MentionsOuterContainer>
        {view!="fav"&&trackerListMembers && trackerListMembers.length > 0 && <RightPanel>

          <TeamName>My Team: </TeamName>
          {(!trackerListMembers || trackerListMembers.length == 0) && <RightExplanation>Tracker list is empty {league ? `for ${league}` : ``}<br />Use &ldquo;add to list&ldquo; icons to the right of the<br /> player name in the team roster<br />to add to the &ldquo;My Team&ldquo; tracker list. </RightExplanation>}
          {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
            console.log("TRACKER LIST MEMBER", member, teamid, league)
            //return <SidePlayer><Link onClick={() => { setLocalPageType("player"), setLocalPlayer(p.member); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${p.league}/team/${p.teamid}/player/${encodeURIComponent(p.member)}`}>{p.member} </Link></SidePlayer>
            return <SideGroup key={`3fdsdvb-${i}`}>
              <SidePlayer>
                <Link onClick={() => { setLocalPlayer(member); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}`}>
                  {member}
                </Link>
              </SidePlayer>
              <SideButton>
                <IconButton
                  onClick={async () => {
                    console.log("TRACKED", member)
                    const removeTrackerListMemberParams: RemoveTrackerListMemberParams = { member, teamid: teamid || "" };

                    //to copilot: find in trackerListMembers the item with name p.name and remove it.
                    //then set trackerListMembers to the new array
                    const newTrackerListMembers = trackerListMembers.filter((p: any) => p.member != member);
                    trackerListMutate(newTrackerListMembers, false);
                    await removeTrackerListMember(removeTrackerListMemberParams);


                  }} size="large" aria-label="Add new list">
                  <SideIcon>
                    <PlaylistRemoveIcon sx={{ color: "#afa" }} />
                  </SideIcon>
                </IconButton>
              </SideButton>
            </SideGroup>

          })
          }


        </RightPanel>}
      </OuterContainer>
      <MobileMentionsOuterContainer>
        {v == 'mentions' && <MentionsHeader>Mentions:&nbsp;&nbsp;&nbsp;&nbsp;<FormControlLabel control={<Checkbox disabled={noUser} checked={localTrackerFilter == 1} onChange={
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalTrackerFilter(event.target.checked);
            const params: SetTrackerFilterParams = { tracker_filter: event.target.checked ? 1 : 0 };
            setTrackerFilter(params);

          }} />} label="My Team" />
          {noUser && <SignInButton><Button size="small" variant="contained"><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
        </MentionsHeader>}

        <MentionsBody>
          {v == 'mentions' && Mentions}
          {v == 'my team' && <MobilePlayersPanel>
            <MobileTeamName>My Team : </MobileTeamName>
            {(!trackerListMembers || trackerListMembers.length == 0) && <RightExplanation>Tracker list empty {league ? `for ${league}` : ``}</RightExplanation>}
            {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
              //return <SidePlayer><Link onClick={() => { setLocalPageType("player"), setLocalPlayer(p.member); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${p.league}/team/${p.teamid}/player/${encodeURIComponent(p.member)}`}>{p.member} </Link></SidePlayer>
              return <MobileSideGroup key={`3fdsdvb-${i}`}>
                <MobileSidePlayer>
                  <Link onClick={() => { setLocalPlayer(member); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}`}>
                    {member}
                  </Link>
                </MobileSidePlayer>
                <SideButton>
                  <IconButton
                    onClick={async () => {
                      console.log("TRACKED", member)
                      const removeTrackerListMemberParams: RemoveTrackerListMemberParams = { member, teamid: teamid || "" };

                      //to copilot: find in trackerListMembers the item with name p.name and remove it.
                      //then set trackerListMembers to the new array
                      const newTrackerListMembers = trackerListMembers.filter((p: any) => p.member != member);
                      trackerListMutate(newTrackerListMembers, false);
                      await removeTrackerListMember(removeTrackerListMemberParams);


                    }} size="large" aria-label="Add new list">
                    <SideIcon>
                      <PlaylistRemoveIcon sx={{ color: "#afa" }} />
                    </SideIcon>
                  </IconButton>
                </SideButton>
              </MobileSideGroup>

            })
            }


          </MobilePlayersPanel>}
        </MentionsBody>

      </MobileMentionsOuterContainer>
    </>
  );
};

export default LeagueMentions;