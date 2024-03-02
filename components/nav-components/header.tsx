import React, { useCallback, useEffect, useState } from "react";
//next
import Link from 'next/link'
import { useRouter } from 'next/router'
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
import { recordEvent } from '@/lib/api';
import PlayerPhoto from "@/components/util-components/player-photo";

//styles
interface HeaderProps {
  scrolled: boolean;
}
const Header = styled.header<HeaderProps>`
  height:${({ scrolled }) => scrolled ? 80 : 100}px;
  width: 100%;
  min-width:1vw;
  background-color:var(--header-bg);
  text-align: center;
  font-size: 40px;
  padding-bottom:10px;
  font-family: 'Roboto', sans-serif;
  transition: height 0.2s ease, padding-top 0.2s ease;
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

const League = styled.div<HeaderProps>`
    height: ${({ scrolled }) => scrolled ? 16 : 24}px;
    width: 100px; 
    color: var(--leagues-text);
    text-align: center;
    margin: 0px;
    padding-top:${({ scrolled }) => scrolled ? 0 : 3}px;
    @media screen and (max-width: 1199px) {
      height: 24px;
    }
`;

const SelectedLeague = styled.div<HeaderProps>`
    height: ${({ scrolled }) => scrolled ? 16 : 24}px;
    width: 100px;
    color: var(--leagues-selected);
    text-align: center;
    margin: 0px;
    padding-top:${({ scrolled }) => scrolled ? 1 : 3}px;
    a{
        color:var(--leagues-selected) !important;
        text-decoration: none;
        &:hover{
          color:var(--leagues-highlight);
        }
    }
    @media screen and (max-width: 1199px) {
      height: 24px;
    }
`;

const Leagues = styled.div<HeaderProps>`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    height:${({ scrolled }) => scrolled ? 21 : 28}px;
    width: 100%;
    background-color:var(--leagues-bg);
    color: #aaa;
    text-align: center;
    font-size:    ${({ scrolled }) => scrolled ? 14 : 17}px;
    margin: 0px;
    a{
        color: var(--leagues-text);
        text-decoration: none;
        &:hover{
            color:var(--leagues-highlight);
        } 
    }
    @media screen and (max-width: 1199px) {
      font-size: 17px;
    }
`;

const LeagueIcon = styled.div<HeaderProps>`
    min-height: ${({ scrolled }) => scrolled ? 10 : 26}px;
    margin-top:${({ scrolled }) => scrolled ? -5 : -6}px;
`;

const MuiTabs = styled(Tabs)`
    width:100%;
    padding:0px;
    margin:0px;
    color: var(--mobile-leagues-text);
    background-color:var(--mobile-leagues-bg);
`;

const Superhead = styled.div<HeaderProps>`
    font-size: ${({ scrolled }) => scrolled ? 24 : 32}px !important;
    margin-top:4px;
    text-align:left;
    color:var(--header-title-color);
    font-size:18px;
    transition: font-size 0.2s ease;
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

