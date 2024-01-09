import React, { useEffect } from "react";
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router'
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
import {
   getOptions, UserOptionsKey,
  SetTrackerFilterParams, setTrackerFilter, TrackerListMembersKey, getTrackerListMembers,
  removeTrackerListMember, RemoveTrackerListMemberParams, getFavorites,
  FavoritesKey, FetchedMentionsKey, fetchMentions
} from '@/lib/api';

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
const MobileMentionsHeader = styled.div`
    padding-top:10px;
    font-size: 16px;
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
  margin-left:20px;
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
    color: #eee;
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
  //padding-left:20px;
  //padding-right:20px;
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
  //width: 100%;
  //padding-right:20px;
  //weight:240px;
  margin-left:20px;
  height:40px;
  flex-direction:row;
  justify-content:space-around;
 // padding-right:20px;
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
  color: #ccc;
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
const LoadMore = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items:center;
    font-size:18px;
    padding-bottom:140px;
`;
interface Props {
  league: string;
  noUser: boolean;
  setLocalPageType: (pageType: string) => void;
  setLocalPlayer: (player: string) => void;
  setLocalLeague: (league: string) => void;
  setLocalTeam: (team: string) => void;
  setLocalView: (view: string) => void;
  view: string;
}

const LeagueMentions: React.FC<Props> = ({ league, noUser, setLocalPageType, setLocalPlayer, setLocalLeague, setLocalTeam, setLocalView, view }) => {

  const optionsKey: UserOptionsKey = { type: "options", noUser };
  const { data: options, error: optionsError, isLoading: optionsLoading, mutate: optionsMutate } = useSWR(optionsKey, getOptions);
  const [localTrackerFilter, setLocalTrackerFilter] = React.useState(options.tracker_filter);
  const [globalLoading, setGlobalLoading] = React.useState(false);
  // const [v, setV] = React.useState((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
  useEffect(() => {
    if (optionsLoading) return;
    setLocalTrackerFilter(options.tracker_filter);
  }, [optionsLoading, options]);
  /*useEffect(() => {
    setV((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
  }, [view]);*/
  const router = useRouter();
  /*
  
    const mentionsKey: MentionsKey = { type: localTrackerFilter == 1 ? "filtered-mentions" : "mentions", league, noUser };
    console.log("MentionsKey", mentionsKey)
    let { data: mentions, error, isLoading, mutate: mutateMentions } = useSWR(mentionsKey, localTrackerFilter == 1 ? getFilteredMentions : getMentions);
  */
  //in parallel, implement infinite scrolling
  const fetchMentionsKey = (pageIndex: number, previousPageData: any): FetchedMentionsKey | null => {
    console.log("getMentionsKey=", pageIndex, previousPageData)
    let key: FetchedMentionsKey = { type: "FetchedMentions", teamid: "", name: "", noUser, page: pageIndex, league, myteam: localTrackerFilter ? 1 : 0,noLoad:view!="fav"&&view!="mentions" };
    console.log("getMentionsKey=>>>", key)

    if (previousPageData && !previousPageData.length) return null // reached the end
    return key;
  }
  // now swrInfinite code:
  const { data, error: mentionsError, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(fetchMentionsKey, fetchMentions, { initialSize: 1, })
  let mentions = data ? [].concat(...data) : [];
  console.log("LOADED MENTIONS FROM FALLBACK", { data })
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < 25);
  const isRefreshing = isValidating && data && data.length === size;

  const favoritesKey: FavoritesKey = { type: "Favorites", noUser,noLoad:view!="fav" };
  const { data: favoritesMentions, mutate: mutateFavorites } = useSWR(favoritesKey, getFavorites);
  //console.log("favoritesMentions", favoritesMentions)
  if (view == "fav") {
    mentions = favoritesMentions;
  }
  const trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser,noLoad:view!="my team" };
  const { data: trackerListMembers, error: trackerListError, isLoading: trackerListLoading, mutate: trackerListMutate } = useSWR(trackerListMembersKey, getTrackerListMembers);
  console.log("trackerListMembers", trackerListMembers)
  const Mentions = mentions && mentions.map((m: any, i: number) => {
    const { league, type, team, teamName, name, date, url, findex, summary, findexarxid, fav } = m;
    // console.log("XID:",league,name,xid)
   // console.log("rendering mention",teamName)
    return (<Mention
      noUser={noUser}
      mentionType="top"
      league={league}
      type={type}
      team={team}
      teamName={teamName}
      name={name}
      date={date}
      url={url}
      findex={findex}
      summary={summary}
      findexarxid={findexarxid}
      fav={fav}
      key={`mention${i}`}
      setLocalTeam={setLocalTeam}
      setLocalLeague={setLocalLeague}
      setLocalPlayer={setLocalPlayer}
      setLocalPageType={setLocalPageType}
      mutate={() => { mutate() }}

    />)
  });
  //console.log("league-mentions:", { v, mentions, isLoading })
  /* if (isLoading) return (<Stack spacing={1}>
       <Skeleton variant="rounded" animation="pulse" height={160} />
       <Skeleton variant="rounded" animation="pulse" height={80} />
       <Skeleton variant="rounded" animation="pulse" height={120} />
       <Skeleton variant="rounded" animation="pulse" height={160} />
   </Stack>)*/
  console.log("mentions view=", view, "localTrackerFilter=", localTrackerFilter)
  return (
    <>
      <OuterContainer>
        <MentionsOuterContainer>
          {(view != "fav") && <MentionsHeader><FormControlLabel control={<Checkbox size="small" disabled={noUser} checked={localTrackerFilter == 1} onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalTrackerFilter(event.target.checked);
              const params: SetTrackerFilterParams = { tracker_filter: event.target.checked ? 1 : 0 };
              setTrackerFilter(params);

            }} />} label="My Team Filter" />
            {noUser && <SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
          </MentionsHeader>}
          {(view == "fav") && <MentionsHeader><span>Favorites:</span></MentionsHeader>}
          <MentionsBody>
            {Mentions}
          </MentionsBody>
          <div style={{ fontFamily: "sans-serif" }}>
            <LoadMore
            // disabled={isLoadingMore || isReachingEnd}

            ><Button style={{ padding: 4, marginTop: 20 }} onClick={() => setSize(size + 1)} variant="outlined">
                {isLoadingMore
                  ? "loading..."
                  : isReachingEnd
                    ? "no more mentions"
                    : "load more"}
              </Button>
            </LoadMore>
          </div>
        </MentionsOuterContainer>
        {(view != "fav") && trackerListMembers && trackerListMembers.length > 0 && <RightPanel>

          <TeamName>My Team: </TeamName>
          {(!trackerListMembers || trackerListMembers.length == 0) && <RightExplanation>Tracker list is empty {league ? `for ${league}` : ``}<br />Use &ldquo;add to list&ldquo; icons to the right of the<br /> player name in the team roster<br />to add to the &ldquo;My Team&ldquo; tracker list. </RightExplanation>}
          {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
            console.log("TRACKER LIST MEMBER", member, teamid, league)
            //return <SidePlayer><Link onClick={() => { setLocalPageType("player"), setLocalPlayer(p.member); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${p.league}/team/${p.teamid}/player/${encodeURIComponent(p.member)}`}>{p.member} </Link></SidePlayer>
            return <SideGroup key={`3fdsdvb-${i}`}>
              <SidePlayer>
                <Link onClick={() => { setLocalPlayer(member); setLocalView("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}`}>
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
        {(view == 'mentions') && <MobileMentionsHeader> <FormControlLabel control={<Checkbox disabled={noUser} checked={localTrackerFilter == 1} onChange={
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalTrackerFilter(event.target.checked);
            const params: SetTrackerFilterParams = { tracker_filter: event.target.checked ? 1 : 0 };
            setTrackerFilter(params);

          }} />} label="My Team" />

          {noUser && <SignInButton><Button size="small" variant="outlined"><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
          {!league && !noUser && <FormControlLabel control={<Checkbox disabled={noUser || (localTrackerFilter == 1)} checked={false} onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalView("fav");
              router.push(league ? `/pro/league/${league}?view=fav` : `/pro?view=fav`)
            }} />} label="Favorites" />}
        </MobileMentionsHeader>}

        {(view == "fav" && !league) && <MobileMentionsHeader><FormControlLabel control={<Checkbox disabled={true} checked={localTrackerFilter == 1} onChange={
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalTrackerFilter(event.target.checked);
            const params: SetTrackerFilterParams = { tracker_filter: event.target.checked ? 1 : 0 };
            setTrackerFilter(params);

          }} />} label="My Team" />
          {!noUser && (localTrackerFilter != 1) && <FormControlLabel control={<Checkbox disabled={noUser} checked={true} onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => {
              setLocalView("mentions");
              router.push(league ? `/pro/league/${league}` : `/pro`)
            }} />} label="Favorites" />}</MobileMentionsHeader>}

        <MentionsBody>
         
          {(view == 'mentions' || view == 'fav') && Mentions}
          {(view == 'my team') && <MobilePlayersPanel>
            <MobileTeamName>My Team: </MobileTeamName>
            {(!trackerListMembers || trackerListMembers.length == 0) && <RightExplanation>Tracker list empty {league ? `for ${league}` : ``}</RightExplanation>}
            {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
              //return <SidePlayer><Link onClick={() => { setLocalPageType("player"), setLocalPlayer(p.member); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${p.league}/team/${p.teamid}/player/${encodeURIComponent(p.member)}`}>{p.member} </Link></SidePlayer>
              return <MobileSideGroup key={`3fdsdvb-${i}`}>
                <MobileSidePlayer>
                  <Link onClick={() => { setLocalPlayer(member); setLocalView("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}`}>
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