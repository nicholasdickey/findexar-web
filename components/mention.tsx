import React, { useEffect } from "react";
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link';
import { SignInButton, RedirectToSignIn } from "@clerk/nextjs";
import { styled } from "styled-components";
import { RWebShare } from "react-web-share";
import { MetaLinkKey, getMetaLink, addFavorite, removeFavorite, recordEvent } from '@/lib/api';
import { convertToUTCDateString, convertToReadableLocalTime } from "@/lib/date-convert";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import IosShareIcon from '@mui/icons-material/IosShare';

declare global {
    interface Window {
        Clerk: any;
    }
}


interface MentionsProps {
    hideit: boolean;
}
const MentionWrap = styled.div<MentionsProps>`
    width:100%;
    min-height:100px;
    background-color: var(--mention-border);
    //display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-left:8px;
    margin-top:20px;
    color:var(--text);
    z-index:200;
    font-size: 16px;
    &:hover{
           // background-color:var(--mention-high-bg);
            color: var(--mention-text);
        } 
   
    a{
        //font-size: 16px;
        color:var(--mention-text);
        text-decoration: none;
        &:hover{
           // background-color:var(--mention-high-bg);
           color: var(--mention-text);
        }   
    }
    display:${props => props.hideit ? 'none' : 'flex'};
    @media screen and (max-width: 1199px) {
    display: none;
  }
`;
const MobileMentionWrap = styled.div<MentionsProps>`
   // flex-grow:1;
    min-height:100px;
    display:${props => props.hideit ? 'none' : 'flex'};
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top:2px;
    margin-bottom:10px;
    margin-left:2px;
    margin-right:2px;
    color:var(--text);
    &:hover{
           // background-color:var(--mention-high-bg);
            color: var(--mention-text);
        } 
    a{
        //font-size: 16px;
        color:var(--mention-text);
        text-decoration: none;
        &:hover{
           // background-color:var(--mention-high-bg);
           color: var(--mention-text);
        }   
    }
    @media screen and (min-width: 1200px) {
        display: none;
  }
`;


const MentionFindex = styled.div`
    //width:100%;
    width:20px;
    height:100%;
    padding-left:12px;
    //height:100%;
    //margin-right:20px;
    //margin-top:40px;
    font-size: 38px;
    //padding-top:20px;
    //background-color: #fff;
    border-radius: 30px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    @media screen and (max-width: 1199px) {
        display: none;
  }
`;
const MentionSummary = styled.div`
    width:100%;
    padding-right:20px;
    margin-left:20px;
    font-size: 18px;
    padding-left:10px;
    padding-right:10px;
   // background-color: #eee;
    background-color: var(--mention-bg); 
   &:hover{
        background-color:var(--mention-high-bg);// #ddd;
        //color:var(--highlight);
    } 
    border-radius: 0px 5px 5px 0px;
    @media screen and (max-width: 1199px) {
       margin:1px;
  }
`;



const Icon = styled.span`
    color:var(--mention-text);
    font-size: 38px !important;
    opacity:0.6;
   // width:20px;
    height:48px;
    margin-top:10px;
   // margin-bottom:-20px;
    cursor:pointer;
    &:hover{
        opacity:0.9;
        color: var(--highlight);
    }
`;
const MobileIcon = styled.span`
    color:var(--mention-text);
    font-size: 48px;
    opacity:0.7;
   // margin-top:-20px;
   margin-bottom:-20px;
    cursor:pointer;
    &:hover{
            color: var(--highlight);
    }
`;
const MobileIconContainer = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    align-items:flex-start;
    margin-bottom:20px;
    width:100%;
`;

const ExtendedMention = styled.div`
    margin:20px;
    border-radius: 10px;
    font-size: 14px;
    padding:20px;
    background-color:var(--background);
    &:hover{
            background-color: var(--background)
    } 
    display:flex;
    flex-direction:column;
`;
const MobileExtendedMention = styled.div`
    //padding-right:20px;
    margin-top:20px;
    border-radius: 20px;
    font-size: 14px;
    padding:20px;
    background-color:var(--background);
    &:hover{
            background-color: var(--background)
    }
    display:flex;
    flex-direction:column;
