
import React,{useEffect, useState} from "react";
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Roboto } from 'next/font/google';
import 'material-icons/iconfont/outlined.css';
import Script from "next/script";
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable'
import { styled, ThemeProvider } from "styled-components";
import { Tabs, Tab } from '@mui/material'
import { ThemeProvider as MuiTP, createTheme } from '@mui/material/styles';
import { blueGrey, cyan, teal } from '@mui/material/colors'
import HomeIcon from '@mui/icons-material/HomeOutlined';
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayerIcon from '@mui/icons-material/PersonPinOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import Avatar from '@mui/material/Avatar';
import { UserButton } from "@clerk/nextjs";
import { palette } from '@/lib/palette';
import { GlobalStyle } from '@/components/themes/globalStyle';

import { LeagueTeamsKey, getLeagueTeams } from '@/lib/api';
import Team from './team-page';
import Mentions from './league-mentions';
import SecondaryTabs from "./secondary-tabs";



const Header = styled.header`
  height: 80px;
  width: 100%;
  background-color: #444;
  color: #fff;
  text-align: center;
  font-size: 40px;
  padding-top: 10px;
  padding-bottom:10px;
  
  a{
      color: #fff;
      text-decoration: none;
      &:hover{
        color: #4f8;
      }  
  }
  @media screen and (max-width: 1199px) {
    height: 64px;
  }
`;

const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  @media screen and (max-width: 1199px) {
    display: none;
  }
`;
const MobileContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;

const SideTeam = styled.div`
  height: 40px;
  width: 300px; 
  color: #fff;
  text-align: center;
  font-size: 18px;
  margin: 10px;
`;

const SelectedSideTeam = styled.div`
  height: 40px;
  width: 300px;
  color: #ff8 !important;
  text-align: center;
  font-size: 18px;
  margin: 10px;
  a{
      color: #ff8 !important;
      text-decoration: none;
      &:hover{
        color: #F8F;
      }
  }
`;

const League = styled.div`
  height: 30px;
  width: 100px; 
  color: #fff;
  text-align: center;
  font-size: 24px;
  margin: 0px;
`;

const SelectedLeague = styled.div`
  height: 30px;
  width: 100px;
  color: #ff8 !important;
  text-align: center;
  font-size: 24px;
  margin: 0px;
  a{
    color: #ff8 !important;
    text-decoration: none;
    &:hover{
      color: #F8F;
    }
  }
`;

const Leagues = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  height: 30px;
  width: 100%;
  background-color: #888;
  color: #fff;
  text-align: center;
  font-size: 280px;
  margin: 0px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    } 
  }
`;

const LeftPanel = styled.div`
  width:300px;
  height:100%;
  min-height: 1000vh;
  background-color:  #333;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-top:18px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;
const LeftMobilePanel = styled.div`
  width:100%;
  background-color:  #333;
  display:flex;
  flex-direction:column;
  //justify-content:center;
  align-items:center; 
  padding-top:18px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;
const Welcome = styled.div`
  padding-top:18px;
  color:#aaa;
  align-self:center;
  font-size:12px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;

const CenterPanel = styled.div`
  width:100%;
  height:100%;
`;

const MainPanel = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  width:100%;
  height:100%;
`;
const MuiTabs = styled(Tabs)`
  width:100%;
  padding:0px;
  margin:0px;
`;
const Subhead = styled.div`
  font-size: 18x;

  margin-left:80px;
  text-align:left;
  color: ${blueGrey[200]};
  font-size:18px;
  @media screen and (max-width: 1199px ){
    font-size: 14px;
  }
`;
const HeaderTopline = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
 
  @media screen and (max-width: 1199px) {
    //padding-top:28px;
    font-size: 20px;
    margin-bottom:0px;
  }
