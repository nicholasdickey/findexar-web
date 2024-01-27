import React, { useEffect } from "react";
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { styled, useTheme } from "styled-components";
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoginIcon from '@mui/icons-material/Login';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import {
    getOptions, UserOptionsKey,
    SetTrackerFilterParams, setTrackerFilter, TrackerListMembersKey, getTrackerListMembers,
    removeTrackerListMember, RemoveTrackerListMemberParams, getFavorites,
    FavoritesKey, FetchedMentionsKey, fetchMentions, FetchedStoriesKey, fetchStories
} from '@/lib/api';

import Mention from "./mention";
import TertiaryTabs from "./tertiary-tabs";
import EmptyExplanation from "./empty-explanation";
import MentionOverlay from "./mention-overlay";
import Story from "./story";

const MentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:100%;
    min-width:700px;
    height:100%;

    font-family: 'Roboto', sans-serif;
   // padding-left:20px;
    padding-right:20px;
  /*  a{
        font-size: 15px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }*/
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
          color: var(--highlight);
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
    height:20px;
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
    min-height:60px;
    //width:100%;
    padding-left:20px;
    padding-right:20px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
`;
const OuterContainer = styled.div`
    position:relative;
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
   //width:100%;
    //height:100%;
    margin:0px;
    @media screen and (max-width: 1199px) {
        display: none;
  }
`;
const TeamName = styled.div`
  height: 30px;
  width: 100%; 
  //color: #aea;
  //color:#333;
  //text-align: center;
  //padding-left:20px;
  font-size: 20px;
  padding-top:2px;
  padding-bottom:35px;
  //margin: 10px;
`;
const MobileTeamName = styled.div`
  height: 30px;
  //margin-left:20px;
  color:var(--text);
  //width: 200px; 
 // color: #aea;
  //text-align: center;
 padding-left:20px;
 padding-top:2px;
 padding-bottom:35px;

  font-size: 20px;
  //margin: 10px;
`;


const RightPanel = styled.div`
  height:auto !important;
 // height:100%;
  min-width:300px;
  padding-left:20px;
  position:sticky;
  top:0;
  //height:auto;
  max-height:100vh;
  //max-height: 130vh;
  overflow-y: auto;
  
  //min-height: 1000vh;
  
  // background-color:  #668;
  //background-color:#263238;
  //background-color:#333;
  //background-color://#fff;
  // color:#333;
  //display:flex;
  //flex-direction:column;
  //justify-content:flex-start;
  //align-items:flex-start; 
  padding-top:18px;
 // border-left: 1px solid #aaa;
  a{
    //color: #eee;
    color: var(---text);
    text-decoration: none;
    &:hover{
      //color: #4f8;
      color: var(--highlight)// #33C;
    }
  }
