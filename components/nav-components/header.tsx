import React, { use, useCallback, useEffect, useState } from "react";
//next
import Link from 'next/link'
import { Roboto } from 'next/font/google';
//styled-components
import { styled, ThemeProvider } from "styled-components";
//mui
import { Tabs, Tab, } from '@mui/material'
import { blueGrey, cyan, teal } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
//mui icons
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LoginIcon from '@mui/icons-material/Login';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
//clerk
import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
//other
import { useAppContext } from '@/lib/context';
import {  recordEvent, setCookie } from '@/lib/api';
import PlayerPhoto from "@/components/util-components/player-photo";

//styles

const Header = styled.header`
  height: 100px;
  width: 100%;
  min-width:1hw;
  background-color:var(--header-bg);
  text-align: center;
  font-size: 40px;
  padding-top: 10px;
  padding-bottom:10px;
  font-family: 'Roboto', sans-serif;
  a{
      color: var(--header-title-color);
      text-decoration: none;
      &:hover{
        color:var(--highlight);
      }  
  }
  @media screen and (max-width: 1199px) {
      height: 84px;
      background-color:var(--mobile-header-bg);
      a{
          color: var(--mobile-header-title-color);  
      }
      position: -webkit-sticky; /* Safari */
	    position: sticky;
	    top: 0;
      z-index:1000;
  }
  position:sticky;
  top:0px;
  z-index:1000;
`;

const ContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    font-size:14px;
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

const SideTeam = styled.div`
    height: 20px;
    //margin-top:5px;
   //font-size: 16px;
    padding-left:20px;
    border-left: 1px solid #aaa;
    padding-bottom:20px;
    @media screen and (min-width: 1600px) {
      //font-size: 18px;
    }
`;

const SideLeagueName = styled.div`
    height: 40px;
    width: 200px; 
    color:var(--text);
    font-size: 20px;
`;

const SelectedSideTeam = styled.div`
    height: 20px;
    color:var(--selected);
    font-size: 16px;
    padding-left:20px;
    border-left: 1px solid #aaa;
    a{
        color:var(--selected) !important;
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
    }
`;

const League = styled.div`
    height: 24px;
    width: 100px; 
    color: var(--leagues-text);
    text-align: center;
    margin: 0px;
    padding-top:3px;
`;

const SelectedLeague = styled.div`
    height: 24px;
    width: 100px;
    color: var(--leagues-selected);
    text-align: center;
    margin: 0px;
    padding-top:3px;
    a{
        color:var(--leagues-selected) !important;
        text-decoration: none;
        &:hover{
          color:var(--leagues-highlight);
        }
    }
`;

const Leagues = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    height: 28px;
    width: 100%;
    background-color:var(--leagues-bg);
    color: #aaa;
    text-align: center;
    font-size: 17px;
    margin: 0px;
    a{
        color: var(--leagues-text);
        text-decoration: none;
        &:hover{
            color:var(--leagues-highlight);
        } 
    }
`;

const LeftPanel = styled.div`
    min-width:300px;
    height:auto !important;
   // height:100%;
   // min-height: 200vw;
   // flex-grow: 1;
    background-color:var(--background);
    //display:flex;
    //flex-direction:column;
    //justify-content:flex-start;
    //align-items:flex-start; 
    padding-top:18px;
    padding-left:20px;
    a{
        color:var(--text);
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
    }
    overflow-y: hidden;
    overflow-x: hidden;
    //display:flex;
    //flex-direction:column;
    //justify-content:flex-start;
    //align-items:flex-start;
    padding-top:18px;
   // height:auto;
    max-height: 130vh;
    position:sticky;
    top:-40px;
    //flex-grow:3;
    
`;

const LeagueIcon = styled.div`
    min-height:26px;
    margin-top:-6px;
  
`;
const Favorites = styled.div`
    margin-top:28px;
    margin-left:22px;
    width:100%;
    height:40px;
    font-size:12px;
    a{
        text-decoration: none;
        &:hover{
          color: var(--highlight);
        }
    }
