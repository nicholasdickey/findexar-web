import React, { useState, useEffect } from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { UserButton, SignInButton, SignedOut, SignedIn,RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from 'next/router'
import { styled,useTheme } from "styled-components";
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayerIcon from '@mui/icons-material/PersonPinOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { AddTrackerListMemberParams, addTrackerListMember, RemoveTrackerListMemberParams, removeTrackerListMember, getTeamPlayers, TeamPlayersKey, recordEvent } from '@/lib/api';
//import TeamDetails from "./team-details";
//import PlayerDetails from "./player-details";
import SecondaryTabs from "./secondary-tabs";
import SubscriptionMenu from "./subscription-menu";
import { Add } from "@mui/icons-material";
import TeamPlayerMentions from "./team-player-mentions";

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
  color:${props => props.highlight ?'var(--myteam)' : 'var(--text)'};
  font-size: 16px;
  padding-left:20px;
  &:hover{
      color:var(--highlight);
    }

  margin: 10px;
  a{
    color:${props => props.highlight ?'var(--myteam)' : 'var(--text)'} !important;//#ff8 !important;
    text-decoration: none;
    background-color:${props => props.highlight ?'var(--myteam-bg)' : 'var(--background)'} !important;
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
  color:${props => props.highlight ?'var(--selected))' : 'var(--link)'};

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
 color:${props => props.highlight ?'var(--selected)' : 'var(--selected)'};
 // text-align: center;
  font-size: 16px;
  padding-left:20px;
  margin: 10px;
  a{
    color:${props => props.highlight ?'var(--selected)' : 'var(--selected)'} !important;//#ff8 !important;
    text-decoration: none;
    background-color:${props => props.highlight ?'var(--myteam-bg)' : 'var(--background)'} !important;
    &:hover{
      color:var(--highlight);
    }
  }
`;

const RightPanel = styled.div`
 // height:100%;
  //min-height: 1000vh;
  min-width:300px;
  padding-left:20px;
  
  height:auto !important;
  height:100%;
  min-height: 200vw;
  //background-color:#263238;
  //background-color:#333;
  //background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-top:18px;
  a{
    color:var(--text); // #eee;
    text-decoration: none;
    &:hover{
      color: var(--highlight);//#4f8;
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

const CenterPanel = styled.div`
  height:100%;
  width:100%;
`;

const MainPanel = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  height:100%;
  @media screen and (max-width: 1199px) {
    display: none 
  }
`;

const MainMobilePanel = styled.div`
  width:100%;
  height:100%;
  visibility: visible;
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;
interface Props {
  dark?: number;
  league?: string;
  team?: string;
  player?: string;
  pagetype?: string;
  teamName?: string;
  teams: any;
  view: string;

  subscriptionPrompt: boolean;
  subscriptionObject: any;
  setDismiss: any;
  noUser: boolean;
  setLocalPageType: (pageType: string) => void;
  setLocalPlayer: (player: string) => void;
  setLocalLeague: (league: string) => void;
  setLocalTeam: (team: string) => void;
  setLocalView: (view: string) => void;
  params: string;
  params2: string;
  sessionid: string
  tp:string;
  tp2:string;
  findexarxid:string;

}

const Team: React.FC<Props> = (props) => {
  let { findexarxid,tp,tp2,sessionid, noUser, setDismiss, subscriptionPrompt, subscriptionObject, view, teams, dark, league, team, player, pagetype, teamName, setLocalPlayer, setLocalPageType, setLocalView, setLocalTeam,params, params2 } = props;
  // const [v, setV] = React.useState((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
 /* const [selectedTeam, setSelectedTeam] = React.useState(team);
  const [selectedPlayer, setSelectedPlayer] = React.useState(player);
  const [globalLoading, setGlobalLoading] = React.useState(false);*/
  const[signin,setSignin]=React.useState(false);

  const teamPlayersKey: TeamPlayersKey = { type: 'teamPlayers', league: league || "", teamid: team || "" };
  const { data: players, error, isLoading, mutate: mutatePlayers } = useSWR(teamPlayersKey, getTeamPlayers);
  //console.log("players", players);
  const router = useRouter();
  const theme = useTheme();
 /* useEffect(() => {
    if (!view || view == "home")
      setLocalView("mentions");
  }, [view, setLocalView]);*/
  /*useEffect(() => {
    setLocalTeam(team);
    setLocalView("mentions");
    setGlobalLoading(false);

  }, [team, setLocalView]);
  useEffect(() => {
    setSelectedPlayer(player);
    setLocalView("mentions");
    setGlobalLoading(false);

  }, [player, setLocalView]);*/
  const onViewNav = async (option: { name: string, access: string }) => {
    setLocalView(option.name.toLowerCase());
    router.replace(`/pub/league/${league}/team/${team}?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2}`, undefined, { shallow: true });
    await recordEvent(sessionid as string || "",
      'team-view-nav',
      `{"params":"${params}","view":"${option.name}"}`
    );
  }
  const onPlayerNav = async (name: string) => {
    console.log("onPlayerNav", name)
    setLocalPageType("player");
    setLocalPlayer(name);
    setLocalView("mentions");
    //setGlobalLoading(true);
    await recordEvent(sessionid as string || "",
      'player-nav',
      `{"params":"${params}","player":"${name}"}`
    );
  }
  //console.log("styled theme:",theme)
  //@ts-ignore
  const mode=theme.palette.mode;
  const palette=theme[mode].colors;
  //console.log("styled palette:",palette );
  console.log("TeamPage", { subscriptionPrompt, team,player, pagetype, view })
  const PlayersNav = players && players?.map((p: { name: string, findex: string, mentions: string, tracked: boolean }, i: number) => {
    return <SideGroup key={`ewfggvfn-${i}`}>{p.name == player ?
      <SelectedSidePlayer highlight={p.tracked}>
        <Link onClick={async () => { await onPlayerNav(p.name)}} href={`/pub/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}${params}${tp}`} shallow>
          {p.name} ({`${p.mentions}`})
        </Link>
      </SelectedSidePlayer>
      :
      <SidePlayer  highlight={p.tracked}>
        <Link onClick={async () => { await onPlayerNav(p.name)}} href={`/pub/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}${params}${tp}`} shallow>
          {p.name} ({`${p.mentions || 0}`})
        </Link>
      </SidePlayer>}
      <SideButton>
        <IconButton
          onClick={async () => {
            setLocalPlayer(p.name);
           
            if(window&&window.Clerk){
              const Clerk=window.Clerk;
              const user=Clerk.user;
              const id=Clerk.user?.id;
              if(!id){
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
            {signin&&<RedirectToSignIn/>}
          </SideIcon>
        </IconButton>
      </SideButton>
    </SideGroup>
  });
  console.log("Team", { view, team, pagetype });
  /* if(isLoading||globalLoading){
     return  <MainPanel>Loading...</MainPanel>
   }*/
  return (
    <div className="team">
      <MainPanel>
        <CenterPanel>
          {pagetype == "team" ? <TeamPlayerMentions {...props} /> : <TeamPlayerMentions {...props} />}

        </CenterPanel>
        <RightPanel>
          <TeamName>{teamName}:</TeamName>
         
          {PlayersNav}
        </RightPanel>
      </MainPanel>
      <MainMobilePanel>

        {pagetype == "team" && <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "Players", icon: <PlayerIcon /> }]} onChange={async (option: any) => { console.log(option); await onViewNav(option) }} selectedOptionName={view} />}
        {pagetype == "player" && <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "Players", icon: <PlayerIcon /> }]} onChange={async (option: any) => { console.log(option); await onViewNav(option); }} selectedOptionName={view} />}
        {subscriptionPrompt && <SubscriptionMenu hardStop={false} {...subscriptionObject} setDismiss={setDismiss} />}

        {view == 'teams' && teams}

        {view == 'mentions' && <TeamPlayerMentions {...props} />}
        {view == 'players' &&
          <MobilePlayersPanel>
            <MobileTeamName>{teamName}</MobileTeamName>
            {PlayersNav}
          </MobilePlayersPanel>}
      </MainMobilePanel>
    </div>
  );
};

export default Team;