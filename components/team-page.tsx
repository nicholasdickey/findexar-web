import React from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { styled } from "styled-components";
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayerIcon from '@mui/icons-material/PersonPinOutlined';
import { TeamPlayersKey, getTeamPlayers } from '@/lib/api';
import TeamDetails from "./team-details";
import PlayerDetails from "./player-details";
import SecondaryTabs from "./secondary-tabs";

const SidePlayer = styled.div`
  height: 40px;
  width: 200px; 
  color: #fff;
  text-align: center;
  font-size: 14px;
  margin: 10px;
`;

const TeamName = styled.div`
  height: 40px;
  width: 200px; 
  color: #aea;
  text-align: center;
  font-size: 16px;
  margin: 10px;
`;

const MobileTeamName = styled.div`
  height: 40px;
  color: #aea;
  text-align: center;
  font-size: 24px;
  margin: 10px;
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

const RightPanel = styled.div`
  height:100%;
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
  justify-content:flex-start;
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
  teams:any;
  view:string;
}

const Team: React.FC<Props> = (props) => {
  let { view,teams,dark, league, team, player, pagetype, teamName } = props;
  const router = useRouter();
  const teamPlayersKey: TeamPlayersKey = { league: league || "", teamid: team || "" };
  const players = useSWR(teamPlayersKey, getTeamPlayers).data;
  if(!view||view=="home")
    view="mentions";
  const PlayersNav = players?.map((p: { name: string, findex: string, mentions: string }) => {
    return p.name == player ? <SelectedSidePlayer><Link href={`/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>{p.name} ({`${p.mentions}`})</Link></SelectedSidePlayer> : <SidePlayer><Link href={`/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>{p.name} ({`${p.mentions || 0}`})</Link></SidePlayer>
  });
  console.log("Team",view,team,pagetype);
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
      {pagetype=="team"&&<SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> },{ name: "Mentions", icon: <MentionIcon /> },{name:"Players",icon:<PlayerIcon/>}]} onChange={(option: any) => { console.log(option);router.replace(`/league/${league}/team/${team}?view=${encodeURIComponent(option.name)}`) }} selectedOptionName={view} />}
      {pagetype=="player"&&<SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> },{ name: "Mentions", icon: <MentionIcon /> },{name:"Players",icon:<PlayerIcon/>}]} onChange={(option: any) => { console.log(option);router.replace(`/league/${league}/team/${team}/player/${player}?view=${encodeURIComponent(option.name)}`) }} selectedOptionName={view} />}
        {view=='teams'&&teams}   
        {view=='mentions'&&pagetype == "team" && <TeamDetails {...props} />}
        {view=='mentions'&&pagetype == "player" && <PlayerDetails {...props} />}
        {view=='players'&&
         <MobilePlayersPanel>
          <MobileTeamName>{teamName}</MobileTeamName>
          {PlayersNav}
          </MobilePlayersPanel>}
      </MainMobilePanel>
    </div>
  );
};

export default Team;