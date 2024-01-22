import React, { useEffect } from "react";
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link';
import { SignInButton, RedirectToSignIn } from "@clerk/nextjs";
import { styled } from "styled-components";
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
import { TelegramComments } from "react-telegram-comments";

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
    min-height:100px;
    background-color: var(--mention-bg);//var(--mention-border);
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-left:8px;
    margin-top:20px;
    padding-left:4px;
    padding-right:4px;
    padding-top:4px;
    color:var(--text);
    z-index:200;
    font-size: 16px;
    &:hover{
            background-color:var(--mention-high-bg);
            color: var(--mention-text);
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

const MobileMentionWrap = styled.div<MentionsProps>` 
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
    padding-right:20px;
    border-radius: 30px;
    font-size: 18px;
    padding-left:10px;
    padding-right:10px;
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
    flex: 2 1 auto;
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Digest = styled.div`
    font-size: 18px;
`;

const ArticleDigest = styled.div`
    font-size: 24px;
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
    align-items:center;
    width:60px;
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
    /*display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    flex-wrap: wrap; 
    width:100%;*/
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
}

const Mention: React.FC<Props> = ({ startExtended, linkType, tp, sessionid, params, noUser, league, type, team, teamName, name, date, url, findex, summary, findexarxid, fav, setLocalPageType, setLocalPlayer, setLocalLeague, setLocalTeam, mutate }) => {
    const [expanded, setExpanded] = React.useState(startExtended);
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(date));
    const [localFav, setLocalFav] = React.useState(fav);
    const [hide, setHide] = React.useState(false);
    const [signin, setSignin] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [value, copy] = useCopyToClipboard();
    useEffect(() => {
        // if (content!=text) {
        setTimeout(() => {
            setCopied(false);
        }
            , 2000);
        //}
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
    const prepName = name.replaceAll(' ', '_');
    const shareUrl = (type == 'person' ? `${process.env.NEXT_PUBLIC_SERVER}pub/league/${league}/team/${encodeURIComponent(team)}/player/${encodeURIComponent(prepName)}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}&utm_content=sharelink` : `/pub/league/${league}/team/${encodeURIComponent(team)}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}&utm_content=sharelink`);
    const twitterShareUrl = "http://findexar.com/" + (type == 'person' ? `pub/league/${league}/team/${encodeURIComponent(team)}/player/${encodeURIComponent(prepName)}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}&utm_content=xlink` : `/pub/league/${league}/team/${encodeURIComponent(team)}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}&utm_content=xlink`);
    const fbShareUrl = "http://findexar.com/" + (type == 'person' ? `pub/league/${league}/team/${encodeURIComponent(team)}/player/${encodeURIComponent(prepName)}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}&utm_content=fblink` : `/pub/league/${league}/team/${encodeURIComponent(team)}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}&utm_content=fblink`);


    let localUrl = "";
    localUrl = type == 'person' ? `/pub/league/${league}/team/${team}/player/${prepName}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}` : `/pub/league/${league}/team/${team}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}`
    const bottomLink = type == 'person' ? `/pub/league/${league}/team/${team}/player/${prepName}${params}${tp}` : `/pub/league/${league}/team/${team}${params}${tp}`;
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary.substring(0, 230) + '...')}&url=${twitterShareUrl}&via=findexar`;


    const fbLink = `http://www.facebook.com/sharer.php?kid_directed_site=0&sdk=joey&u=${encodeURIComponent(fbShareUrl)}&t=${encodeURIComponent('Findexar')}&quote=${encodeURIComponent(summary.substring(0, 140) + '...')}&hashtag=%23findexar&display=popup&ref=plugin&src=share_button`;
    const tgLink="https://findexar.com"+localUrl;
    //<a class="_2vmz" href="/sharer/sharer.php?kid_directed_site=0&amp;sdk=joey&amp;u=https%3A%2F%2Ffindexar.com%2Fpub%2Fleague%2FNFL%2Fteam%2Fkansas-city-chiefs%2Fplayer%2FPatrick%2520Mahomes%3Futm_content%3Dsharelink%26tab%3Dmyteam%26id%3D44078&amp;display=popup&amp;ref=plugin&amp;src=share_button" target="_blank" id="u_0_1_kW"><div><button id="icon-button" type="submit" class="inlineBlock _2tga _89n_ _8j9v"><span class="_8f1i"></span><div class=""><span class="_3jn- inlineBlock _2v7"><span class="_3jn_"></span><span class="_49vg _8a19"><img class="img" style="vertical-align:middle" src="https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/6S2Dc9mdP9f.png" alt="" width="12" height="12"></span></span><span class="_49vh _2pi7">Share</span><span class="_5n6h _2pih" id="u_0_2_Ig">0</span></div></button></div></a>


    const mentionsKey: MetaLinkKey = { func: "meta", findexarxid, long: startExtended ? 1 : 1 };
    const meta = useSWRImmutable(mentionsKey, getMetaLink).data;
    let digest = meta?.digest || "";//meta ? meta.digest.replace('<p>', '').replace('</p>', '') : "";
    //console.log("expanded:", {findexarxid,expanded, meta,fav});
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
            recordEvent(sessionid as string || "", `mention-share`, `{"url","${url}","params":"${params}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }
    }
    const onCopyClick = () => {
        console.log("copy click")
        setCopied(true);
        copy(summary);
    }
    console.log("tgLink:",tgLink);
    return (
        <>
            <MentionWrap hideit={hide} onMouseEnter={() => onHover('desktop')}>
                <MentionSummary>
                    <Topline><LocalDate><i>{localDate}</i></LocalDate>
                        {!localFav ? noUser ? <SignInButton><StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate() }} style={{ color: "#888" }} /></SignInButton> : <StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /> : <StarIcon onClick={() => { if (noUser) return; setLocalFav(0); removeFavorite({ findexarxid }); mutate(); }} style={{ color: "FFA000" }} />}</Topline>

                    <SummaryWrap><Link scroll={linkType == 'final' ? false : true} href={localUrl} onClick={async () => { await onMentionNav(name) }} shallow>
                        {summary}
                    </Link>
                    <ShareContainerInline><ContentCopyIcon fontSize="small" sx={{ color: copied ? 'green' : '' }} onClick={() => onCopyClick()} /></ShareContainerInline>
                    </SummaryWrap>
                    <hr />
                    <Atmention><Link href={bottomLink}><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""} {league} </Link></Atmention>
                    <Atmention2>{meta?.site_name}</Atmention2>
                    <BottomLine>
                        <ShareGroup><RWebShare
                            data={{
                                text: summary,
                                url: shareUrl,
                                title: "Findexar",
                            }}
                            onClick={async () => await onShare(url)}
                        >
                            <ShareContainer><IosShareIcon /></ShareContainer>
                        </RWebShare>
                            <Link href={twitterLink} passHref><ShareContainer><XIcon /></ShareContainer></Link>
                            <Link href={fbLink} passHref><ShareContainer><FacebookIcon /></ShareContainer></Link>
                        </ShareGroup>
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
                                    {true ? 'Article Digest:' : 'Short Digest:'}
                                </ArticleDigest>
                                <Digest>
                                    <div dangerouslySetInnerHTML={{ __html: digest }}></div>
                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        {meta.url.substring(0, 50)}...
                        <TelegramComments
                        commentsNumber={3}
                        containerClassName="awesome-comments"
                        customColor="663399"
                        customHeight={250}
                        //isDark={true}
                        onLoad={() => console.log("Comments loaded!")}
                        pageId={tgLink}
                        //showColorfulNames
                        //showDislikes
                        showIconOutlines
                        websiteKey={"2tZ-G5G6"}
                        wrapperClassName="awesome-comments__wrapper"
                    />
                    </ExtendedMention></Link>}
                </MentionSummary>
            </MentionWrap>
            <MobileMentionWrap hideit={hide} onMouseEnter={() => onHover('mobile')}>
                <MentionSummary>
                    <div>
                        <Topline><LocalDate><b><i>{localDate}</i></b></LocalDate>{!localFav ? noUser ? <SignInButton><StarOutlineIcon onClick={() => { if (noUser) return; enableRedirect(); setLocalFav(1); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /></SignInButton> : <StarOutlineIcon onClick={() => { if (noUser) return; setLocalFav(1); enableRedirect(); addFavorite({ findexarxid }); mutate(); }} style={{ color: "#888" }} /> : <StarIcon onClick={() => { if (noUser) return; setLocalFav(0); removeFavorite({ findexarxid }); mutate(); }} style={{ color: "FFA000" }} />}</Topline>
                        <SummaryWrap><Link scroll={linkType == 'final' ? false : true} href={localUrl} onClick={async () => { await onMentionNav(name) }} shallow>
                            {summary}
                        </Link>
                        <ShareContainerInline><ContentCopyIcon fontSize="small" sx={{ color: copied ? 'green' : '' }} onClick={() => onCopyClick()} /></ShareContainerInline>
                        </SummaryWrap>
                        <hr />
                        <Atmention><b>{(type == "person") && '@'}{name}</b> | {type == "person" ? `${teamName} |` : ""}  {league}</Atmention>
                        <MobileAtmention2>{meta?.site_name}</MobileAtmention2>
                    </div>
                    <BottomLine>
                        <ShareGroup><RWebShare
                            data={{
                                text: summary,
                                url: shareUrl,
                                title: "Findexar",
                            }}
                            onClick={async () => onShare(url)}
                        >
                            <ShareContainer><IosShareIcon /></ShareContainer>
                        </RWebShare>
                            <Link href={twitterLink} passHref><ShareContainer><XIcon /></ShareContainer></Link>
                            <Link href={fbLink} passHref><ShareContainer><FacebookIcon /></ShareContainer></Link>

                        </ShareGroup>
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
                                    {true ? 'Article Digest:' : 'Short Digest:'}
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