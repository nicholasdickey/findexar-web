import React, { useEffect } from "react";
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link';
//import Image from 'next/image'
import { styled } from "styled-components";
import { MentionsKey, getMentions, MetaLinkKey, getMetaLink } from '@/lib/api';
import { convertToUTCDateString,convertToReadableLocalTime } from "@/lib/date-convert";


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
          color: #040404;
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

const MentionWrap = styled.div`
    min-height:100px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    //border: 1px solid #ccc;
    margin-right:40px;
    margin-top:20px;
    a{
        font-size: 12px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #111;
        }   
    }
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
const Icon = styled.span`
    color: #555;
    font-size: 28px;
   // margin-right:10px;
   // margin-left:10px;
   margin-top:10px;
   cursor:pointer;
    &:hover{
            color: #F00;
    }
`;
const ExtandedMention = styled.div`
 //width:100%;
    padding-right:20px;
    margin:20px;
    border-radius: 20px;
    font-size: 14px;
    padding:20px;

    background-color: #eed;
    &:hover{
            background-color: #bbc;
    } 
    display:flex;
    flex-direction:column;
`;
const Body = styled.div`
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;

`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;
const Digest = styled.div`
    font-size: 14px;
    margin-left: 20px;
    margin-right: 20px;
`;
const Image= styled.img`
    width: 200px;
   // max-width:10%;
    height: auto;
    object-fit: cover;
    margin-bottom: 20px;
`;
const Authors = styled.div`
    margin-right:20px;
    margin-bottom: 10px;
`;
const SiteName = styled.div`
    margin-right:20px;
  
    margin-bottom: 10px;
`;
const Byline = styled.div`
    font-size: 15px;  
    width:100%;
    display: flex;
    justify-content: flex-start;
`;
const HorizontalContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
`;
const Atmention= styled.div`
    font-size: 12px;   
`;

const LocalDate= styled.div`
    font-size: 12px;
`;

interface Props {
    mentionType:string;
    league: string;
    type: string;
    team: string;
    name: string;
    date: string;
    url: string;
    findex: string;
    summary: string;
    xid: string
}

const Mention: React.FC<Props> =  ({ mentionType,league, type, team, name, date, url, findex, summary, xid }) => {
   // console.log("XID:", xid)
    const [expanded, setExpanded] = React.useState(false);
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(date));

    let localUrl = mentionType=="top"?(type == 'person' ? `/league/${league}/team/${team}/player/${name}` : `/league/${league}/team/${team}`):url;
    const mentionsKey: MetaLinkKey = { func: "meta", xid };
    const meta =  useSWRImmutable(mentionsKey, getMetaLink).data;
    let digest=meta?meta.digest.replace('<p>','').replace('</p>',''):"";
    useEffect(() => {
        setLocalDate(convertToReadableLocalTime(date));
    },[date])
    return (
        <MentionWrap>
            <MentionFindex>
               {false&&<span> F: {findex}</span>}
                <br />
                {mentionType=="top1"&&<span>{league}</span>}
                <br />
                <Icon onClick={
                    async (e) => {     
                        setExpanded(!expanded);
                    }}
                    className="material-icons-outlined">expand_more</Icon>
            </MentionFindex>
            <Link href={localUrl}>
                <MentionSummary>
                    <div>
                        <LocalDate><i>{localDate}</i></LocalDate>
                        <br />
                        {summary}
                        <hr />
                        <Atmention>@mention: {name} | Team: {team} | {league}</Atmention>
                    </div>
                    {expanded && meta && <Link href={url}><ExtandedMention>
                        <Title>{meta.title}</Title>
                        <Byline>
                               {meta.authors&&<Authors>{meta.authors}</Authors>}
                                <SiteName>{meta.site_name}</SiteName>
                            </Byline>
                        <HorizontalContainer>
                        <Image src={meta.image} width={100} height={100} alt={meta.title}/>
                        <Body>
                            <Digest>
                                {digest}
                            </Digest>
                           
                        </Body>
                        </HorizontalContainer>
                    
                        {meta.url.substring(0, 50)}...
                    </ExtandedMention></Link>}
                </MentionSummary>
            </Link>
           
           
        </MentionWrap>
    );
};
export default Mention;