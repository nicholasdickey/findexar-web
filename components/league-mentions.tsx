import React from "react";
import useSWR from 'swr';
import { styled } from "styled-components";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { MentionsKey, getMentions,MetaLinkKey,getMetaLink } from '@/lib/api';

import Mention from "./mention";

const MentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    //width:80%;
    height:100%;
    padding-left:20px;
    padding-right:20px;
    a{
        font-size: 12px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }
    @media screen and (max-width: 1199px) {
    display: none;
  }
`;
const MobileMentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    //width:80%;
    height:100%;
    padding-left:2px;
    padding-right:2px;
    a{
        font-size: 12px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }
    @media screen and (min-width: 1200px) {
    display: none;
  }
`;

const MentionsBody = styled.div`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:flex-start;
    //padding-right:120px;
`;

const MentionsHeader = styled.div`
    padding-top:10px;
    font-size: 18px;
`;

interface Props {
    league: string;
}

const LeagueMentions: React.FC<Props> = ({ league }) => {
    const mentionsKey: MentionsKey = { func: "mentions", league };
    const {data:mentions,error,isLoading} = useSWR(mentionsKey, getMentions);
    const Mentions = mentions.map((m: any, i: number) => {
        const { league, type, team, name, date, url, findex, summary,xid } = m;
        console.log("XID:",league,name,xid)
          return (<Mention mentionType="top" league={league} type={type} team={team} name={name} date={date} url={url} findex={findex} summary={summary} xid={xid} key={`mention${i}`} />)
    });         
    if(isLoading) return (<Stack spacing={1}>
        <Skeleton variant="rounded" animation="pulse" height={160} />
         <Skeleton variant="rounded" animation="pulse" height={80} />
         <Skeleton variant="rounded" animation="pulse" height={120} />
         <Skeleton variant="rounded" animation="pulse" height={160} />
       </Stack>)
    return (
        <>
            <MentionsOuterContainer>
                <MentionsHeader>Latest Mentions:</MentionsHeader>
                <MentionsBody>
                    {Mentions}
                </MentionsBody>
            </MentionsOuterContainer>
            <MobileMentionsOuterContainer>
              
                <MentionsBody>
                    {Mentions}
                </MentionsBody>
            </MobileMentionsOuterContainer>
        </>
    );
};

export default LeagueMentions;