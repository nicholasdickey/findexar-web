import React, { useState, useEffect, useCallback } from "react";
import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { TeamPlayersKey, getTeamPlayers } from '../lib/api';
import TeamDetails from "./team-details";
import PlayerDetails from "./player-details";
const SidePlayer= styled.div`
    height: 40px;
    width: 200px; 
    color: #fff;
    text-align: center;
    font-size: 14px;
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
        color: #ff8;
        text-decoration: none;
        &:hover{
          color: #F8F;
        }
    
    }
`;
const RightPanel = styled.div`
  width:300px;
  height:100%;
  min-height: 1000vh;
  background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-top:18px;
`;
const CenterPanel = styled.div`
  width:100%;
  height:100%;
 // background-color: #000000;
`;
const MainPanel = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  width:100%;
  height:100%;
 // background-color: #000000;
`;

interface Props {
  
    dark?: number;
    league?: string;
    team?: string;
    player?: string;
    pagetype?: string;
    teamName?:string;
   
  }
const Team: React.FC<Props> = (props) => {
    const { dark, league, team, player,pagetype,teamName } = props;
    const teamPlayersKey: TeamPlayersKey = {league:league||"", teamid: team || "" };
    const players = useSWR(teamPlayersKey, getTeamPlayers).data;
    const PlayersNav = players?.map((p: { name: string }) => {
        return p.name == player ? <SelectedSidePlayer><Link href={`/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>{p.name}</Link></SelectedSidePlayer> : <SidePlayer><Link href={`/league/${league}/team/${team}/player/${encodeURIComponent(p.name)}`}>{p.name}</Link></SidePlayer>
      });
  console.log("team=",team,"pagetype=",pagetype)
  return (
    <div className="team">
     
      <div className="team__members">
      <MainPanel>
            
            <CenterPanel>
            {pagetype=="team" ? <TeamDetails {...props} /> :<PlayerDetails {...props} />}
            </CenterPanel>
            <RightPanel>
              {PlayersNav}
            </RightPanel>
          </MainPanel>
      </div>
    </div>
  );
};
export default Team;