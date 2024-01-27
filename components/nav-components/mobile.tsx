import React, { useEffect, useCallback } from "react";
import { useRouter } from 'next/router'
import { styled, ThemeProvider } from "styled-components";

import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

import Landing from "@/components/func-components/landing";
import Teams from "@/components/func-components/teams";
import Welcome from "@/components/func-components/welcome";
import Readme from "@/components/func-components/readme";
import Mentions from "@/components/func-components/mentions";
import Stories from "@/components/func-components/stories";
import MyTeam from "@/components/func-components/myteam";
import Players from "@/components/func-components/players";
import { useAppContext } from '@/lib/context';
import SecondaryTabs from "@/components/nav-components/secondary-tabs";
import TertiaryTabs from "@/components/nav-components/tertiary-tabs";

import { recordEvent } from '@/lib/api';
const MobileContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    color: #111;
    font-family: 'Roboto', sans-serif;
    border-top: 1px solid #ccc;
    @media screen and (min-width: 1200px) {
      display: none;
    }
`;
const LeftMobilePanel = styled.div`
    width:100%;
    display:flex;
    flex-direction:column;
    padding-left:20px;
    align-items:flex-start; 
    padding-top:18px;
    a{
        color: var(--text);
        text-decoration: none;
        &:hover{
            color:var(--highlight);
        }
    }
`;


const CenterPanel = styled.div`
    position:relative;
    width:100%;
    max-width:1000px;
    min-width:800px;  
    overflow-y: auto;
    overflow-x: hidden;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start;
    padding-top:18px;
    height:auto;
    flex-grow:1;
`;

const SideLeagueName = styled.div`
    height: 40px;
    width: 200px; 
    color:var(--text);
    font-size: 20px;
`;

interface Props {


}
const Desktop: React.FC<Props> = () => {
    const router = useRouter();
    let { tab, view, mode, userId, isMobile, setLeague, setView, setTab, params2, tp2, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName } = useAppContext();

    tab == tab || "all";
    const onTabNav = async (option: any) => {
        const tab = option.tab;
        setTab(tab);
        setView("mentions");
        let tp = tab != 'all' ? params ? `&tab=${tab}` : `?tab=${tab}` : ``;
        router.push(league ? `/pub/league/${league}${params}${tp}` : params ? `/pub${params}${tp}` : `/pub?tab=${tab}`)
    }

    const onViewNav = useCallback(async (option: { name: string, access: string }) => {
        console.log(option);
        setView(option.name);
        router.replace(league ? `/pub/league/${league}?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2.replace('?', '&')}` : `/pub?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2.replace('?', '&')}`, undefined, { shallow: true })
        await recordEvent(sessionid as string || "",
            'view-nav',
            `{"fbclid":"${fbclid}","utm_content":"${utm_content}","view":"${option.name}"}`
        );
    }, [fbclid, utm_content, sessionid, league, params2, tp2]);
    return (
        <MobileContainerWrap>
            {pagetype == "landing" && <Landing />}
            {!league ? <SecondaryTabs options={[{ name: "Mentions", icon: <MentionIcon fontSize="small" />, access: "pub" }, { name: "My Team", icon: <ListIcon fontSize="small" />, access: "pub" }, { name: "Readme", icon: <ContactSupportIcon fontSize="small" />, access: "pub" }]} onChange={async (option: any) => { await onViewNav(option); }} selectedOptionName={view} /> :
                <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "My Team", icon: <ListIcon />, access: "pub" }]} onChange={async (option: any) => { await onViewNav(option) }} selectedOptionName={view} />
            }
          
            {view == 'mentions' && <TertiaryTabs options={[{ name: `${league ? league : 'Full'} Feed`, tab: 'all' }, { name: "My Feed", tab: "myteam" }, { name: "Favorites", tab: "fav" }]} onChange={async (option: any) => { await onTabNav(option); }} selectedOptionName={tab} />}

            {view == 'teams' &&
                <LeftMobilePanel>
                    <Teams />
                </LeftMobilePanel>
            }
            {view == 'mentions' && <CenterPanel>
                {pagetype == "league" && tab == "all" ? <Stories />:<Mentions />}
            </CenterPanel>}
            {view == 'readme' && <Readme />}
            {view=='my team' && <MyTeam/>}
            {view=='players'&&<Players/>}
        </MobileContainerWrap >

    )
}
export default Desktop;