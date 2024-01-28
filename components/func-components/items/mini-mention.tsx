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
    //min-height:100px;
    background-color: var(--mention-bg);//var(--mention-border);
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    margin:4px;
    padding-left:16px;
    //border: 1px solid #ccc;
    //border-radius: 5px;
   // margin-left:8px;
    //margin-top:20px;
   // padding-left:4px;
    //padding-right:4px;
    //padding-top:4px;
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
    //min-height:100px;
    width:100%;
    display:${props => props.hideit ? 'none' : 'flex'};
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    margin:4px;
    padding-left:16px;
    
   /* border: 1px solid #ccc;
    border-radius: 5px;
    margin-top:2px;
    margin-bottom:10px;
    color:var(--text);*/
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
    //border-radius: 30px;
    //font-size: 15px;
   // padding-left:10px;
    //padding-right:10px;
    background-color: var(--mention-bg); 
   &:hover{
        background-color:var(--mention-high-bg);
    } 
    border-radius: 5px 5px 5px 5px;
    @media screen and (max-width: 1199px) {
       margin:0px;
  }
`;

const Icon = styled.span`
    color:var(--mention-text);
    font-size: 38px !important;
    opacity:0.6;
    height:48px;
    margin-top:10px;
    cursor:pointer;
    &:hover{
        opacity:0.9;
        color: var(--highlight);
    }
`;

const ExtendedMention = styled.div`
    margin:20px;
    border-radius: 10px;
    font-size: 15px;
    padding:20px;
    background-color:var(--background);
    &:hover{
            background-color: var(--background)
    } 
    display:flex;
    flex-direction:column;
    a{
        font-size:15px !important;
      
    }
`;

const MobileExtendedMention = styled.div`
    margin-top:10px;
    margin-bottom:10px;
    border-radius: 10px;
    font-size: 15px;
    padding:12px;
    background-color:var(--background);
    &:hover{
            background-color: var(--background)
    }
    display:flex;
    flex-direction:column;
    a{
        font-size:15px !important;
      
    }
`;

const Body = styled.div`
    font-size: 15px;
    margin-bottom: 14px;
    flex: 2 1 auto;
    line-height:1.4;
    a{
        font-size:15px !important;
      
    }
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Digest = styled.div`
    font-size: 15px;
`;

const ArticleDigest = styled.div`
    font-size: 18px;
    padding-top:10px;
`;

const ImageWrapper = styled.div`
    margin-top:20px;
    flex: 1 1 auto;
    max-width: 100%;
`;

const Topline = styled.div`
    display:flex;
    min-height:24px;
    flex-direction:row;
    justify-content :space-between ;
    align-items:center;
    margin-bottom:4px; 
`;

const Image = styled.img`
    width:100%;
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
    align-items:flex-start;
    flex-wrap: wrap;   
    a{
        font-size:15px !important;     
    }
`;

const Atmention = styled.div`
    font-size: 13px;   
`;

const Atmention2 = styled.div`
    font-size: 13px;  
    text-align:right; 
    height:30px;
`;

const MobileAtmention2 = styled.div`
    font-size: 13px;  
    height:30px;
    margin-bottom:-20px;
`;

const ShareContainer = styled.div`
    font-size: 28x;  
    height:38px;
    opacity:0.6;
    cursor:pointer;
    color:var(--mention-text);
    :hover{
        opacity:1;
        color: var(--highlight);
    }
    :hover:active{
        opacity:1;
        color:var(--highlight);
    }
`;

const ShareContainerInline = styled.span`
    font-size: 28x;  
    height:38px;
    opacity:0.6;
    cursor:pointer;
    margin-left:10px;
    color:var(--mention-text);
    :hover{
        opacity:1;
        color: var(--highlight);
    }
    :hover:active{
        opacity:1;
        color:var(--highlight);
    }
`;

const ShareGroup = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-start;
    width:78px;
    height:40px;
    margin-top:10px;
`;

const BottomLine = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-end;
    margin-top:-20px;
    width:100%;
`;

const LocalDate = styled.div`
    font-size: 12px;
`;

const SummaryWrap = styled.div`
    display:inline;
    line-height: 1.2;
    font-size:15px !important;
    a{
        font-size:15px !important;
      
    }
`;