`;

const Body = styled.div`
    font-size: 18px;
    margin-bottom: 14px;
    //display: flex;
    //flex-direction: row;
    flex: 2 1 auto;
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Digest = styled.div`
    font-size: 18px;
    //margin-left: 20px;
    //margin-right: 20px;
`;
const ArticleDigest = styled.div`
    font-size: 24px;
    padding-top:10px;
   // margin-bottom:-20px;
    //margin-left: 20px;
    //margin-right: 20px;
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
   //width: 200px;
   // max-width:10%;
    width:100%;
    height: auto;
    object-fit: cover;
    margin-bottom: 20px;
   /* @media (min-width: 1200px){
        width:200px;
    }*/
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
  //  flex-direction: row;
   // justify-content: flex-start;
    align-items:flex-start;
    flex-wrap: wrap;
   
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
    //text-align:right; 
    height:30px;
    margin-bottom:-20px;
`;
const ShareContainer = styled.div`
    font-size: 28x;  
    //text-align:right; 
    height:38px;
    //margin-bottom:-20px;
    opacity:0.6;
        :hover{
        opacity:1;
        color: var(--highlight);
    }
`;
const BottomLine = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-end;
    margin-top:-20px;
    //margin-bottom:-20px;
    width:100%;
`;
const LocalDate = styled.div`
    font-size: 12px;
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
    linkType:string;
    startExtended?: boolean;
}

