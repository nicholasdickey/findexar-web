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
import TeamDetails from "./team-details";
import PlayerDetails from "./player-details";
import SecondaryTabs from "./secondary-tabs";
import SubscriptionMenu from "./subscription-menu";
import { Add } from "@mui/icons-material";


const SidePlayer = styled.div`
  //height: 40px;
  width: 200px; 
  color: #fff;
  //text-align: center;
  font-size: 16px;
  padding-left:20px;
  margin: 10px;
`;

const TeamName = styled.div`
  height: 30px;
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
  height:100%;
  min-height: 1000vh;
  width:300px;
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
  background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:center; 
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
  setLocalPlayer: (player: string) => void;
  setLocalPageType: (pagetype: string) => void;
  subscriptionPrompt: boolean;
  subscriptionObject: any;
  setDismiss: any;
  noUser:boolean;
}

const Team: React.FC<Props> = (props) => {
  let { noUser,setDismiss, subscriptionPrompt, subscriptionObject, view, teams, dark, league, team, player, pagetype, teamName, setLocalPlayer, setLocalPageType } = props;
  const [v, setV] = React.useState((!view || view.toLowerCase() == "home") ? "mentions" : view.toLowerCase());
  const [selectedTeam, setSelectedTeam] = React.useState(team);
  const [selectedPlayer, setSelectedPlayer] = React.useState(player);
  const [globalLoading, setGlobalLoading] = React.useState(false);


  const teamPlayersKey: TeamPlayersKey = { type:'teamPlayers',league: league || "", teamid: team || "" };
  const { data: players, error, isLoading,mutate:mutatePlayers } = useSWR(teamPlayersKey, getTeamPlayers);
  console.log("players", players);
  useEffect(() => {
    if (!v || v == "home")
      setV("mentions");
  }, [v]);
  useEffect(() => {
    setSelectedTeam(team);
    setV("mentions");
    setGlobalLoading(false);

  }, [team]);
  useEffect(() => {
    setSelectedPlayer(player);
    setV("mentions");
    setGlobalLoading(false);

  }, [player]);
  useEffect(() => {
    setV(view.toLowerCase());
    //setGlobalLoading(true);
  }, [view]);

  console.log("TeamPage", { subscriptionPrompt, v, team, pagetype, view, selectedTeam, selectedPlayer })
  const PlayersNav = players&&players?.map((p: { name: string, findex: string, mentions: string,tracked:boolean},i:number) => {
    return <SideGroup key={`ewfggvfn-${i}`}>{p.name == player ?
      <SelectedSidePlayer>
        <Link onClick={() => { setLocalPageType("player"); setLocalPlayer(p.name); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>
          {p.name} ({`${p.mentions}`})
        </Link>
      </SelectedSidePlayer>
      :
      <SidePlayer>
        <Link onClick={() => { setLocalPlayer(p.name); setV("mentions"); setGlobalLoading(true) }} href={`/pro/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>
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
  console.log("Team", { v, team, pagetype });
  /* if(isLoading||globalLoading){
     return  <MainPanel>Loading...</MainPanel>
   }*/
  return (
    <div className="team">
      <MainPanel>
        <CenterPanel>
          {pagetype == "team" ? <TeamDetails {...props} /> : <PlayerDetails {...props} />}
        </CenterPanel>
        <RightPanel>
          <TeamName>{teamName}</TeamName>
          {PlayersNav}
        </RightPanel>
      </MainPanel>
      <MainMobilePanel>

        {pagetype == "team" && <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "Players", icon: <PlayerIcon /> }]} onChange={(option: any) => { console.log(option);/*router.replace(`/league/${league}/team/${team}?view=${encodeURIComponent(option.name)}`)*/setV(option.name.toLowerCase()); }} selectedOptionName={v} />}
        {pagetype == "player" && <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "Players", icon: <PlayerIcon /> }]} onChange={(option: any) => { console.log(option);/*router.replace(`/league/${league}/team/${team}/player/${player}?view=${encodeURIComponent(option.name)}`)*/setV(option.name.toLowerCase()); }} selectedOptionName={v} />}
        {subscriptionPrompt && <SubscriptionMenu hardStop={false} {...subscriptionObject} setDismiss={setDismiss} />}

        {v == 'teams' && teams}
        {v == 'mentions' && (isLoading || globalLoading) && <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}


          <Skeleton variant="rounded" animation="pulse" height={160} />
          <Skeleton variant="rounded" animation="pulse" height={80} />
          <Skeleton variant="rounded" animation="pulse" height={120} />
          <Skeleton variant="rounded" animation="pulse" height={160} />
        </Stack>}

        {!isLoading && !globalLoading && v == 'mentions' && pagetype == "team" && <TeamDetails {...props} />}
        {!isLoading && !globalLoading && v == 'mentions' && pagetype == "player" && <PlayerDetails {...props} />}
        {v == 'players' &&
          <MobilePlayersPanel>
            <MobileTeamName>{teamName}</MobileTeamName>
            {globalLoading ? <div>Loading...</div> : PlayersNav}
          </MobilePlayersPanel>}
      </MainMobilePanel>
    </div>
  );
};

export default Team;