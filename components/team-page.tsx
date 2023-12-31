import React, { useState, useEffect } from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { styled } from "styled-components";
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayerIcon from '@mui/icons-material/PersonPinOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { AddTrackerListMemberParams, addTrackerListMember,RemoveTrackerListMemberParams,removeTrackerListMember,getTeamPlayers,TeamPlayersKey } from '@/lib/api';
//import TeamDetails from "./team-details";
//import PlayerDetails from "./player-details";
import SecondaryTabs from "./secondary-tabs";
import SubscriptionMenu from "./subscription-menu";
import { Add } from "@mui/icons-material";
import TeamPlayerMentions from "./team-player-mentions";


const SidePlayer = styled.div`
  //height: 40px;
  width: 200px; 
  color: #eee;
  //text-align: center;
  font-size: 16px;
  padding-left:20px;
  margin: 10px;
`;

const TeamName = styled.div`
  height: 40px;
  width: 200px; 
  color: #aea;
  //text-align: center;
  padding-left:20px;
  font-size: 20px;
  margin: 10px;
`;

const MobileTeamName = styled.div`
  height: 40px;
  color: #aea;
  text-align: center;
  font-size: 24px;
  margin: 10px;
`;
const SideGroup = styled.div`
  display:flex;
  width:280px;
  flex-direction:row;
  justify-content:space-between;
  padding-right:20px;
  align-items:center;
 
`;
const SideIcon = styled.div`
 // margin-top:-8px;
  color:#aaa;
  width:20px;
  height:20px;

`;
const SideButton = styled.div`
  //margin-top:-8px;
  width:40px;
  color:#aaa;

`;
const SelectedSidePlayer = styled.div`
 // height: 40px;
  width: 200px;
  color: #ff8;
 // text-align: center;
  font-size: 16px;
  padding-left:20px;
  margin: 10px;
  a{
    color: #ff8 !important;
    text-decoration: none;
    &:hover{
      color: #F8F;
    }
  }
`;

const RightPanel = styled.div`
 // height:100%;
  //min-height: 1000vh;
  min-width:300px;

  
  height:auto !important;
  height:100%;
  min-height: 200vw;

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
  background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:center; 
  //font-family: roboto;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;

const CenterPanel = styled.div`
  height:100%;
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
  noUser:boolean;
  setLocalPageType: (pageType: string) => void;
  setLocalPlayer: (player: string) => void;
  setLocalLeague: (league: string) => void;
  setLocalTeam: (team: string) => void;
  setLocalView: (view: string) => void;

}

const Team: React.FC<Props> = (props) => {
  let { noUser,setDismiss, subscriptionPrompt, subscriptionObject, view, teams, dark, league, team, player, pagetype, teamName, setLocalPlayer, setLocalPageType,setLocalView} = props;
 // const [v, setV] = React.useState((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
  const [selectedTeam, setSelectedTeam] = React.useState(team);
  const [selectedPlayer, setSelectedPlayer] = React.useState(player);
  const [globalLoading, setGlobalLoading] = React.useState(false);


  const teamPlayersKey: TeamPlayersKey = { type:'teamPlayers',league: league || "", teamid: team || "" };
  const { data: players, error, isLoading,mutate:mutatePlayers } = useSWR(teamPlayersKey, getTeamPlayers);
  //console.log("players", players);
  const router = useRouter();
  useEffect(() => {
    if (!view || view == "home")
      setLocalView("mentions");
  }, [view]);
  useEffect(() => {
    setSelectedTeam(team);
    setLocalView("mentions");
    setGlobalLoading(false);

  }, [team]);
  useEffect(() => {
    setSelectedPlayer(player);
    setLocalView("mentions");
    setGlobalLoading(false);

  }, [player]);
  
  console.log("TeamPage", { subscriptionPrompt, team, pagetype, view, selectedTeam, selectedPlayer })
  const PlayersNav = players&&players?.map((p: { name: string, findex: string, mentions: string,tracked:boolean},i:number) => {
    return <SideGroup key={`ewfggvfn-${i}`}>{p.name == player ?
      <SelectedSidePlayer>
        <Link onClick={() => { setLocalPageType("player"); setLocalPlayer(p.name); setLocalView("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>
          {p.name} ({`${p.mentions}`})
        </Link>
      </SelectedSidePlayer>
      :
      <SidePlayer>
        <Link onClick={() => { setLocalPlayer(p.name); setLocalView("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>
          {p.name} ({`${p.mentions || 0}`})
        </Link>
      </SidePlayer>}
      <SideButton>
        <IconButton
          onClick={async () => {
            setSelectedPlayer(p.name);
            if (p.tracked == true) {
              console.log("TRACKED", p.name)
              const removeTrackerListMemberParams:RemoveTrackerListMemberParams={ member: p.name,  teamid: team || "" };
          
              //to copilot: find in players the item with name p.name and set tracked to true.
              mutatePlayers((players:any)=>{
                return players.map((player:any)=>{
                  if(player.name==p.name){
                    player.tracked=false;
                  }
                  return player;
                })
              },false);
              await removeTrackerListMember(removeTrackerListMemberParams);
            }
            else {
              const addTrackerListMemberParams:AddTrackerListMemberParams={ member: p.name,  teamid: team || "" };    
              mutatePlayers((players:any)=>{
                return players.map((player:any)=>{
                  if(player.name==p.name){
                    player.tracked=true;
                  }
                  return player;
                })
              },false);
              console.log("after mutatePlayers");
              await addTrackerListMember(addTrackerListMemberParams);
            }     
          }} size="large" aria-label="Add new list">
          <SideIcon>
            {p.tracked?<PlaylistRemoveIcon sx={{color:"#afa"}}/>:<PlaylistAddIcon />}
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
          <TeamName>{teamName}</TeamName>
          {PlayersNav}
        </RightPanel>
      </MainPanel>
      <MainMobilePanel>

        {pagetype == "team" && <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "Players", icon: <PlayerIcon /> }]} onChange={(option: any) => { console.log(option);setLocalView(option.name.toLowerCase());router.replace(`/pro/league/${league}/team/${team}?view=${encodeURIComponent(option.name.toLowerCase())}`); }} selectedOptionName={view} />}
        {pagetype == "player" && <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "Players", icon: <PlayerIcon /> }]} onChange={(option: any) => { console.log(option);setLocalView(option.name.toLowerCase());router.replace(`/pro/league/${league}/team/${team}/player/${player}?view=${encodeURIComponent(option.name.toLowerCase())}`); }} selectedOptionName={view} />}
        {subscriptionPrompt && <SubscriptionMenu hardStop={false} {...subscriptionObject} setDismiss={setDismiss} />}

        {view == 'teams' && teams}
        
        {view == 'mentions' && <TeamPlayerMentions {...props} />}
        {view == 'players' &&
          <MobilePlayersPanel>
            <MobileTeamName>{teamName}</MobileTeamName>
            {globalLoading ? <div>Loading...</div> : PlayersNav}
          </MobilePlayersPanel>}
      </MainMobilePanel>
    </div>
  );
};

export default Team;