`;
const HeaderLeft= styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
 // margin-left:20px;
  //margin-right:20px;
  @media screen and (max-width: 1199px) {
    margin-left:0px;
    margin-right:0px;
  }
`;
const HeaderRight= styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  margin-left:20px;
  margin-top:4px;
  
  font-family: 'Roboto', sans-serif;
  margin-right:30px;
  @media screen and (max-width: 1199px) {
    margin-left:20px;
    margin-right:20px;
  }
  &.cl-avatarBox{
    width:40px !important;
    height:40px !important;
  }
  &.cl-formButtonPrimary {
  font-size: 14px;
  text-transform: none;
  background-color: #611bbd;
  width:40px;
  height:40px;
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
padding-top:30px;
  img{width:60px !important;
  height:60px !important;
  }
  &.cl-avatarBox{
    width:40px !important;
    height:40px !important;
  }
  &.cl-formButtonPrimary {
  font-size: 14px;
  text-transform: none;
  background-color: #611bbd;
  width:40px;
  height:40px;
}
`;

interface Props {
  disable?: boolean;
  dark?: number;
  fbclid?: string;
  utm_content?: string;
  isbot?: number;
  isfb?: number;
  sessionid?: string;
  leagues: string[];
  league?: string;
  team?: string;
  player?: string;
  pagetype?: string;
  view: string;
}

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const Landing: React.FC<Props> = (props) => {
  let { dark, leagues, league, team, pagetype, player, view } = props;
  const [localTeam, setLocalTeam] = useState(team);
  useEffect(() => {
    setLocalTeam(team);
  }, [team]);
  view = view.toLowerCase();
  const router = useRouter();
  const leagueTeamsKey: LeagueTeamsKey = { func: "leagueTeams", league: league || "" };
  const { data: teams, error, isLoading } = useSWR(leagueTeamsKey, getLeagueTeams);
  if (!view)
    view = "home";
  if (view == "home")
    view = "mentions";
  const [localView, setLocalView] = useState(view);
  useEffect(() => {
    setLocalView(view);
  }, [view]);
  const LeaguesNav = leagues?.map((l: string, i: number) => {
    return l == league ? <SelectedLeague key={`league-${i}`}><Link href={`/pub/league/${l}`}>{l}</Link></SelectedLeague> : <League key={`league-${i}`}><Link href={`/pub/league/${l}`}>{l}</Link></League>
  });
  const MobileLeaguesNav = leagues?.map((l: string, i: number) => {
    return <Tab key={`league-${i}`} label={l} />
  })
  MobileLeaguesNav.unshift(<Tab key={`league-${leagues?.length}`} icon={<HomeIcon />} />)

  const selectedLeague = leagues?.findIndex((l: string) => l == league) + 1;
  console.log("selectedLeague", selectedLeague)
  let theme: any;
  if (dark) {
    theme = createTheme({
      palette: {
        mode: 'dark',
        background: {
          default: '#2d2b38',//' blueGrey[900],
          paper: blueGrey[600],
        }
      },
    })
  }
  else {
    theme = createTheme({
      palette: {
        mode: 'light',
      },
    })
  }
  let teamName = "";
  let TeamsNav = null;

  if (teams && teams.length > 0)
    TeamsNav = teams?.map((t: { id: string, name: string }, i: number) => {
      if (t.id == localTeam)
        teamName = t.name;
      return t.id == localTeam ? <SelectedSideTeam key={`sideteam-${i}`}><Link onClick={()=>{setLocalTeam(t.id);setLocalView("mentions")}} href={`/pub/league/${league}/team/${t.id}`}>{t.name}</Link></SelectedSideTeam> : <SideTeam key={`sideteam-${i}`}><Link onClick={()=>{setLocalTeam(t.id);setLocalView("mentions")}}  href={`/pub/league/${league}/team/${t.id}`}>{t.name}</Link></SideTeam>
    });
  console.log("view", localView)
  return (
    <>
      <Head>
        <title>Findexar</title>
        <link rel="canonical" href="www.findexar.com" />
        <meta property="og:description" content="Fantasy Sports Mentions Monitor for Major League Teams and athletes" />
        <meta name="title" content="Findexar" />
        <meta property="og:title" content="Findexar" />
        <meta name="description" content="Fantasy Sports Mentions Monitor for Major League Teams and athletes" />
        <meta property="og:type" content="website" />
        <meta property="fb:appid" content="358234474670240" />
        <meta property="og:site_name" content="Findexar.com" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER} />
        <meta property="og:image" content="https://findexar.com/image" />
        <meta property="findexar:verify" content="findexar" />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content={dark ? palette.dark.colors.background : palette.light.colors.background} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link
          rel="shortcut icon"
          type="image/png"
          href={"/blue-bell.png"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-PEZZHTN0M5`} strategy="afterInteractive"></Script>
      <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXX', {
            page_path: window.location.pathname,
          });
        `,
      }} />

      <MuiTP theme={theme}>
        <main className={roboto.className} >
          <ThemeProvider
            //@ts-ignore
            theme={palette}>
            <GlobalStyle />
            <Header>
              <HeaderTopline>
                <HeaderLeft>
                <FLogo><Link href="/pub"><Avatar  sx={{ bgcolor: cyan[800] }}>Fi</Avatar></Link></FLogo>
                <FLogoMobile ><Link href="/pub"><Avatar sx={{ bgcolor: cyan[800] }}>Fi</Avatar></Link></FLogoMobile>
                {!league && !localTeam ? <Link href="/pub/league">FINDEXAR</Link> : !localTeam ? `${league}` : player ? <Link href={`/pub/league/${league}/team/${localTeam}`}>{teamName}</Link> : `${teamName}`}
                </HeaderLeft>
               <HeaderRight> <SUserButton afterSignOutUrl="/"/></HeaderRight>
              </HeaderTopline>
              <Subhead>{player ? player : ''}</Subhead>
            </Header>
            <ContainerWrap>
              <Leagues>
                {LeaguesNav}
              </Leagues>
              {isLoading ?
                <MainPanel>Loading...</MainPanel> :
                <MainPanel>
                  <LeftPanel>
                    {league ? TeamsNav : <Welcome>Welcome to Findexar!<br /><hr /><br />Your indispensable Fantasy Sports<br /> research tool!<br /><br />Finding and indexing <br />mentions of athletes<br /> in the media.<br /><br /><hr />Powered by Open AI.</Welcome>}
                  </LeftPanel>
                  <CenterPanel>
                    {(pagetype == "team" || pagetype == "player") && <Team view={localView} teams={null} team={localTeam} league={league} teamName={teamName} pagetype={pagetype} player={player} />}
                    {pagetype == "league" && !localTeam && <Mentions league={league || ""} />}
                  </CenterPanel>
                </MainPanel>}
            </ContainerWrap>
            <MobileContainerWrap>
              <MuiTabs
                value={selectedLeague}
                onChange={(event: React.SyntheticEvent, newValue: number) => { router.replace(`/pub/league/${newValue ? leagues[newValue - 1] : ''}?view=Mentions`) }}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
              >
                {MobileLeaguesNav}
              </MuiTabs>
              {pagetype == 'league' && !league &&
                <div>
                  <SecondaryTabs options={[{ name: "Mentions", icon: <MentionIcon /> }, { name: "Lists", icon: <ListIcon /> }]} onChange={(option: any) => { console.log(option); router.replace(league ? `/pub/league/${league}?view=${encodeURIComponent(option.name)}` : `/pub/league?view=${encodeURIComponent(option.name)}`) }} selectedOptionName={localView} />
                  {localView == 'mentions' && <CenterPanel>
                    <Mentions league={league || ""} />
                  </CenterPanel>}
                  {localView == 'lists' && <CenterPanel>
                    LISTS
                  </CenterPanel>}
                </div>}
              {pagetype == 'league' && league &&
                <div>
                  <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }]} onChange={(option: any) => { console.log(option); router.replace(league ? `/pub/league/${league}?view=${encodeURIComponent(option.name)}` : `/pub/league?view=${encodeURIComponent(option.name)}`) }} selectedOptionName={localView} />
                  {localView == 'teams' &&
                    <LeftMobilePanel>{TeamsNav}</LeftMobilePanel>}
                  {localView == 'mentions' && <CenterPanel>
                    <Mentions league={league || ""} />
                  </CenterPanel>}
                </div>}
              {(pagetype == 'team' || pagetype == 'player') &&
                <div>
                  <Team view={localView} teams={<LeftMobilePanel>{TeamsNav}</LeftMobilePanel>} team={localTeam} league={league} teamName={teamName} pagetype={pagetype} player={player} />
                </div>
              }



            </MobileContainerWrap>
          </ThemeProvider>
        </main>
      </MuiTP>
    </>
  )
}
export default Landing;