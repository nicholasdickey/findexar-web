import React, { use, useCallback, useEffect, useState } from "react";
import Link from 'next/link'
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { styled } from "styled-components";

import Button from '@mui/material/Button';

import { FetchedStoriesKey, fetchStories } from '@/lib/api';
import { useAppContext } from '@/lib/context';

import Story from "@/components/func-components/items/story";
import LoadMore from "@/components/func-components/load-more";

const OuterContainer = styled.div`
    position:relative;
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
   //width:100%;
    //height:100%;
    margin:0px;
    @media screen and (max-width: 1199px) {
        display: none;
  }
`;
const MentionsBody = styled.div`
   // width:100%;

    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:flex-start;
    //padding-right:120px;
`;

const MentionsOuterContainer = styled.div`

    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:100%;
    //min-width:700px;
   // max-width:100%;
   
    height:100%;

    font-family: 'Roboto', sans-serif;
   // padding-left:20px;
    padding-right:20px;
  /*  a{
        font-size: 15px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #222;
        }   
    }*/
    
    @media screen and (max-width: 1199px) {
    display: none;
  }
`;

const ButtonContainer = styled.div`
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    margin-bottom:100px;
`;

const MobileMentionsOuterContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    width:100%;
    height:100%;
    font-family: 'Roboto', sans-serif;
    align-content:flex-start;
    background-color:var(--mention-bg);
   // padding-left:2px;
   // padding-right:2px;
    a{
        font-size: 18px;
      
        text-decoration: none;
        &:hover{
          color: var(--highlight);
        }   
    }
    @media screen and (min-width: 1200px) {
    display: none;
  }
`;

interface Props {
}

const Stories: React.FC<Props> = () => {
    const { mode, userId, noUser, view, tab, isMobile, setLeague, setView, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName, setTeamName } = useAppContext();
    const [scrollY, setScrollY] = useState(0);
    const [firstXid, setFirstXid] = useState("");
   
   
    const fetchStoriesKey = (pageIndex: number, previousPageData: any): FetchedStoriesKey | null => {
        //console.log("getMentionsKey=", pageIndex, previousPageData)
        let key: FetchedStoriesKey = { type: "FetchedStories", noUser, page: pageIndex, league, noLoad: view != "mentions" && tab != "all",firstXid };
        //console.log("getSoriesKey=>>>", key)

        if (previousPageData && !previousPageData.length) return null // reached the end
        return key;
    }
    const { data, error: storiesError, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(fetchStoriesKey, fetchStories, { initialSize: 1, revalidateAll: true,parallel:true })
   
    let stories = data ? [].concat(...data):[];
   /* useEffect(() => {
        //@ts-ignore
        const xid=stories && stories.length>0?stories[0].xid:"";
        if(xid!=firstXid){
            console.log("setFirstXid=",xid,firstXid)
            setFirstXid(xid);
        }   
    }, [stories[0]])*/
    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    let isEmpty = data?.[0]?.length === 0;
    let isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < 5);
    const Stories = stories && stories.map((s: any, i: number) => <Story
        story={s}
        key={`story-${i}`}
    />);

    return (
        <>
            {!isMobile ?
                <MentionsOuterContainer>
                    <MentionsBody>
                        {Stories}
                    </MentionsBody>
                    <LoadMore setSize={setSize} size={size} isLoadingMore={isLoadingMore || false} isReachingEnd={isReachingEnd || false} />
                </MentionsOuterContainer>
                :
                <MobileMentionsOuterContainer>
                    <MentionsBody>
                        {Stories}
                    </MentionsBody>
                    <LoadMore setSize={setSize} size={size} isLoadingMore={isLoadingMore || false} isReachingEnd={isReachingEnd || false} />
                    <ButtonContainer> </ButtonContainer>
                </MobileMentionsOuterContainer>}
        </>
    )
}
export default Stories;