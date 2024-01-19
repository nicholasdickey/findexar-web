import React, { useEffect } from "react";
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { styled } from "styled-components";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DetailsKey, getDetails, FetchedMentionsKey, fetchMentions } from '@/lib/api';
import Mention from "./mention";

const LoadMore = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items:center;
    font-size:18px;
    padding-bottom:140px;
`;
const MainPanel = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  height:100%;
  min-width:100%;
  //padding-left:20px;
  @media screen and (max-width: 1199px ){
    padding-left:1px;
  } 
`;

const TeamHeader = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  width:100%;
  height:40px;
`;

const TeamName = styled.div`
  width:100%;
  font-size: 24px;
  margin:10px;
  text-align:center;
`;

const TeamFindex = styled.div`
  margin-right:20px;
  font-size: 18px;
`;

const TeamDetailsBody = styled.div`
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  padding-right:30px;
  padding-left:30px;
  @media screen and (max-width: 1199px ){
    padding-right:0px;
    padding-left:0px;
  }
`;

interface Props {
    dark?: number;
    league?: string;
    team?: string;
    player?: string;
    pagetype?: string;
    teamName?: string;
    noUser: boolean;
    setLocalPageType: (pageType: string) => void;
    setLocalPlayer: (player: string) => void;
    setLocalLeague: (league: string) => void;
    setLocalTeam: (team: string) => void;
    params:string;
    sessionid:string;
    tp:string;//tab &params
    tp2:string; //tab &params2
    findexarxid:string;
   
}

const TeamPlayerMentions: React.FC<Props> = (props) => {
    const { findexarxid,tp,league, team, teamName, noUser, player, ...rest } = props;
   // const [localTeam, setLocalTeam] = React.useState(team);
   // const [localPlayer, setLocalPlayer] = React.useState(player);

    console.log("teamPlayerMentions", {team, teamName, player,noUser})
    const fetchMentionsKey = (pageIndex: number, previousPageData: any): FetchedMentionsKey | null => {
       // console.log("getMentionsKey=", pageIndex, previousPageData)
        let key: FetchedMentionsKey = { type: "FetchedMentions", teamid: team || "", name: player || "", noUser, page: pageIndex, league, myteam: 0,noLoad:false };
         console.log("getTeamPlayerMentionsKey=>>>",key)
        
        if (previousPageData && !previousPageData.length) return null // reached the end
        return key;
    }
    // now swrInfinite code:
    const { data, error: mentionsError, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(fetchMentionsKey, fetchMentions, { initialSize: 1, })
    const mentions = data ? [].concat(...data) : [];
    //console.log("LOADED MENTIONS FROM FALLBACK",{isValidating,isLoading,mentions})
    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < 25);
    const isRefreshing = isValidating && data && data.length === size;

   /* useEffect(() => {
        if (team != localTeam) {
            setLocalTeam(team);
           // setSize(0);
        }
        
    },[team]);
    useEffect(() => {
        if (player != localPlayer) {
            setLocalPlayer(player);
           // setSize(0);
        }
    },[player]);*/
    
    const Mentions = mentions?.map((m: any, i: number) => {
        const { league, type, team, teamName, name, date, url, findex, summary, findexarxid, fav } = m;
       // console.log("rendering mention", m,i)
        return (<Mention tp={tp} noUser={noUser} league={league} type={type} team={team} teamName={teamName} name={name} date={date} url={url} findex={findex} summary={summary} findexarxid={findexarxid} fav={fav} key={`team-mention${i}`} mutate={() => mutate()} {...rest} />)
    })

    return (
        <div className="team">
            <div className="team__members">
                {false && <TeamHeader>
                    <TeamName>{teamName}  </TeamName>
                </TeamHeader>}
                <MainPanel>
                    <TeamDetailsBody>
                        {Mentions}
                    </TeamDetailsBody>
                   
                        <LoadMore
                        // disabled={isLoadingMore || isReachingEnd}

                        ><Button style={{ padding: 4, marginTop: 20 }} onClick={() => setSize(size + 1)} variant="outlined">
                                {isLoadingMore
                                    ? "loading..."
                                    : isReachingEnd
                                        ? "no more mentions"
                                        : "load more"}
                            </Button>
                        </LoadMore>
                    
                </MainPanel>
            </div>
        </div>
    );
};

export default TeamPlayerMentions;