const Mention: React.FC<Props> = ({ startExtended,linkType,tp, sessionid, params, noUser, league, type, team, teamName, name, date, url, findex, summary, findexarxid, fav, setLocalPageType, setLocalPlayer, setLocalLeague, setLocalTeam, mutate }) => {
    const [expanded, setExpanded] = React.useState(startExtended);
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(date));
    const [localFav, setLocalFav] = React.useState(fav);
    const [hide, setHide] = React.useState(false);
    const [signin, setSignin] = React.useState(false);
    
   // console.log("Mention, extended:", { startExtended, expanded })
    
    useEffect(() => {
        console.log("Mention, extended:", "useEffect",startExtended,expanded)
        setExpanded(startExtended );
    },[startExtended]);

    /*useEffect(() => {
        setExpanded(false);
    }, [summary]);
*/
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

    //console.log("mention:", { findexarxid, name, teamName, league, fav });
    //console.log("mention params:",params)
    //if(!params)
    //    tp=tp.replace(/&/g,'?');
   // console.log("tp=", tp)
    const shareUrl = "https://findexar.com" + (type == 'person' ? `/pub/league/${league}/team/${team}/player/${name}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}` : `/pub/league/${league}/team/${team}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}`);
    let localUrl ="";// (type == 'person' ? `/pub/league/${league}/team/${team}/player/${name}${params}${tp}` : `/pub/league/${league}/team/${team}${params}${tp}`) /*: url*/;
   //if(linkType=="final"){
        localUrl=(type == 'person' ? `/pub/league/${league}/team/${team}/player/${name}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}` : `/pub/league/${league}/team/${team}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}`)
       // localUrl.replace("https://findexar.com/","/");
    //} 
   /* if(!localUrl)
        localUrl="";*/
   // console.log("localUrl=", localUrl)
    const mentionsKey: MetaLinkKey = { func: "meta", findexarxid,long:startExtended?1:1 };
    const meta = useSWRImmutable(mentionsKey, getMetaLink).data;
    let digest = meta?.digest||"";//meta ? meta.digest.replace('<p>', '').replace('</p>', '') : "";
    // console.log("expanded:", {findexarxid,expanded, meta,fav});
    //console.log("MENTION", { url, localUrl, shareUrl })
    useEffect(() => {
        try {
            setLocalDate(convertToReadableLocalTime(date));
        }
        catch (x) {
            console.log("EXCEPTION CONVERTING DATE");
        }
    }, [date])
    const onMentionNav = async (name: string) => {
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
    }
    const enableRedirect = () => {
        if (window && window.Clerk) {
            const Clerk = window.Clerk;
            const user = Clerk.user;
            const id = Clerk.user?.id;
            if (!id) {
                setSignin(true);
                return;
            }
        }
    }
    const onExtended = async (on: boolean) => {

        await recordEvent(sessionid as string || "",
            'mention-extended',
            `{"on":"${on}","params":"${params}"}`
        );
    }
    const onHover = (label: string) => {
        try {
            //setLoading(true);
            recordEvent(sessionid as string || "", `mention-hover`, `{"label","${label}","params":"${params}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }
    }
    const onShare = (url: string) => {
        try {
            //setLoading(true);
            recordEvent(sessionid as string || "", `mention-share`, `{"url","${url}","params":"${params}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }
    }
    //console.log("startExtended",startExtended )
    return (
        <>
            <MentionWrap hideit={hide} onMouseEnter={() => onHover('desktop')}>
                <MentionSummary>
                    <div>
                        <Topline><LocalDate><i>{localDate}</i></LocalDate>
                            {!localFav ? noUser ? <SignInButton><StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate() }} style={{ color: "#888" }} /></SignInButton> : <StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /> : <StarIcon onClick={() => { if (noUser) return; setLocalFav(0); removeFavorite({ findexarxid }); mutate(); }} style={{ color: "FFA000" }} />}</Topline>

                        <Link scroll={linkType=='final'?false:true} href={localUrl} onClick={async () => { await onMentionNav(name) }} shallow>
                            {summary}
                        </Link>
                        <hr />
                        <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""} {league} </Atmention>
                        <Atmention2>{meta?.site_name}</Atmention2>
                    </div>
                    <BottomLine>
                        <RWebShare
                            data={{
                                text: summary,
                                url: shareUrl,
                                title: "Findexar",
                            }}
                            onClick={async () => await onShare(url)}
                        >
                            <ShareContainer><IosShareIcon /></ShareContainer>
                        </RWebShare>
                        <Icon onClick={
                            async (e) => {
                                const ne = !expanded
                                setExpanded(ne);
                                await onExtended(ne);
                            }}
                            className="material-icons-outlined">{!expanded ? "expand_more" : "expand_less"}</Icon>
                    </BottomLine>
                  
                    {expanded && meta && <Link href={url}><ExtendedMention>
                        <Title>{meta.title}</Title>
                        <Byline>
                            {meta.authors && <Authors>{meta.authors}</Authors>}
                            <SiteName>{meta.site_name}</SiteName>
                        </Byline>
                        <HorizontalContainer>
                            <ImageWrapper><Image src={meta.image} alt={meta.title} /></ImageWrapper>
                            <Body>
                            <ArticleDigest>
                            {true?'Article Digest:':'Short Digest:'}
                            </ArticleDigest>
                                <Digest>
                               <div dangerouslySetInnerHTML={{ __html: digest }}></div> 
                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        {meta.url.substring(0, 50)}...
                    </ExtendedMention></Link>}
                </MentionSummary>
            </MentionWrap>
            <MobileMentionWrap hideit={hide} onMouseEnter={() => onHover('mobile')}>


                <MentionSummary>

                    <div>
                        <Topline><LocalDate><b><i>{localDate}</i></b></LocalDate>{!localFav ? noUser ? <SignInButton><StarOutlineIcon onClick={() => { if (noUser) return; enableRedirect(); setLocalFav(1); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /></SignInButton> : <StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /> : <StarIcon onClick={() => { if (noUser) return; setLocalFav(0); removeFavorite({ findexarxid }); mutate(); }} style={{ color: "FFA000" }} />}</Topline>

                        <Link  scroll={linkType=='final'?false:true} href={localUrl} onClick={async () => { await onMentionNav(name) }}>
                            {summary}
                        </Link>
                        <hr />
                        <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""}  {league}</Atmention>
                        <MobileAtmention2>{meta?.site_name}</MobileAtmention2>
                    </div>
                    <BottomLine>
                        <RWebShare
                            data={{
                                text: summary,
                                url: shareUrl,
                                title: "Findexar",
                            }}
                            onClick={async () => onShare(url)}
                        >
                            <ShareContainer><IosShareIcon /></ShareContainer>
                        </RWebShare>
                        <Icon onClick={
                            async (e) => {
                                const ne = !expanded;
                                setExpanded(ne);
                                await onExtended(ne);
                            }}
                            className="material-icons-outlined">{!expanded ? "expand_more" : "expand_less"}</Icon>
                    </BottomLine>
                    {expanded && meta && <Link href={url}><MobileExtendedMention>
                        <Title>{meta.title}</Title>
                        <Byline>
                            {meta.authors && <Authors>{meta.authors}</Authors>}
                            <SiteName>{meta.site_name}</SiteName>
                        </Byline>
                        <HorizontalContainer>
                            <ImageWrapper><Image src={meta.image} width={100} height={100} alt={meta.title} /></ImageWrapper>
                            <Body>
                            <ArticleDigest>
                            {true?'Article Digest:':'Short Digest:'}
                            </ArticleDigest>
                                <Digest>
                                <div dangerouslySetInnerHTML={{ __html: digest }}></div> 
                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        {meta.url.substring(0, 30)}...
                    </MobileExtendedMention>
                    </Link>}
                </MentionSummary>
            </MobileMentionWrap>
        </>
    );
};

export default Mention;