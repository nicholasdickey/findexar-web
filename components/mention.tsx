import React, { useEffect } from "react";
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link';
import { SignInButton, RedirectToSignIn } from "@clerk/nextjs";
import { styled } from "styled-components";
import { MetaLinkKey, getMetaLink, addFavorite, removeFavorite, recordEvent } from '@/lib/api';
import { convertToUTCDateString, convertToReadableLocalTime } from "@/lib/date-convert";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';


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
    padding:20px;
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
    font-size: 48px !important;
    opacity:0.6;
   // width:20px;
   // height:20px;
   // margin-top:10px;
    margin-bottom:-20px;
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
    margin-bottom: 20px;
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
const ImageWrapper = styled.div`
  flex: 1 1 auto;
  max-width: 50%;
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



const LocalDate = styled.div`
    font-size: 12px;
`;
interface Props {
    mentionType: string;
    league: string;
    type: string;
    team: string;
    teamName: string;
    name: string;
    date: string;
    url: string;
    findex: string;
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
    tp:string;
}

const Mention: React.FC<Props> = ({ tp,sessionid, params, noUser, mentionType, league, type, team, teamName, name, date, url, findex, summary, findexarxid, fav, setLocalPageType, setLocalPlayer, setLocalLeague, setLocalTeam, mutate }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(date));
    const [localFav, setLocalFav] = React.useState(fav);
    const [hide, setHide] = React.useState(false);
    const[signin,setSignin]=React.useState(false);
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
    //console.log("mention params:",params)
    //if(!params)
    //    tp=tp.replace(/&/g,'?');
    //console.log("tp=",tp    )
    let localUrl = /*mentionType == "top" ?*/ (type == 'person' ? `/pub/league/${league}/team/${team}/player/${name}${params}${tp}` : `/pub/league/${league}/team/${team}${params}${tp}`) /*: url*/;
    const mentionsKey: MetaLinkKey = { func: "meta", findexarxid };
    const meta = useSWRImmutable(mentionsKey, getMetaLink).data;
    let digest = meta ? meta.digest.replace('<p>', '').replace('</p>', '') : "";
    // console.log("expanded:", {findexarxid,expanded, meta,fav});
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
            `{"params":"${params}","name":"${name}"}`
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
    return (
        <>
            <MentionWrap hideit={hide}>
             

                <MentionSummary>

                    <div>
                        <Topline><LocalDate><i>{localDate}</i></LocalDate>{!localFav ? noUser ? <SignInButton><StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate() }} style={{ color: "#888" }} /></SignInButton> : <StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /> : <StarIcon onClick={() => { if (noUser) return; setLocalFav(0); removeFavorite({ findexarxid }); mutate(); }} style={{ color: "FFA000" }} />}</Topline>

                        <Link href={localUrl} onClick={async () => { await onMentionNav(name) }} shallow>
                            {summary}
                        </Link>
                        <hr />
                        <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""} {league} </Atmention>
                        <Atmention2>{meta?.site_name}</Atmention2>
                    </div>
                    <MobileIconContainer>
                    <Icon onClick={
                        async (e) => {
                            setExpanded(!expanded);
                        }}
                        className="material-icons-outlined">{!expanded ? "expand_more" : "expand_less"}</Icon></MobileIconContainer>
                    
                    {expanded && meta && <Link href={url}><ExtendedMention>
                        <Title>{meta.title}</Title>
                        <Byline>
                            {meta.authors && <Authors>{meta.authors}</Authors>}
                            <SiteName>{meta.site_name}</SiteName>
                        </Byline>
                        <HorizontalContainer>
                            <ImageWrapper><Image src={meta.image} alt={meta.title} /></ImageWrapper>
                            <Body>
                                <Digest>
                                    {digest}
                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        {meta.url.substring(0, 50)}...
                    </ExtendedMention></Link>}

                </MentionSummary>
            </MentionWrap>
            <MobileMentionWrap hideit={hide}>


                <MentionSummary>

                    <div>
                        <Topline><LocalDate><b><i>{localDate}</i></b></LocalDate>{!localFav ? noUser ? <SignInButton><StarOutlineIcon onClick={() => { if (noUser) return; enableRedirect(); setLocalFav(1); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /></SignInButton> : <StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /> : <StarIcon onClick={() => { if (noUser) return; setLocalFav(0); removeFavorite({ findexarxid }); mutate(); }} style={{ color: "FFA000" }} />}</Topline>

                        <Link href={localUrl} onClick={async () => { await onMentionNav(name) }}>
                            {summary}
                        </Link>
                        <hr />
                        <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""}  {league}</Atmention>
                        <MobileAtmention2>{meta?.site_name}</MobileAtmention2>

                    </div>

                    <MobileIconContainer><MobileIcon onClick={
                        async (e) => {
                            setExpanded(!expanded);
                        }}
                        className="material-icons-outlined">{!expanded ? "expand_more" : "expand_less"}</MobileIcon></MobileIconContainer>

                    {expanded && meta && <Link href={url}><MobileExtendedMention>
                        <Title>{meta.title}</Title>
                        <Byline>
                            {meta.authors && <Authors>{meta.authors}</Authors>}
                            <SiteName>{meta.site_name}</SiteName>
                        </Byline>
                        <HorizontalContainer>
                            <ImageWrapper><Image src={meta.image} width={100} height={100} alt={meta.title} /></ImageWrapper>
                            <Body>
                                <Digest>
                                    {digest}
                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        {meta.url.substring(0, 30)}...
                    </MobileExtendedMention></Link>}

                </MentionSummary>
            </MobileMentionWrap>
        </>
    );
};

export default Mention;