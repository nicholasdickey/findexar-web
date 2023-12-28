import React from "react";
import useSWR from 'swr';
import { styled } from "styled-components";
import { MentionsKey, getMentions,MetaLinkKey,getMetaLink } from '@/lib/api';

import Mention from "./mention";

const MentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:80%;
    height:100%;
    padding-left:20px;
    a{
        font-size: 12px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }
`;

const MentionsBody = styled.div`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:flex-start;
    padding-right:120px;
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
    const mentions = useSWR(mentionsKey, getMentions).data;
    const Mentions = mentions.map((m: any, i: number) => {
        const { league, type, team, name, date, url, findex, summary,xid } = m;
        console.log("XID:",league,name,xid)
          return (<Mention mentionType="top" league={league} type={type} team={team} name={name} date={date} url={url} findex={findex} summary={summary} xid={xid} key={`mention${i}`} />)
    });         
    
    return (
        <>
            <MentionsOuterContainer>
                <MentionsHeader>Latest Mentions:</MentionsHeader>
                <MentionsBody>
                    {Mentions}
                </MentionsBody>
            </MentionsOuterContainer>
        </>
    );
};

export default LeagueMentions;