import React from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { DetailsKey, getDetails } from '@/lib/api';
import { convertToUTCDateString } from "@/lib/date-convert";
import Mention from "./mention";

const MainPanel = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
 // width:100%;
  height:100%;
  padding-left:20px;
  
`;

const TeamHeader = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  width:100%;
  height:40px;
`;

const TeamName = styled.div`
  width:300px;
  font-size: 24px;
  margin:10px;
`;

const TeamFindex = styled.div`
  margin-right:20px;
  font-size: 18px;
`;

const TeamDetailsBody = styled.div`
 // width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  padding-right:30px;
`;

const MentionsHeader = styled.div`
`;
interface Props {
  dark?: number;
  league?: string;
  team?: string;
  player?: string;
  pagetype?: string;
  teamName?: string;
}

const TeamDetails: React.FC<Props> = (props) => {
  const { team, teamName } = props;
  const detailsKey: DetailsKey = { teamid: team || "", name: teamName || "" };
  const details = useSWR(detailsKey, getDetails).data;
  const { mentions, currentFindex } = details;

  const Details = mentions?.map((m: any, i: number) => {
    const { league, type, team, name, date, url, findex, summary,xid } = m;
    return (<Mention mentionType="final" league={league} type={type} team={team} name={name} date={date} url={url} findex={findex} summary={summary} xid={xid} key={`team-mention${i}`} />)
})
  return (
    <div className="team">
      <div className="team__members">
        <TeamHeader>
          <TeamName>{teamName}</TeamName>
         {false&& <TeamFindex>F Index:&nbsp;{currentFindex.avg_findex}</TeamFindex>}
         {false&&<TeamFindex>Mentions:&nbsp;{currentFindex.mentions}</TeamFindex>}
        </TeamHeader>
        <MainPanel>
          <MentionsHeader>Mentions ({currentFindex.mentions}):</MentionsHeader>
          <TeamDetailsBody>
            {Details}
          </TeamDetailsBody>
        </MainPanel>
      </div>
    </div>
  );
};
export default TeamDetails;