const Subhead = styled.div<HeaderProps>`
    font-size: ${({ scrolled }) => scrolled ? 14 : 18}px;
    margin-top:4px;
    text-align:left;
    color:var(--subheader-color);
    transition: font-size 0.2s ease;
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
let s = false;

const HeaderNav: React.FC<Props> = ({ leagues }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { mode, userId, isMobile, setLeague, setView, setPagetype, setTeam, setPlayer, setMode, fbclid, utm_content, params, tp, league, pagetype, team, player, teamName } = useAppContext();

  const router = useRouter();
  const onLeagueNavClick = useCallback(async (l: string) => {
    setLeague(l);
    setView('mentions');
    setPagetype('league');
    setTeam("")
    await recordEvent(
      'league-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","league":"${l}"}`
    );
  }, [fbclid, utm_content]);

  useEffect(() => {
    const listener = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 0) {

        if (!scrolled && !s) {
          try {
            s = true;
            setScrolled(true);
            recordEvent(`header-scrolled`, `{"league":"${league}","team":"${team}","player":"${player}","fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
              .then((r: any) => {
                console.log("recordEvent", r);
              });
          } catch (x) {
            console.log('recordEvent', x);
          }
        }
        setScrolled(true);
      }
    }
    function throttle(callbackFn: any, limit: number) {
      let wait = false;
      return function () {
        if (!wait) {
          callbackFn.call();
          wait = true;
          setTimeout(function () {
            wait = false;
            callbackFn.call();
          }, limit);
        }
      }
    }
    window.addEventListener("scroll", throttle(listener, 200));
    return () => window.removeEventListener("scroll", listener);
  }, [fbclid, utm_content, scrolled]);

  const updateMode = useCallback(async (mode: string) => {
    setMode(mode);
    await fetch(`/api/session/save`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ session: { dark: mode=='dark'?1:0 } })
    });
   
  }, []);

  const LeaguesNav = leagues?.map((l: string, i: number) => {
    return l == league ? <SelectedLeague scrolled={scrollY != 0} key={`league-${i}`} ><Link href={`/pub/league/${l}${params}${tp}`} shallow onClick={async () => { await onLeagueNavClick(l) }} >{l}</Link></SelectedLeague> : <League scrolled={scrollY != 0} key={`league-${i}`}><Link href={`/pub/league/${l}${params}${tp}`} shallow onClick={async () => { await onLeagueNavClick(l) }} >{l}</Link></League>
  });

  const MobileLeaguesNav = leagues?.map((l: string, i: number) => {
    //@ts-ignore
    return <LeaguesTab selected={l == league} key={`league-${i}`} label={l} onClick={() => { onLeagueNavClick(l).then(() => { }); router.replace(`/pub/league/${l}${params}${tp}`); }} />
  })
  //@ts-ignore
  MobileLeaguesNav.unshift(<LeaguesTab selected={!league} key={`league-${leagues?.length}`} icon={<HomeIcon />} onClick={() => { onLeagueNavClick('').then(() => { }); router.replace(`/pub${params}${tp}`); }} />)
  LeaguesNav.unshift(league ? <League scrolled={scrollY != 0} key={`league-${leagues?.length}`}><Link href={`/pub${params}${tp}`} shallow onClick={() => { onLeagueNavClick('').then(() => { }) }}><LeagueIcon scrolled={scrollY != 0}><HomeIcon fontSize={scrollY != 0 ? "small" : "medium"} sx={{ m: 0.3 }} /></LeagueIcon></Link></League> : <SelectedLeague scrolled={scrollY != 0} key={`league-${leagues?.length}`}><Link href={`/pub${params}${tp}`} shallow onClick={() => { onLeagueNavClick('').then(() => { }) }}><LeagueIcon scrolled={scrollY != 0}><HomeIcon fontSize={scrollY != 0 ? "small" : "medium"} sx={{ m: 0.3 }} /></LeagueIcon></Link></SelectedLeague>)
  const selectedLeague = leagues?.findIndex((l: string) => l == league) + 1;

  return (
    <>
      <Header scrolled={!isMobile && scrollY != 0}>
        <HeaderTopline>
          <LeftContainer>
            <HeaderLeft>
              <FLogo><Link href={`/pub${params}`}><Avatar sx={{ bgcolor: cyan[800] }}>{process.env.NEXT_PUBLIC_APP_NAME=='Findexar'?"Fi":"Q"}</Avatar></Link></FLogo>
              <FLogoMobile ><Link href={`/pub${params}`}><Avatar sx={{ bgcolor: cyan[800] }}>{process.env.NEXT_PUBLIC_APP_NAME=='Findexar'?"Fi":"Q"}</Avatar></Link></FLogoMobile>
            </HeaderLeft>
            <ContainerCenter>
              <HeaderCenter>
                <Superhead scrolled={scrollY != 0}>{(pagetype == "league" || pagetype == "landing") ? <Link href={`/pub${params}`}>{process.env.NEXT_PUBLIC_APP_NAME?.toUpperCase()+(league ? ` : ${league}` : ``)}</Link> : !team ? `${league}` : player ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${league}/team/${team}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${league} : ${teamName}`}</Superhead>
                <SuperheadMobile>{(pagetype == "league" || pagetype == "landing") ? <Link href={`/pub${params}`}>{league ? ` ${league}` : `${process.env.NEXT_PUBLIC_APP_NAME?.toUpperCase()}`}</Link> : !team ? `${league}` : player ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${league}/team/${team}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${league} : ${teamName}`}</SuperheadMobile>
                {(pagetype == "league" || pagetype == "landing") && <div><Subhead scrolled={scrollY != 0}>Sports Media Index</Subhead><SubheadMobile>Sports Media Index</SubheadMobile></div>}
                {pagetype == "player" && player && <div><Subhead scrolled={scrollY != 0}>{player ? player : ''}</Subhead><SubheadMobile>{player ? player : ''}</SubheadMobile></div>}
               
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
        {!isMobile &&<ContainerWrap> <Leagues scrolled={scrollY != 0}>
          {LeaguesNav}
        </Leagues></ContainerWrap>}
      </Header>
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