import React from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { DetailsKey, getDetails } from '@/lib/api';
import { convertToUTCDateString } from "@/lib/date-convert";

const MainPanel = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  width:100%;
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
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  padding-right:120px;
`;

const TeamDetailsDigest = styled.div`
  min-height:100px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items:flex-start;
  border: 1px solid #ccc;
  margin-right:40px;
  margin-top:20px;
`;

const TeamDetailsFindex = styled.div`
  width:40px;
  height:100%;
  margin-right:20px;
  font-size: 18px;
  padding-left:20px;
  padding-top:20px;
  background-color: #fff;
`;

const TeamDetailsSummary = styled.div`
  width:100%;
  padding-right:20px;
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
    const date = convertToUTCDateString(m.date);
    return <TeamDetailsDigest key={`det${i}`}><TeamDetailsFindex>F:{m.findex}</TeamDetailsFindex><TeamDetailsSummary><i>{date}</i><br />{m.summary}<br /><Link href={m.url}>{m.url}</Link></TeamDetailsSummary></TeamDetailsDigest>
  })
  return (
    <div className="team">
      <div className="team__members">
        <TeamHeader>
          <TeamName>{teamName}</TeamName>
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