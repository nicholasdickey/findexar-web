import React from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { styled } from "styled-components";
import { MentionsKey, getMentions } from '../lib/api';

const MentionsOuterContainer = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  width:100%;
  height:100%;
  padding-left:20px;
 // background-color: #000000;
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
 // background-color: #000000;
`;
const MeantionWrap = styled.div`
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
  //height:100%;
  //margin-right:20px;
  padding-right:20px;
 //margin-top:20px;
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

const LeagueMentions: React.FC<Props> = ({ league }) => {

    const mentionsKey: MentionsKey = { func: "mentions", league };
    console.log("mentionsKey=", mentionsKey)
    const mentions = useSWR(mentionsKey, getMentions).data;
    console.log("detmentionsReturnails=", mentions, league)

    const Mentions = mentions.map((m: any, i: number) => {
        const { league, type, team, name, date, url, findex, summary } = m;
        let localDate = convertToUTCDateString(date);
        console.log("Details date", m.date)

        let localUrl = type == 'person' ? `/league/${league}/team/${team}/player/${name}` : `/league/${league}/team/${team}`;
        console.log("localUrl", localUrl)
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