import React, { useEffect,useCallback } from "react";
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link';
import { SignInButton, RedirectToSignIn } from "@clerk/nextjs";
import { styled, useTheme } from "styled-components";
import { RWebShare } from "react-web-share";
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import IosShareIcon from '@mui/icons-material/IosShare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MetaLinkKey, getMetaLink, addFavorite, removeFavorite, recordEvent } from '@/lib/api';
import { convertToUTCDateString, convertToReadableLocalTime } from "@/lib/date-convert";
import useCopyToClipboard from '@/lib/copy-to-clipboard';
import Mention from "@/components/func-components/items/mention";

declare global {
    interface Window {
        Clerk: any;
    }
}
interface MentionsProps {
    hideit?: boolean;
    noborder?: boolean;
}

const MentionWrap = styled.div<MentionsProps>`
    width:100%;
    margin-right:20px;
    position:relative;
    background-color: var(--mention-bg);//var(--mention-border);
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    margin:4px;
    padding-left:16px;
    color:var(--text);
    z-index:200;
    font-size: 16px;
    &:hover{
        background-color:var(--mention-high-bg);
        color: var(--mention-text);
        cursor:pointer;
    }   
    a{
        color:var(--mention-text);
        text-decoration: none;
        &:hover{
           color: var(--mention-text);
        }   
    }
    display:${props => props.hideit ? 'none' : 'flex'};
    @media screen and (max-width: 1199px) {
        display: none;
    }
`;

const InnerMention=styled.div`
    margin-left:20px;
    margin-top:20px;
    margin-bottom:20px;
`;

const MobileMentionWrap = styled.div<MentionsProps>` 
    width:100%;
    display:${props => props.hideit ? 'none' : 'flex'};
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    margin:4px;
    padding-left:16px;

    &:hover{
        color: var(--mention-text);
    } 
    a{
        color:var(--mention-text);
        text-decoration: none;
        &:hover{
           color: var(--mention-text);
        }   
    }
    @media screen and (min-width: 1200px) {
        display: none;
  }
`;

const MentionSummary = styled.div`
    width:100%;
    margin-right:20px;
    background-color: var(--mention-bg); 
   &:hover{
        background-color:var(--mention-high-bg);
    } 
    border-radius: 5px 5px 5px 5px;
    @media screen and (max-width: 1199px) {
       margin:0px;
  }
`;

const Atmention = styled.div`
    font-size: 13px;   
`;

interface Props {
    league: string;
    type: string;
    team: string;
    teamName: string;
    name: string;
    date: string;
    url: string;
    findex?: string;
    summary: string;
    findexarxid: string;
    fav: number;
    noUser: boolean;
    setLocalPageType: (pageType: string) => void;
    setLocalPlayer: (player: string) => void;
    setLocalLeague: (league: string) => void;
    setLocalTeam: (team: string) => void;
    mutate: () => void;
    params: string;
    sessionid: string;
    tp: string;
    linkType: string;
    startExtended?: boolean;
    selectedXid: string;
    setSelectedXid: (xid: string) => void;
}

const MiniMention: React.FC<Props> = ({ selectedXid,setSelectedXid,startExtended, linkType, tp, sessionid, params, noUser, league, type, team, teamName, name, date, url, findex, summary, findexarxid, fav, setLocalPageType, setLocalPlayer, setLocalLeague, setLocalTeam, mutate }) => {
    const [expanded, setExpanded] = React.useState(startExtended);
    const [hide, setHide] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [digestCopied, setDigestCopied] = React.useState(false);
   
    useEffect(() => {
        setExpanded(startExtended);
    }, [startExtended,url]);

    useEffect(() => {
        setTimeout(() => {
            setDigestCopied(false);
        }
            , 2000);
    }, [digestCopied]);

    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }
            , 2000);
    }, [copied]);

    useEffect(() => {
        console.log("Mention, extended:", "useEffect", startExtended, expanded)
        setExpanded(startExtended);
    }, [startExtended]);

    useEffect(() => {
        if (!summary || summary.length < 6 || !date || !url) {
            setHide(true);
            mutate();
        }
        if (summary && summary.length > 6 && date && url) {
            setHide(false);
        }
    }, [summary, mutate, date, url]);
    
    //prepare url:
    const prepName = name.replaceAll(' ', '_');
    let localUrl = "";
    localUrl = type == 'person' ? `/pub/league/${league}/team/${team}/player/${prepName}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}` : `/pub/league/${league}/team/${team}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}`
   
    const onHover = useCallback((label: string) => {
        try {
            recordEvent(sessionid as string || "", `mini-mention-hover`, `{"label","${label}","params":"${params}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }
    },[sessionid,params]);

    const openMention = useCallback(async () => {
        setSelectedXid(findexarxid);
    },[findexarxid]);

    return (
        <>
            {selectedXid!=findexarxid&& <MentionWrap onMouseEnter={() => onHover('desktop')} onClick={openMention}>
                <MentionSummary>  
                    <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""} {league}</Atmention>
                 </MentionSummary>       
            </MentionWrap>}
            <MobileMentionWrap hideit={hide} onMouseEnter={() => onHover('mobile')} onClick={openMention}>
                <MentionSummary>
                <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""}  {league}</Atmention>                         
                </MentionSummary>
            </MobileMentionWrap>
            {selectedXid==findexarxid&& <InnerMention><Mention linkType="top" mini={true} startExtended={false} mention={{league,type,team,teamName,name,date,url,summary,findexarxid,fav}}  mutate={mutate}  /></InnerMention>}       
        </>
    );
};

export default MiniMention;