`;

const LeftText = styled.div`
    padding-top:28px;
    padding-right:20px;
    line-height:1.5;
    //font-size:12px;
    a{
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
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

const Welcome = styled.div`
    padding-top:18px;
    //font-size:13px;
    a{
      text-decoration: none;
      &:hover{
        color:var(--highlight);
      }
    }
`;

const CenterPanel = styled.div`
    position:relative;
    width:100%;
   // height:100%;
    max-width:1000px;
    min-width:800px;  
    //co-pilot, add auto vertical scroll
    overflow-y: auto;
    overflow-x: hidden;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start;
    padding-top:18px;
    height:auto;
   // max-height: 100vh;
   flex-grow:1;


`;

const MainPanel = styled.div`
    display:flex;
    position:relative;
    flex-direction:row;
    justify-content:flex-start;
    height:100%;
`;

const MuiTabs = styled(Tabs)`
    width:100%;
    padding:0px;
    margin:0px;
    color: var(--mobile-leagues-text);
    background-color:var(--mobile-leagues-bg);
`;

const Superhead = styled.div`
    font-size: 32px !important;
    margin-top:4px;
    text-align:left;
    color:var(--header-title-color);
    font-size:18px;
    @media screen and (max-width: 1199px ){
        display:none;
    }
`;

const SuperheadMobile = styled.div`
    font-size: 17px;
    margin-top:4px;
    text-align:left;
    color:var(--mobile-header-title-color); 
    @media screen and (min-width: 1200px ){
        display:none;
    }
`;

const Subhead = styled.div`
    font-size: 18x;
    margin-top:4px;
    text-align:left;
    color:var(--subheader-color);
    font-size:18px;
    @media screen and (max-width: 1199px ){
        display:none;
    }
`;

const SubheadMobile = styled.div`
    margin-top:4px;
    text-align:left;
    color:var(--mobile-subheader-color);    
    font-size:14px;
    @media screen and (min-width: 1200px ){
        display:none;
    }
`;

const HeaderTopline = styled.div`
    display:flex;
    height:100%;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    color:var(--header-title-color);
    @media screen and (max-width: 1199px) {
        font-size: 20px;
        margin-bottom:0px;
        color:var(--mobile-header-title-color); 
    }
`;

const LeftContainer = styled.div`
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
`;

const HeaderLeft = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin-left:20px;
    @media screen and (max-width: 1199px) {
        margin-left:0px;
        margin-right:0px;
    }
`;

const ContainerCenter = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    align-items:center;
`;

const HeaderCenter = styled.div`
    margin-left:60px;
    display:flex;
    flex-direction:column;
    align-items: flex-start;
    text-align: left;
    @media screen and (max-width: 1199px) {
        margin-left:0px;
    }
`;
const HeaderRight = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-right:30px;
    width:80px;
    @media screen and (max-width: 1199px) {
        margin-left:0px;
        margin-right:16px;
        width:80px;   
    }
`;

const SmallButton = styled(Button)`
    max-width:12px !important;
    padding:0px;
`;

const Photo = styled.div`
    height:60px;
    width:60px;
    @media screen and (max-width: 1199px) {
        height:40px;
        width:40px;
        margin-left:10px;
    }
`;

const FLogo = styled.div`
    margin-left:20px;
    margin-right:20px;
    @media screen and (max-width: 1199px) {
        display:none;
    }
`;

const FLogoMobile = styled.div`
    margin-left:20px;
    margin-right:20px;
    @media screen and (min-width: 1200px) {
        display:none;
    }
`;

const SUserButton = styled(UserButton)`

`;
const PlayerNameGroup = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    align-items:center;
    font-size: 28px;
    margin-right:20px;
    @media screen and (max-width: 1199px) {
        font-size: 14px;
        margin-right:0px;
    }
`;
const PlayerName = styled.div`
    text-align:left;
`;
/*==========================================*/
interface LeaguesNavProps {
  selected: boolean;
}

const LeaguesTab = styled(Tab) <LeaguesNavProps>`
   color:${({ selected }) => selected ? 'var(--mobile-leagues-selected)' : 'var(--mobile-leagues-text)'} !important;
   :hover{
      color:var(--mobile-leagues-highlight) !important;
    
   }
`;
/*==========================================*/
interface Props {
  leagues: string[];
}

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const HeaderNav: React.FC<Props> = ({leagues}) => {

  const {mode,userId,isMobile,setLeague,setView,setPagetype,setTeam,setPlayer, setMode,sessionid,fbclid,utm_content,params,tp,league,pagetype,team,player,teamName}=useAppContext();
  console.log("league=>:",league)
  const onLeagueNavClick = useCallback(async (l: string) => {
    setLeague(l);
    setView('mentions');
    setPagetype('league');
    setTeam("")
    await recordEvent(sessionid as string || "",
      'league-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","league":"${l}"}`
    );
  }, [fbclid, utm_content, sessionid]);
  
  const updateMode = useCallback(async (mode: string) => {
    console.log("updateMode", mode)
    setMode(mode);
    await setCookie({ name: 'mode', value: mode });
  }, []);
  const LeaguesNav = leagues?.map((l: string, i: number) => {
    return l == league ? <SelectedLeague key={`league-${i}`} ><Link href={`/pub/league/${l}${params}${tp}`} shallow onClick={async () => { await onLeagueNavClick(l) }} >{l}</Link></SelectedLeague> : <League key={`league-${i}`}><Link href={`/pub/league/${l}${params}${tp}`} shallow onClick={async () => { await onLeagueNavClick(l) }} >{l}</Link></League>
  });
  const MobileLeaguesNav = leagues?.map((l: string, i: number) => {
    //@ts-ignore
    return <LeaguesTab selected={l == league} key={`league-${i}`} label={l} onClick={() => { onLeagueNavClick(l).then(() => { }); router.replace(`/pub/league/${l}${params}${tp}`); }} />
  })
  //@ts-ignore
  MobileLeaguesNav.unshift(<LeaguesTab selected={!league} key={`league-${leagues?.length}`} icon={<HomeIcon />} onClick={() => { onLeagueNavClick('').then(() => { }); router.replace(`/pub${params}${tp}`); }} />)
  LeaguesNav.unshift(league ? <League key={`league-${leagues?.length}`}><Link href={`/pub${params}${tp}`} shallow onClick={() => { onLeagueNavClick('').then(() => { }) }}><LeagueIcon><HomeIcon fontSize="medium" sx={{ m: 0.3 }} /></LeagueIcon></Link></League> : <SelectedLeague key={`league-${leagues?.length}`}><Link href={`/pub${params}${tp}`} shallow onClick={() => { onLeagueNavClick('').then(() => { }) }}><LeagueIcon><HomeIcon fontSize="medium" sx={{ m: 0.3 }} /></LeagueIcon></Link></SelectedLeague>)
  const selectedLeague = leagues?.findIndex((l: string) => l == league) + 1;

 


  return (
    <>
            <Header>
              <HeaderTopline>
                <LeftContainer>
                  <HeaderLeft>
                    <FLogo><Link href={`/pub${params}`}><Avatar sx={{ bgcolor: cyan[800] }}>Q</Avatar></Link></FLogo>
                    <FLogoMobile ><Link href={`/pub${params}`}><Avatar sx={{ bgcolor: cyan[800] }}>Q</Avatar></Link></FLogoMobile>
                  </HeaderLeft>
                  <ContainerCenter>
                    <HeaderCenter>
                      <Superhead>{(pagetype == "league" || pagetype == "landing") ? <Link href={`/pub${params}`}>QWIKET{league ? ` : ${league}` : ``}</Link> : !team ? `${league}` : player ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${league}/team/${team}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${league} : ${teamName}`}</Superhead>
                      <SuperheadMobile>{(pagetype == "league" || pagetype == "landing") ? <Link href={`/pub${params}`}>{league ? ` ${league}` : `QWIKET`}</Link> : !team ? `${league}` : player ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${league}/team/${team}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${teamName}`}</SuperheadMobile>
                      {(pagetype == "league" || pagetype == "landing") && <div><Subhead>Sports News Digest And Index</Subhead><SubheadMobile>Sports News Index</SubheadMobile></div>}
                      {pagetype == "player" && player && <div><Subhead>{player ? player : ''}</Subhead><SubheadMobile>{player ? player : ''}</SubheadMobile></div>}
                    </HeaderCenter>
                    {pagetype == "player" && player && <Photo><PlayerPhoto teamid={team || ""} name={player || ""} /></Photo>}
                  </ContainerCenter>
                </LeftContainer>
                <HeaderRight>  <IconButton color={"inherit"} size="small" onClick={async () => {
                  await updateMode(mode == "light" ? "dark" : "light");
                }}>
                  {mode == "dark" ? <LightModeTwoToneIcon fontSize="small" /> : <ModeNightTwoToneIcon fontSize="small" />}
                </IconButton>
                  <SUserButton afterSignOutUrl="/" />
                  {pagetype != 'landing' && !userId && <SignInButton><IconButton color={"inherit"} size="small" ><LoginIcon fontSize="small" /></IconButton></SignInButton>}
                </HeaderRight>
              </HeaderTopline>
            </Header>
            {!isMobile && <ContainerWrap>
              <Leagues>
                {LeaguesNav}
              </Leagues>
              </ContainerWrap>}
              {isMobile && <MobileContainerWrap>
              <MuiTabs
                value={selectedLeague}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
              >
                {MobileLeaguesNav}
              </MuiTabs>
            </MobileContainerWrap>}
            </>
  )
}
export default HeaderNav;