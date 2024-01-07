import React from "react";
import useSWR from 'swr';
import { styled } from "styled-components";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { DetailsKey, getDetails } from '@/lib/api';
import Mention from "./mention";

const MainPanel = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  height:100%;
  padding-left:20px;
  @media screen and (max-width: 1199px ){
    padding-left:1px;
  } 
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
  width:100%;
  font-size: 24px;
  margin:10px;
  text-align:center;
`;

const TeamFindex = styled.div`
  margin-right:20px;
  font-size: 18px;
`;

const TeamDetailsBody = styled.div`
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  padding-right:30px;
  @media screen and (max-width: 1199px ){
    padding-right:1px;
  }
`;

interface Props {
  dark?: number;
  league?: string;
  team?: string;
  player?: string;
  pagetype?: string;
  teamName?: string;
  noUser: boolean;
  setLocalPageType: (pageType: string) => void;
  setLocalPlayer: (player: string) => void;
  setLocalLeague: (league: string) => void;
  setLocalTeam: (team: string) => void;
}

const TeamDetails: React.FC<Props> = (props) => {
  const { team, teamName, noUser, ...rest } = props;
  const detailsKey: DetailsKey = { type: "Details", teamid: team || "", name: teamName || "",noUser };
  console.log("detailsKey", detailsKey)
  const { data: details, error, isLoading,mutate } = useSWR(detailsKey, getDetails);
  /* if(isLoading) return (<Stack spacing={1}>
     <Skeleton variant="rounded" animation="pulse" height={160} />
      <Skeleton variant="rounded" animation="pulse" height={80} />
      <Skeleton variant="rounded" animation="pulse" height={120} />
      <Skeleton variant="rounded" animation="pulse" height={160} />
    </Stack>)*/
  const { mentions } = details ? details : [];

  const Details = mentions?.map((m: any, i: number) => {
    const { league, type, team, name, date, url, findex, summary, findexarxid, fav } = m;
    return (<Mention noUser={noUser} mentionType="final" league={league} type={type} team={team} name={name} date={date} url={url} findex={findex} summary={summary} findexarxid={findexarxid} fav={fav} key={`team-mention${i}`} mutate={()=>mutate()} {...rest} />)
  })

  return (
    <div className="team">
      <div className="team__members">
        {false && <TeamHeader>
          <TeamName>{teamName}  </TeamName>
        </TeamHeader>}
        <MainPanel>
          <TeamDetailsBody>
            {isLoading ? <Stack spacing={1}>
              <Skeleton variant="rounded" animation="pulse" height={160} />
              <Skeleton variant="rounded" animation="pulse" height={80} />
              <Skeleton variant="rounded" animation="pulse" height={120} />
              <Skeleton variant="rounded" animation="pulse" height={160} />
            </Stack> : Details}
          </TeamDetailsBody>
        </MainPanel>
      </div>
    </div>
  );
};

export default TeamDetails;