`;

const MobilePlayersPanel = styled.div`
  height:100%;
  width:100%;
  min-height:180vw;
  color:var(--text);
 //background-color:  #668;
  display:flex;
  //padding-left:20px;
  //padding-right:20px;
  padding-top:10px;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  a{
    //color: #fff;
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
const SideGroup = styled.div`
  display:flex;
  width: 260px;
  height:40px;
  flex-direction:row;
  justify-content:space-between;
  padding-right:20px;
  align-items:center;
  padding-left:20px;
  border-left: 1px solid #aaa;
 
`;
const MobileSideGroup = styled.div`
  display:flex;
  width: 260px;
  //width: 100%;
  //padding-right:20px;
  //weight:240px;
  margin-left:20px;
  height:40px;
  flex-direction:row;
  justify-content:space-around;
 // padding-right:20px;
  align-items:center;
  padding-left:20px;
  padding-right:20px;
  border-left: 1px solid #aaa;

 
`;
const SideIcon = styled.div`
 // margin-top:-8px;
 // color:#aaa;
  width:20px;
  height:40px;

`;
const SideButton = styled.div`
  //margin-top:-8px;
  width:45px;
 // color:#aaa;

`;
const MobileSidePlayer = styled.div`
  ///height: 40px;
  width:240px; 
  //color: #fff;
  //text-align: center;
  font-size: 16px;
  //margin-top: 10px;
 // margin-bottom:10px;
 
`;
const SidePlayer = styled.div`
  height: 30px;
  width: 140px; 
  //color: #ccc;
  //color:#333;
  //text-align: center;
  font-size: 16px;
  //margin-top: 10px;
 // margin-bottom:10px;
`;
const RightExplanation = styled.div`
  //height: 30px;
  width: 270px; 
 // color: #ccc;
  line-height:1.5;
 // text-align: center;
  font-size: 14px;
  //margin-top: 20px;
  margin-bottom:10px;
  //margin-left:20px;
`;
const MobileRightExplanation = styled.div`
  //height: 30px;
  width: 280px; 
 // color: #ccc;
  line-height:1.5;
 // text-align: center;
  font-size: 14px;
  //margin-top: 20px;
  margin-bottom:10px;
  margin-left:20px;
`;
const LoadMore = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items:center;
    font-size:18px;
    padding-bottom:140px;
    color:var(--text);
`;
const MobileLoadMore = styled.div`
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items:center;
    font-size:18px;
    padding-bottom:20px;
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
    params2: string;
    params: string
    sessionid: string;
    tab: string;
    tp: string;
    tp2: string;
    setLocalTab: (tab: string) => void;
    findexarxid: string;
}

