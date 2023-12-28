import React from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { TeamPlayersKey, getTeamPlayers } from '@/lib/api';
import TeamDetails from "./team-details";
import PlayerDetails from "./player-details";

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

const CenterPanel = styled.div`
  height:100%;
`;

const MainPanel = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  height:100%;
`;
interface Props {
  dark?: number;
  league?: string;
  team?: string;
  player?: string;
  pagetype?: string;
  teamName?: string;
}

const Team: React.FC<Props> = (props) => {
  const { dark, league, team, player, pagetype, teamName } = props;
  const teamPlayersKey: TeamPlayersKey = { league: league || "", teamid: team || "" };
  const players = useSWR(teamPlayersKey, getTeamPlayers).data;

  const PlayersNav = players?.map((p: { name: string, findex: string, mentions: string }) => {
    return p.name == player ? <SelectedSidePlayer><Link href={`/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>{p.name} ({`${p.mentions}`})</Link></SelectedSidePlayer> : <SidePlayer><Link href={`/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>{p.name} ({`${p.mentions || 0}`})</Link></SidePlayer>
  });

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
    </div>
  );
};

export default Team;