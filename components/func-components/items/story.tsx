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
import Mention from '@/components/mention';
import MiniMention from '@/components/mini-mention';
import { useAppContext } from '@/lib/context';

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
    width:100%;
    display:${props => props.hideit ? 'none' : 'flex'};
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top:2px;
    margin-bottom:10px;
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
    font-size: 15px;
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
   /* /width:auto; */
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
const DesktopWrap = styled.div`
    display:flex;
    flex-direction:column;
    //width:100%;
    max-width:100%;
    margin-top:20px;
    margin-bottom:20px;
    background-color:var(--mention-bg);
    padding:10px;
    a{
        font-size:15px !important;   
    }
    @media screen and (max-width: 1199px) {
        display: none;
    }
`;
const MobileWrap = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
    margin-bottom:20px;
    a{
        font-size:15px !important;
      
    }
    @media screen and (min-width: 1200px) {
        display: none;
    }
`;

const MentionsWrap = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
    margin-top:20px;
    margin-bottom:20px;
    a{
        font-size:15px !important;
      
    }
`;
interface Props {
    story:any;
}

const Story: React.FC<Props> = ({  story  }) => {
    const { mode, userId, noUser,view,tab,isMobile, setLeague, setView, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName, setTeamName } = useAppContext();

    let {title,url,digest,site_name,image,authors,createdTime,mentions}=story;
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(createdTime));
    const [signin, setSignin] = React.useState(false);
    const [digestCopied, setDigestCopied] = React.useState(false);
    const [selectedXid, setSelectedXid] = React.useState("");
    const [value, copy] = useCopyToClipboard();
    const theme = useTheme();
   
    useEffect(() => {
        setTimeout(() => {
            setDigestCopied(false);
        }
            , 2000);
    }, [digestCopied]);

   
    
    //prepare urls:

    useEffect(() => {
        try {
            setLocalDate(convertToReadableLocalTime(createdTime));
        }
        catch (x) {
            console.log("EXCEPTION CONVERTING DATE");
        }
    }, [createdTime])

    

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
            recordEvent(sessionid as string || "", `mention-hover`, `{"label","${label}","params":"${params}"}`)
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

 
    const onDigestCopyClick = useCallback(() => {
        setDigestCopied(true);
        copy(digest);
    },[digest]);


    const Mentions=<MentionsWrap>{mentions&&mentions.map((mention:any,i:number)=>{
        return (
            <MiniMention key={`mention-${i}`} {...mention} params={params} tp={tp} selectedXid={selectedXid} setSelectedXid={setSelectedXid}/>
        )


    })}</MentionsWrap>;
    console.log("RENDER STORY",{story})
    return (
        <>
            <DesktopWrap> 
                        <Link href={url}>
                            <Title>{title}</Title>
                        </Link>
                        <Link href={url}>
                            <Byline>
                                {authors && <Authors>{authors}</Authors>}
                                <SiteName>{site_name}</SiteName>
                            </Byline>
                        </Link>
                        <HorizontalContainer>
                            <Link href={url}>
                                <ImageWrapper>
                                   {image&&!(image.indexOf("thestar.com/content/tncms/custom/image/f84403b8-7d76-11ee-9d02-a72a4951957f.png")>=0)&&<Image src={image} alt={title} />}
                                </ImageWrapper>
                            </Link>
                            <Body>
                                <Link href={url}  target="_blank"><ArticleDigest>
                                    {true ? 'Digest:' : 'Short Digest:'}
                                </ArticleDigest></Link>
                                <Digest>
                                    <Link href={url}  target="_blank">
                                        <div dangerouslySetInnerHTML={{ __html: digest }} />
                                    </Link>
                                    <ShareContainerInline>
                                        <ContentCopyIcon style={{ paddingTop: 6,marginTop:-10}} fontSize="small" sx={{ color: digestCopied ? 'green' : '' }} onClick={() => onDigestCopyClick()} />
                                    </ShareContainerInline>

                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        <Link href={url} target="_blank">{url.substring(0, 50)}..</Link>
                        <br/>
                        <ArticleDigest>Mentions:</ArticleDigest>
                        {Mentions}
                    </DesktopWrap>
            <MobileWrap>
                                <Link href={url}><Title>{title}</Title></Link>
                        <Link href={url}><Byline>
                            {authors && <Authors>{authors}</Authors>}
                            <SiteName>{site_name}</SiteName>
                        </Byline>
                        </Link>
                        <HorizontalContainer>
                            <Link href={url}>
                                <ImageWrapper>
                                    <Image src={image} width={100} height={100} alt={title} />
                                </ImageWrapper>
                            </Link>
                            <Body>
                                <Link href={url}><ArticleDigest>
                                    {true ? 'Article Digest:' : 'Short Digest:'}
                                </ArticleDigest>
                                </Link>
                                <Digest>
                                    <Link href={url}> <div dangerouslySetInnerHTML={{ __html: digest }} /></Link>
                                    <ShareContainerInline>
                                        <ContentCopyIcon style={{ paddingTop: 6, marginBottom: 0,marginTop:-10 }} fontSize="small" sx={{ color: digestCopied ? 'green' : '' }} onClick={() => onDigestCopyClick()} />
                                    </ShareContainerInline>
                                </Digest>
                            </Body>
                        </HorizontalContainer>
                        <Link href={url}> {url.substring(0, 30)}...</Link>
                    </MobileWrap>               
               
        </>
    );
};

export default Story;