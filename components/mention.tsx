import React, { useEffect } from "react";
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link';
import { styled } from "styled-components";
import { MentionsKey, getMentions, MetaLinkKey, getMetaLink,addFavorite,removeFavorite } from '@/lib/api';
import { convertToUTCDateString, convertToReadableLocalTime } from "@/lib/date-convert";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';


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
    width:100%;
    min-height:100px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    //border: 1px solid #ccc;
    //margin-right:40px;
    margin-top:20px;
    a{
        font-size: 16px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #111;
        }   
    }
    @media screen and (max-width: 1199px) {
    display: none;
  }
`;
const MobileMentionWrap = styled.div`
    width:100%;
    min-height:100px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    //border: 1px solid #ccc;
    //margin-right:40px;
    margin-top:2px;
    margin-bottom:10px;
    a{
        font-size: 16px;
        color: #222;
        text-decoration: none;
        &:hover{
          color: #111;
        }   
    }
    @media screen and (min-width: 1200px) {
    display: none;
  }
`;


const MentionFindex = styled.div`
    width:8px;
    height:100%;
    margin-right:20px;
    font-size: 18px;
    padding-top:20px;
    background-color: #fff;
`;
const MentionSummary = styled.div`
    width:100%;
    padding-right:20px;
    margin-left:0px;
    font-size: 18px;
    padding:20px;
    background-color: #eee;
    &:hover{
            background-color: #ddd;
    }  
`;

const MentionsHeader = styled.div`
    padding-top:10px;
    font-size: 18px;
`;

const Icon = styled.span`
    color: #555;
    font-size: 28px;
    margin-top:10px;
    cursor:pointer;
    &:hover{
            color: #F00;
    }
`;
const MobileIcon= styled.span`
    color:#888;
    font-size: 38px;
   // margin-top:-20px;
   margin-bottom:-20px;
    cursor:pointer;
    &:hover{
            color: #F00;
    }
`;
const MobileIconContainer= styled.div`
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    align-items:flex-start;
    width:100%;
`;

const ExtendedMention = styled.div`
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
const MobileExtendedMention = styled.div`
    //padding-right:20px;
    margin-top:20px;
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
    flex-direction:row;
    justify-content :space-between ;
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

const LocalDate = styled.div`
    font-size: 13px;
`;
interface Props {
    mentionType: string;
    league: string;
    type: string;
    team: string;
    name: string;
    date: string;
    url: string;
    findex: string;
    summary: string;
    findexarxid: string;
    fav:number;
    noUser:boolean;
}

const Mention: React.FC<Props> = ({ noUser,mentionType, league, type, team, name, date, url, findex, summary, findexarxid,fav }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [localDate, setLocalDate] = React.useState(convertToUTCDateString(date));
    const [localFav, setLocalFav] = React.useState(fav);

    useEffect(() => {

        setLocalFav(fav);
    },[fav]);

    let localUrl = /*mentionType == "top" ?*/ (type == 'person' ? `/pro/league/${league}/team/${team}/player/${name}` : `/pub/league/${league}/team/${team}`) /*: url*/;
    const mentionsKey: MetaLinkKey = { func: "meta", findexarxid};
    const meta = useSWRImmutable(mentionsKey, getMetaLink).data;
    let digest = meta ? meta.digest.replace('<p>', '').replace('</p>', '') : "";
    console.log("expanded:", {findexarxid,expanded, meta,fav});
    useEffect(() => {
        setLocalDate(convertToReadableLocalTime(date));
    }, [date])

    return (
        <>
            <MentionWrap>
                <MentionFindex>
                    {false && <span> F: {findex}</span>}
                    <br />
                    {mentionType == "top1" && <span>{league}</span>}
                    <br />
                    <Icon onClick={
                        async (e) => {
                            setExpanded(!expanded);
                        }}
                        ><ExpandMoreIcon/></Icon>
                </MentionFindex>

                <MentionSummary>
                   
                        <div>
                            <Topline><LocalDate><i>{localDate}</i></LocalDate>{localFav!=1?<StarOutlineIcon onClick={()=>{if(noUser) return; setLocalFav(1);addFavorite({findexarxid})}} style={{color: "#888"}}/>:<StarIcon onClick={()=>{if(noUser) return; setLocalFav(0);removeFavorite({findexarxid})}} style={{color:"FFA000"}}/>}</Topline>
                            <br />
                            <Link href={localUrl}>
                            {summary}
                            </Link>
                            <hr />
                            <Atmention>@mention: {name} | Team: {team} | {league}</Atmention>
                        </div>
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
            <MobileMentionWrap>


                <MentionSummary>
                <Link href={localUrl}>
                        <div>
                            <LocalDate><i>{localDate}</i></LocalDate>
                            <br />
                            {summary}
                            <hr />
                            <Atmention>@mention: {name} | Team: {team} | {league}</Atmention>

                        </div>
                    </Link>
                    <MobileIconContainer><MobileIcon onClick={
                                async (e) => {
                                    setExpanded(!expanded);
                                }}
                                className="material-icons-outlined">{!expanded?"expand_more":"expand_less"}</MobileIcon></MobileIconContainer>
                 
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