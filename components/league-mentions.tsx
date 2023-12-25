import React from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { MentionsKey, getMentions } from '@/lib/api';
import { convertToUTCDateString } from "@/lib/date-convert";

const MentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:100%;
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

const MeantionWrap = styled.div`
    min-height:100px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    border: 1px solid #ccc;
    margin-right:40px;
    margin-top:20px;
`;

const MentionFindex = styled.div`
    width:40px;
    height:100%;
    margin-right:20px;
    font-size: 18px;
    padding-left:20px;
    padding-top:20px;
    background-color: #fff;
`;
const MentionSummary = styled.div`
    width:100%;
    padding-right:20px;
 
    font-size: 18px;
    padding:20px;
    background-color: #ddd;
    &:hover{
            background-color: #ccc;
    }  
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
        const { league, type, team, name, date, url, findex, summary } = m;
        let localDate = convertToUTCDateString(date);
        let localUrl = type == 'person' ? `/league/${league}/team/${team}/player/${name}` : `/league/${league}/team/${team}`;
        return (
            <div key={`mentions${i}`}>
                <Link href={localUrl} key={`det${i}`}>
                    <MeantionWrap>
                        <MentionFindex>F:{findex}<br />{league}<br /></MentionFindex>
                        <MentionSummary>
                            <div>
                                <i>{localDate}</i>
                                <br />
                                {summary}
                                <hr />
                                @mention:{name} | Team:{team} 
                            </div>
                        </MentionSummary>
                    </MeantionWrap>
                </Link>
            </div>
        );
    })
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