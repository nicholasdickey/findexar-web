import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { styled, ThemeProvider } from "styled-components";

import Landing from "@/components/func-components/landing";
import Teams from "@/components/func-components/teams";
import Welcome from "@/components/func-components/welcome";
import Readme from "@/components/func-components/readme";
import Mentions from "@/components/func-components/mentions";
import Stories from "@/components/func-components/stories";
import MyTeam from "@/components/func-components/myteam";
import Players from "@/components/func-components/players";
import { useAppContext } from '@/lib/context';
import TertiaryTabs  from "@/components/nav-components/tertiary-tabs";
import MentionOverlay from "@/components/func-components/mention-overlay";
import StoryOverlay from "@/components/func-components/story-overlay";
import { recordEvent } from '@/lib/api';

const PageWrap = styled.div`
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content: center;
`;

const Page = styled.div`
  max-width:1600px;
`;

const ContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    font-size:14px;
    margin-top:12px;
    color:var(--text);
    @media screen and (max-width: 1199px) {
        display: none;
    }
    @media screen and (min-width: 1600px) {
      font-size: 18px;
    }
    @media screen and (min-width: 1800px) {
      font-size: 19px;
    }
    @media screen and (min-width: 2000px) {
      font-size: 20px;
    }
`;

const MainPanel = styled.div`
    display:flex;
    position:relative;
    flex-direction:row;
    justify-content:flex-start;
    height:100%;
`;

const LeftPanel = styled.div`
    min-width:300px;
    height:auto !important;
    background-color:var(--background);
    padding-top:18px;
    padding-left:20px;
    flex-grow:1;
    a{
        color:var(--text);
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
    }
    overflow-y: hidden;
    overflow-x: hidden;
    padding-top:18px;
    max-height: 150vh;
    position:sticky;
    top:-400px;
`;

const CenterPanel = styled.div`
    overflow-y: auto;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start;
    padding-top:10px;
    padding-bottom:40px;
    height:auto;
    flex-grow:1;
    width:600px;
    @media screen and (min-width: 1600px) {
        width:800px;
    }
`;

const RightPanel = styled.div`
    min-width:300px;
    padding-left:20px;
    flex-grow:1;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start; 
    padding-top:18px;
    a{
        color:var(--text); // #eee;
        text-decoration: none;
        &:hover{
        color: var(--highlight);//#4f8;
        }
    }
`;
interface Props {
}

const Desktop: React.FC<Props> = () => {
    const router = useRouter();
    let { tab,view,mode, userId, isMobile, setLeague, setView,setTab, setPagetype, setTeam, setPlayer, setMode, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName ,findexarxid} = useAppContext();
    tab=tab||"all";
    view=view||"mentions";
    console.log("isMobile desktop")
    const onTabNav = async (option: any) => {
        const tab = option.tab;
        setTab(tab);
        setView("mentions");
        let tp = tab != 'all' ? params ? `&tab=${tab}` : `?tab=${tab}` : ``;
        router.push(league ? `/pub/league/${league}${params}${tp}` : params ? `/pub${params}${tp}` : `/pub?tab=${tab}`)
        await recordEvent(
            'tab-nav',
            `{"fbclid":"${fbclid}","utm_content":"${utm_content}","tab":"${tab}"}`
        );
    }

    return (
        <ContainerWrap>
             <MentionOverlay setDismiss={(dismiss:boolean)=>{setView("mentions");}} mutate={() => {}}  />
             <StoryOverlay setDismiss={(dismiss:boolean)=>{setView("mentions");}} mutate={() => {}}  />
            <PageWrap>
                <Page>
                    {pagetype == "landing" && <Landing />}
                    {pagetype !== "landing" && <MainPanel>
                        <LeftPanel>
                            {league ? <Teams /> : <Welcome />}
                        </LeftPanel>
                        <CenterPanel>
                            {pagetype=="league" &&view!='readme'&& <TertiaryTabs options={[{ name: `${league ? league : 'All'} Stories`, tab: 'all',disabled:false }, { name: "My Feed", tab: "myteam",disabled:!userId }, { name: "Favorites", tab: "fav",disabled:!userId }]} onChange={async (option: any) => { await onTabNav(option); }} selectedOptionName={tab} />}
                            {(pagetype == "team" || pagetype == "player"||(pagetype=="league"&&(tab=="myteam"||tab=="fav"))) && <Mentions />}
                            { (pagetype == "league"&&view!='readme'&& (tab=='all'||tab==''))&&<Stories />}
                            {view == 'readme' && <Readme />}
                        </CenterPanel>
                        <RightPanel>
                            {pagetype=='league'&&<MyTeam />}
                            {(pagetype=='team'||pagetype=='player')&&<Players />}
                        </RightPanel>
                    </MainPanel>}
                </Page>
            </PageWrap>
        </ContainerWrap>
    )
}
export default Desktop;