const ShareIcon=styled.div`
    margin-top:-1px;
    padding-bottom:4px;
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
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(date));
    const [localFav, setLocalFav] = React.useState(fav);
    const [hide, setHide] = React.useState(false);
    const [signin, setSignin] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [digestCopied, setDigestCopied] = React.useState(false);
    const [value, copy] = useCopyToClipboard();
    const theme = useTheme();
   
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
        setLocalFav(fav);
    }, [fav]);

    useEffect(() => {
        if (!summary || summary.length < 6 || !date || !url) {
            setHide(true);
            mutate();
        }
        if (summary && summary.length > 6 && date && url) {
            setHide(false);
        }
    }, [summary, mutate, date, url]);
    
    //prepare urls:
    const prepName = name.replaceAll(' ', '_');
    const shareUrl = (type == 'person' ? `${process.env.NEXT_PUBLIC_SERVER}pub/league/${league}/team/${encodeURIComponent(team)}/player/${encodeURIComponent(prepName)}?id=${findexarxid}&utm_content=sharelink` : `/pub/league/${league}/team/${encodeURIComponent(team)}?id=${findexarxid}&utm_content=sharelink`);
    const twitterShareUrl = "https://www.findexar.com/" + (type == 'person' ? `pub/league/${league}/team/${encodeURIComponent(team)}/player/${encodeURIComponent(prepName)}?id=${findexarxid}&utm_content=xlink` : `/pub/league/${league}/team/${encodeURIComponent(team)}?id=${findexarxid}&utm_content=xlink`);
    const fbShareUrl = "https://www.findexar.com/" + (type == 'person' ? `pub/league/${league}/team/${encodeURIComponent(team)}/player/${encodeURIComponent(prepName)}?id=${findexarxid}&utm_content=fblink` : `/pub/league/${league}/team/${encodeURIComponent(team)}?id=${findexarxid}&utm_content=fblink`);
    let localUrl = "";
    localUrl = type == 'person' ? `/pub/league/${league}/team/${team}/player/${prepName}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}` : `/pub/league/${league}/team/${team}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}`
    const bottomLink = type == 'person' ? `/pub/league/${league}/team/${team}/player/${prepName}${params}${tp}` : `/pub/league/${league}/team/${team}${params}${tp}`;
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary.substring(0, 230) + '...')}&url=${twitterShareUrl}&via=findexar`;
    const fbLink = `https://www.facebook.com/sharer.php?kid_directed_site=0&sdk=joey&u=${encodeURIComponent(fbShareUrl)}&t=${encodeURIComponent('Findexar')}&quote=${encodeURIComponent(summary.substring(0, 140) + '...')}&hashtag=%23findexar&display=popup&ref=plugin&src=share_button`;
    const tgLink = "https://www.findexar.com" + localUrl;
    const mentionsKey: MetaLinkKey = { func: "meta", findexarxid, long: startExtended ? 1 : 1 };
    const meta = useSWRImmutable(mentionsKey, getMetaLink).data;
    let digest = meta?.digest || "";

    useEffect(() => {
        try {
            setLocalDate(convertToReadableLocalTime(date));
        }
        catch (x) {
            console.log("EXCEPTION CONVERTING DATE");
        }
    }, [date])

    const onMentionNav = useCallback(async (name: string) => {
        setLocalLeague(league);
        setLocalTeam(team);
        setLocalPlayer(type == 'person' ? name : '');
        if (type == 'person')
            setLocalPageType('player');
        else
            setLocalPageType('team');
        await recordEvent(sessionid as string || "",
            'mention-nav',
            `{"params":"${params}","name":"${name}","sessionid":"${sessionid}"}`
        );
    },[league,team,type,params,sessionid]);

    const enableRedirect = useCallback(() => {
        if (window && window.Clerk) {
            const Clerk = window.Clerk;
            const user = Clerk.user;
            const id = Clerk.user?.id;
            if (!id) {
                setSignin(true);
                return;
            }
        }
    },[]);

    const onExtended =useCallback( async (on: boolean) => {

        await recordEvent(sessionid as string || "",
            'mention-extended',
            `{"on":"${on}","params":"${params}"}`
        );
    },[sessionid,params]);

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

    const onShare = useCallback((url: string) => {
        try {
            recordEvent(sessionid as string || "", `mention-share`, `{"url","${url}","params":"${params}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }
    },[sessionid,params]);

    const onCopyClick = useCallback(() => {
        setCopied(true);
        copy(summary);
    },[summary]);

    const onDigestCopyClick = useCallback(() => {
        setDigestCopied(true);
        copy(digest);
    },[digest]);

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
            {selectedXid==findexarxid&& <InnerMention><Mention startExtended={false} mention={{league,type,team,teamName,name,date,url,summary,findexarxid,fav}}  mutate={mutate}  /></InnerMention>}  
       
        </>
    );
};

export default MiniMention;