const LeagueMentions: React.FC<Props> = ({ findexarxid, tp, tp2, tab, league, noUser, setLocalPageType, setLocalPlayer, setLocalLeague, setLocalTeam, setLocalView, view, params, params2, sessionid, setLocalTab }) => {
    console.log("league-mentions:", { league, noUser, view })
    const optionsKey: UserOptionsKey = { type: "options", noUser };
    const { data: options, error: optionsError, isLoading: optionsLoading, mutate: optionsMutate } = useSWR(optionsKey, getOptions);
    const [localTrackerFilter, setLocalTrackerFilter] = React.useState(options?.tracker_filter);
    const [noLoadOverride, setNoLoadOverride] = React.useState(false);
    console.log("LeagueMentions league=", league)
    const isMobile = useMediaQuery('(max-width:1199px)');
    //const u=clerkClient.g
    useEffect(() => {
        console.log("LeagueMentions useEffect")
        setNoLoadOverride(true);
    }, []);

    // const [v, setV] = React.useState((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
    useEffect(() => {
        if (optionsLoading) return;
        setLocalTrackerFilter(options.tracker_filter);
    }, [optionsLoading, options]);
    /*useEffect(() => {
      setV((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
    }, [view]);*/
    const router = useRouter();
    const theme = useTheme();
    //@ts-ignore
    const mode = theme.palette.mode;
    const palette = theme[mode].colors
    const fetchStoriesKey = (pageIndex: number, previousPageData: any): FetchedStoriesKey | null => {
        //console.log("getMentionsKey=", pageIndex, previousPageData)
        let key: FetchedStoriesKey = { type: "FetchedStories", noUser, page: pageIndex, league, noLoad: (view != "mentions" || tab != "all") && !noLoadOverride };
        console.log("getSoriesKey=>>>", key)

        if (previousPageData && !previousPageData.length) return null // reached the end
        return key;
    }
    // now swrInfinite code:  REFACTOR 1/25/2024 to stories
    const { data, error: storiesError, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(fetchStoriesKey, fetchStories, { initialSize: 1, })
    let stories = data ? [].concat(...data) : [];
    // console.log("LOADED STORIES FROM FALLBACK", { data })

    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    let isEmpty = data?.[0]?.length === 0;
    let isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < 5);
    const isRefreshing = isValidating && data && data.length === size;
    console.log("league-stories ", { isEmpty, data, fetchStoriesKey })
    const favoritesKey: FavoritesKey = { type: "Favorites", noUser, noLoad: tab != "fav" };
    const { data: favoritesMentions, mutate: mutateFavorites } = useSWR(favoritesKey, getFavorites);
    //console.log("favoritesMentions", favoritesMentions)

    if (!view)
        view = "mentions";
    
    const trackerListMembersKey: TrackerListMembersKey = { type: "tracker_list_members", league, noUser, noLoad: false };
    const { data: trackerListMembers, error: trackerListError, isLoading: trackerListLoading, mutate: trackerListMutate } = useSWR(trackerListMembersKey, getTrackerListMembers);
    //console.log("trackerListMembers", trackerListMembersKey,trackerListMembers)

    const Stories = stories && stories.map((s: any, i: number) => {
        // const { title, digest, url, image, site_name, authors, createdTime, mentions } = s;
        // console.log("XID:",league,name,xid)
        // console.log("rendering mention",teamName)


        return (<Story
            noUser={noUser}
            story={s}
            key={`story-${i}`}
            setLocalTeam={setLocalTeam}
            setLocalLeague={setLocalLeague}
            setLocalPlayer={setLocalPlayer}
            setLocalPageType={setLocalPageType}
            mutate={() => { mutate() }}
            params={params}
            sessionid={sessionid}
            tp={tp}

        />)
    });
    console.log("render league-stories", stories);
    //console.log("league-mentions:", { v, mentions, isLoading })
    /* if (isLoading) return (<Stack spacing={1}>
         <Skeleton variant="rounded" animation="pulse" height={160} />
         <Skeleton variant="rounded" animation="pulse" height={80} />
         <Skeleton variant="rounded" animation="pulse" height={120} />
         <Skeleton variant="rounded" animation="pulse" height={160} />
     </Stack>)*/
    //console.log("mentions view=", view, "localTrackerFilter=", localTrackerFilter)
    /* if(view!="fav"&&view!="mentions"&&view!='my team'){
       return <></>
     }*/
    const onTabNav = async (option: any) => {
        const tab = option.tab;
        setLocalTab(tab);
        setLocalView("mentions");
        let tp = tab != 'all' ? params ? `&tab=${tab}` : `?tab=${tab}` : ``;
        router.push(league ? `/pub/league/${league}${params}${tp}` : params ? `/pub${params}${tp}` : `/pub?tab=${tab}`)
    }
    return (
        <>
            {!isMobile && <OuterContainer>
                <MentionsOuterContainer>
                    {(false && view != "fav") && <MentionsHeader>{!noUser && <FormControlLabel control={<Checkbox size="small" checked={localTrackerFilter == 1} onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => {
                            setLocalTrackerFilter(event.target.checked);
                            const params: SetTrackerFilterParams = { tracker_filter: event.target.checked ? 1 : 0 };
                            setTrackerFilter(params);

                        }} />} label="My Team Filter" />}
                        {noUser && <SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
                    </MentionsHeader>}
                    {view == 'mentions' && <TertiaryTabs options={[{ name: `${league ? league : 'Full'} Feed`, tab: 'all' }, { name: "My Feed", tab: "myteam" }, { name: "Favorites", tab: "fav" }]} onChange={async (option: any) => { await onTabNav(option); }} selectedOptionName={tab} />}
                    <MentionsBody>
                        <MentionOverlay findexarxid={findexarxid} setDismiss={(dismiss: boolean) => { setLocalView("mentions"); }} tp={tp} fav={0} noUser={noUser} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} mutate={() => mutate()} params={params} sessionid={sessionid} />
                        {Stories}
                        <Button style={{ padding: 4, marginTop: 20 }} onClick={() => setSize(size + 1)} variant="outlined">
                            {isLoadingMore
                                ? "loading..."
                                : isReachingEnd
                                    ? `no more stories`
                                    : "load more"}
                        </Button>
                    </MentionsBody>
                </MentionsOuterContainer>
                <RightPanel>
                    <TeamName>My Team{league ? ` for ${league}` : ``}: </TeamName>
                    {(!trackerListMembers || trackerListMembers.length == 0) && <RightExplanation>Use  &nbsp;<PlaylistAddIcon sx={{/* color: "#aea" */ }} />&nbsp;  icon to the right of the<br /> player&apos;s name in the team roster<br />(click on the league and the team name)<br />to add to &ldquo;My Team&ldquo; tracking list.<br /><br /><SignedOut>Note, My Team featue requires the user to be signed into their Findexar account.<br /><br /><SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></SignedOut>
                        <br /><br />To view the My Team&apos;s mentions feed<br /> go to Home <HomeIcon /> or select a League. Then select a &ldquo;My Feed&ldquo; tab.
                    </RightExplanation>}
                    {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
                        //console.log("TRACKER LIST MEMBER", member, teamid, league)
                        return <SideGroup key={`3fdsdvb-${i}`}>
                            <SidePlayer>
                                <Link onClick={() => { setLocalPlayer(member); setLocalView("mentions"); }} href={`/pub/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}`}>
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
                                        <PlaylistRemoveIcon sx={{ color: palette.selected }} />
                                    </SideIcon>
                                </IconButton>
                            </SideButton>
                        </SideGroup>

                    })
                    }

                    
                </RightPanel>
            </OuterContainer>}

            {isMobile && <MobileMentionsOuterContainer>


                {view == 'mentions' && <TertiaryTabs options={[{ name: `${league ? league : 'Full'} Feed`, tab: 'all' }, { name: "My Feed", tab: "myteam" }, { name: "Favorites", tab: "fav" }]} onChange={async (option: any) => { await onTabNav(option); }} selectedOptionName={tab} />}


                <MentionsBody>

                    {(view == 'mentions' || view == 'fav') &&
                        <>
                            <MentionOverlay findexarxid={findexarxid} setDismiss={(dismiss: boolean) => { setLocalView("mentions"); }} tp={tp} fav={0} noUser={noUser} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} mutate={() => mutate()} params={params} sessionid={sessionid} />

                            {Stories}
                            <MobileLoadMore >
                                {tab == 'myteam' && isReachingEnd ? <EmptyExplanation type="myfeed" noUser={noUser} /> : tab == 'fav' && isReachingEnd ? <EmptyExplanation type="fav" noUser={noUser} /> : <LoadMore
                                // disabled={isLoadingMore || isReachingEnd}
                                ><Button style={{ padding: 4, marginTop: 20 }} onClick={() => setSize(size + 1)} variant="outlined">
                                        {isLoadingMore
                                            ? "loading..."
                                            : isReachingEnd
                                                ? "no more mentions"
                                                : "load more"}
                                    </Button>
                                </LoadMore>}
                            </MobileLoadMore>
                        </>}
                    {(view == 'my team') && <MobilePlayersPanel>
                        <MobileTeamName>My Team: </MobileTeamName>
                        {(!trackerListMembers || trackerListMembers.length == 0) && <MobileRightExplanation>Use  &nbsp;<PlaylistAddIcon />&nbsp;  icon to the right of the player&apos;s name in the team roster (&ldquo;players&ldquo; tab) to add to &ldquo;My Team&ldquo; tracking list.<br /><br /><SignedOut>Note, My Team featue requires the user to be signed into their Findexar account.<br /><br /><SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></SignedOut>
                            <br /><br />To view My Team&apos;s mentions feed go to <br />Home <HomeIcon /> or select a League. Then select a &ldquo;My Feed&ldquo; tab.
                        </MobileRightExplanation>}
                        {trackerListMembers && trackerListMembers.map(({ member, teamid, league }: { member: string, teamid: string, league: string }, i: number) => {
                            return <MobileSideGroup key={`3fdsdvb-${i}`}>
                                <MobileSidePlayer>
                                    <Link onClick={() => { setLocalPlayer(member); setLocalView("mentions"); }} href={`/pub/league/${league}/team/${teamid}/player/${encodeURIComponent(member)}${params}`}>
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
                                            <PlaylistRemoveIcon sx={{ color: "var(--selected)" }} />
                                        </SideIcon>
                                    </IconButton>
                                </SideButton>
                            </MobileSideGroup>

                        })
                        }


                    </MobilePlayersPanel>}
                </MentionsBody>

            </MobileMentionsOuterContainer>}
        </>
    );
};

export default LeagueMentions;