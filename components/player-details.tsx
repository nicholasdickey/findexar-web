import React, { useState, useEffect, useCallback } from "react";
import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { DetailsKey, getDetails } from '../lib/api';
import Team from "./team-page";


const MainPanel = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  width:100%;
  height:100%;
  padding-left:20px;
 // background-color: #000000;
`;
const TeamHeader = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  width:100%;
  height:40px;
 // background-color: #000000;
`;
const TeamName = styled.div`
  width:300px;
  //height:40px;
  font-size: 24px;
  margin:10px;
 // background-color: #000000;
`;
const TeamFindex= styled.div`
  //width:100px;
 // height:40px;
  margin-right:20px;
  font-size: 18px;
`;
const TeamDetailsBody = styled.div`
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  padding-right:120px;
 // background-color: #000000;
`;
const TeamDetailsDigest = styled.div`
  //width:100%;
  min-height:100px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items:flex-start;
 // border-radius: 15%;
  border: 1px solid #ccc;
  margin-right:40px;
  margin-top:20px;
 // background-color: #000000;
`;
const TeamDetailsFindex= styled.div`
  width:40px;
  height:100%;
  margin-right:20px;
  font-size: 18px;
  padding-left:20px;
  padding-top:20px;
  background-color: #fff;
`;
const TeamDetailsSummary= styled.div`
   width:100%;
  //height:100%;
  //margin-right:20px;
  padding-right:20px;
 //margin-top:20px;
  font-size: 18px;
  padding:20px;
  background-color: #ddd;
  a{
        font-size: 12px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #888;
        }
    
    }
`;


const MentionsHeader= styled.div`


`;
interface Props {
  
    dark?: number;
    league?: string;
    team?: string;
    player?: string;
    pagetype?: string;
    teamName?:string;
   
  }
  const convertToReadableLocalTime = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };
  const convertToUTCDateString = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(date);
};
const TeamDetails: React.FC<Props> = (props) => {
    const { dark, league, team, player,pagetype,teamName } = props;
    const detailsKey: DetailsKey = {teamid:team||"", name: player || "" };
    console.log("detailsKey=",detailsKey)
    const details = useSWR(detailsKey, getDetails).data;
    console.log("details=",details,teamName,team)
    const {mentions,currentFindex}=details;
    console.log("currentFindex=",currentFindex.avg_findex)
   
   
    const Details=mentions?.map((m:any,i:number)=>{
       const date=convertToUTCDateString(m.date);
       console.log("Details date",m.date)
        return <TeamDetailsDigest key={`det${i}`}><TeamDetailsFindex>F:{m.findex}</TeamDetailsFindex><TeamDetailsSummary><i>{date}</i><br/>{m.summary}<br/><Link href={m.url}>{m.url}</Link></TeamDetailsSummary></TeamDetailsDigest>
    } )
  return (
    <div className="team">
     
      <div className="team__members">
        <TeamHeader>
          <TeamName>{player}</TeamName>
          <TeamFindex>F Index:&nbsp;{currentFindex.avg_findex}</TeamFindex>
          <TeamFindex>Mentions:&nbsp;{currentFindex.mentions}</TeamFindex>
          </TeamHeader>
      <MainPanel>
           <MentionsHeader>Mentions:</MentionsHeader>
           <TeamDetailsBody>
            {Details}
            </TeamDetailsBody>
          </MainPanel>
      </div>
    </div>
  );
};
export default TeamDetails;