import React, { use, useCallback, useEffect, useState } from "react";
//next
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Roboto } from 'next/font/google';
import Script from "next/script";
import useSWR from 'swr';
//styled-components
import { styled, ThemeProvider } from "styled-components";
//mui
import { Tabs, Tab, } from '@mui/material'
import { ThemeProvider as MuiTP, createTheme } from '@mui/material/styles';
import { blueGrey, cyan, teal } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
//mui icons
import HomeIcon from '@mui/icons-material/HomeOutlined';
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
//clerk
import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
//stripe
import { useSubscription } from "use-stripe-subscription";
//other
import 'material-icons/iconfont/outlined.css';
import { getCookie } from 'cookies-next';
//local
import { palette } from '@/lib/palette';
import GlobalStyle from '@/components/globalstyles';
import { LeagueTeamsKey, getLeagueTeams, recordEvent, setCookie } from '@/lib/api';
import Team from './team-page';
import Mentions from './league-mentions';
import SecondaryTabs from "./secondary-tabs";
import PlayerPhoto from "./player-photo";
import SubscriptionMenu from "./subscription-menu";
import Readme from "./readme";
import Landing from "./landing";

//styles
const Header = styled.header`
  height: 100px;
  width: 100%;
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
  }
`;

const ContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    color:var(--text);
    @media screen and (max-width: 1199px) {
        display: none;
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
    height: 40px;
    font-size: 16px;
    padding-left:20px;
    border-left: 1px solid #aaa;
    padding-bottom:35px;
`;

const SideLeagueName = styled.div`
    height: 40px;
    width: 200px; 
    color:var(--text);
    font-size: 20px;
`;

const SelectedSideTeam = styled.div`
    height: 40px;
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
    width:300px;
    height:auto !important;
    height:100%;
    min-height: 200vw;
    background-color:var(--background);
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start; 
    padding-top:18px;
    padding-left:20px;
    a{
        color:var(--text);
        text-decoration: none;
        &:hover{
            color: var(--highlight);
        }
    }
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
    font-size:12px;
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
    font-size:13px;
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
    height:100%;
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
    font-size: 18x;
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
  userId?: string;
  createdAt?: string;
  freeUser?: boolean;
  list?: string;
  t1: number;
  tab: string;
  mode: string;
  findexarxid:string;
}

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const SinglePage: React.FC<Props> = (props) => {
  let { findexarxid,mode, tab, t1, fbclid = "", sessionid = "", isfb, isbot, list, freeUser, createdAt, userId, utm_content, dark, leagues, league = "", team = "", pagetype = "league", player = "", view = "" } = props;

  const [localTeam, setLocalTeam] = useState(team);
  const [localPlayer, setLocalPlayer] = useState(player);
  const [localPageType, setLocalPageType] = useState(pagetype || 'league');
  const [localLeague, setLocalLeague] = useState(league);
  const [subscriptionPrompt, setSubscriptionPrompt] = useState(false);
  const [dismiss, setDismiss] = useState(false);
  const [hardStop, setHardStop] = useState(false);
  const [params, setParams] = useState("");
  const [params2, setParams2] = useState("");
  const [localUserId, setLocalUserId] = useState(userId);
  const [tp, setTp] = useState("");
  const [tp2, setTp2] = useState("");
  const [localTab, setLocalTab] = React.useState(tab);
  const [localMode, setLocalMode] = React.useState(mode);

  const muiTheme = useTheme();
  const fullScreen = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMobile= useMediaQuery('(max-width:1199px)');
  console.log("isMobile",isMobile);
  useEffect(() => {
    document.body.setAttribute("data-theme", localMode);
  }, [localMode]);

  useEffect(() => {
    setLocalTeam(team);
  }, [team]);

  useEffect(() => {
    setLocalPlayer(player);
  }, [player]);

  useEffect(() => {
    setLocalPageType(pagetype);
  }, [pagetype]);

  useEffect(() => {
    setLocalLeague(league);
  }, [league]);

  view = view ? view.toLowerCase() : "";
  const subscriptionObject = useSubscription();
  const updateMode = useCallback(async (mode: string) => {
    console.log("updateMode", mode)
    setLocalMode(mode);
    await setCookie({ name: 'mode', value: mode });
  }, []);

  const {
    isLoaded,
    products,
    subscription,
    redirectToCheckout,
    redirectToCustomerPortal,
  } = subscriptionObject;

  useEffect(() => {
    console.log("useEffect", isLoaded, subscription, products)
    if (isLoaded && !freeUser) {
      if (!subscription && userId) {
        const now = new Date().getTime();
        const diff: number = (now - (+(createdAt || 0))) / 1000;
        console.log("no subscription", diff)

        if (diff > 3 * 24 * 3600) { // if account created over three days ago, hard stop
          setSubscriptionPrompt(true);
          setHardStop(true);
        }
        else if (diff > 24 * 3600) {
          setSubscriptionPrompt(true);
        }
      }
    }
  }, [isLoaded, subscription, products, userId, createdAt, freeUser]);

  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    console.log(`The page is now: ${router.pathname}`, query);
    const { tab: qtab = "", view: qview = "", ssr = [] } = query as { tab: string | null, view: string | null, ssr: string[] };
    let changed = false;
    setLocalTab(qtab as string);
    setLocalView(qview as string);

    let [arg1, arg2, arg3, arg4, arg5, arg6, arg7] = ssr;
    console.log("ARGS", arg1, arg2, arg3, arg4, arg5, arg6, arg7)
    let qpagetype = 'league';
    let qleague = '';
    let qteam = '';
    let qplayer = '';
    qleague = arg2 || "";

    if (arg3 == 'team') {
      qteam = arg4;
      qpagetype = "team";
      if (arg5 == 'player') {
        qplayer = arg6;
        qpagetype = "player";
      }
    }
    else if (arg3 == 'player') {
      qplayer = arg4;
    }
    setLocalLeague(qleague);
    setLocalTeam(qteam);
    setLocalPlayer(qplayer);
    setLocalPageType(qpagetype);

  }, [router]);

  useEffect(() => {
    let params = '';
    let params2 = ''
    let p: string[] = [];
    let p2: string[] = [];

    if (fbclid)
      p.push(`fbclid=${fbclid}`);
    if (utm_content)
      p.push(`utm_content=${utm_content}`);
    p2 = [...p];

    if (p.length > 0) {
      params = `?${p.join('&')}`;
    }
    if (p2.length > 0) {
      params2 = `&${p2.join('&')}`;
    }
    let tp = localTab && localTab != 'all' ? `&tab=${localTab}` : '';
    let tp2 = tp;
    if (!params2)
      tp2 = tp.replace(/&/g, '?');
    if (!params)
      tp = tp.replace(/&/g, '?');

    setParams(params);
    setParams2(params2)
    setTp(tp);
    setTp2(tp2);
  }, [fbclid, utm_content, localTab]);

  const leagueTeamsKey: LeagueTeamsKey = { func: "leagueTeams", league: localLeague || "", noLoad: pagetype == "landing" };
  const { data: teams, error, isLoading } = useSWR(leagueTeamsKey, getLeagueTeams);
  const [localView, setLocalView] = useState(view.toLowerCase());

  useEffect(() => {
    setLocalView(view.toLowerCase());
  }, [view]);

  let v = (!localView || localView == "home") ? "mentions" : localView;
  v = v.toLowerCase();
  const onLeagueNavClick = async (l: string) => {
    setLocalLeague(l);
    setLocalView('mentions');
    setLocalPageType('league');
    setLocalTeam("")
    await recordEvent(sessionid as string || "",
      'league-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","league":"${l}"}`
    );
  }
  const LeaguesNav = leagues?.map((l: string, i: number) => {
    return l == localLeague ? <SelectedLeague key={`league-${i}`} ><Link href={`/pub/league/${l}${params}${tp}`} shallow onClick={async () => { await onLeagueNavClick(l) }} >{l}</Link></SelectedLeague> : <League key={`league-${i}`}><Link href={`/pub/league/${l}${params}${tp}`} shallow onClick={async () => { await onLeagueNavClick(l) }} >{l}</Link></League>
  });
  const MobileLeaguesNav = leagues?.map((l: string, i: number) => {
    //@ts-ignore
    return <LeaguesTab selected={l == localLeague} key={`league-${i}`} label={l} onClick={() => { onLeagueNavClick(l).then(() => { }); router.replace(`/pub/league/${l}${params}${tp}`); }} />
  })
  //@ts-ignore
  MobileLeaguesNav.unshift(<LeaguesTab selected={!localLeague} key={`league-${leagues?.length}`} icon={<HomeIcon />} onClick={() => { onLeagueNavClick('').then(() => { }); router.replace(`/pub${params}${tp}`); }} />)
  LeaguesNav.unshift(localLeague ? <League key={`league-${leagues?.length}`}><Link href={`/pub${params}${tp}`} shallow onClick={() => { onLeagueNavClick('').then(() => { }) }}><LeagueIcon><HomeIcon fontSize="medium" sx={{ m: 0.3 }} /></LeagueIcon></Link></League> : <SelectedLeague key={`league-${leagues?.length}`}><Link href={`/pub${params}${tp}`} shallow onClick={() => { onLeagueNavClick('').then(() => { }) }}><LeagueIcon><HomeIcon fontSize="medium" sx={{ m: 0.3 }} /></LeagueIcon></Link></SelectedLeague>)
  const selectedLeague = leagues?.findIndex((l: string) => l == localLeague) + 1;

  useEffect(() => {
    if (pagetype != 'landing') {
      const t2 = new Date().getTime();
      recordEvent(sessionid as string || "", `single-page-time`, `{"fbclid":"${fbclid}","utm_content":"${utm_content}","time":"${t2 - t1 || 0}"}`).then(() => { });
    }
  }, [fbclid, pagetype, sessionid, t1]);

  useEffect(() => {
    if (pagetype != 'landing') {
      try {
        recordEvent(sessionid as string || "", `single-page-loaded`, `{"fbclid":"${fbclid}","isbot":"${isbot}","league":"${league}", "team":"${team}", "player":"${player}", "pagetype":"${pagetype}", "view":"${view}", "userId":"${localUserId}", "utm_content":"${utm_content}"}`)
          .then((r: any) => {
            console.log("recordEvent", r);
          });
      } catch (x) {
        console.log('recordEvent', x);
      }
    }
  }, [pagetype, league, team, player, view, fbclid, utm_content, isbot, localUserId, sessionid]);

  const onTeamNav = async (name: string) => {
    setLocalPageType("team");
    setLocalPlayer("");
    setLocalTeam(name);
    setLocalView("mentions");
    await recordEvent(sessionid as string || "",
      'team-nav',
      `{"params":"${params}","teamid":"${name}"}`
    );
  }
  let teamName = "";
  let TeamsNav = null;

  if (teams && teams.length > 0)
    TeamsNav = teams?.map((t: { id: string, name: string }, i: number) => {
      if (t.id == localTeam)
        teamName = t.name;
      return t.id == localTeam ? <SelectedSideTeam key={`sideteam-${i}`}>
        <Link onClick={async () => { await onTeamNav(t.id); }} href={`/pub/league/${localLeague}/team/${t.id}${params}${tp}`} shallow>{t.name}</Link></SelectedSideTeam> : <SideTeam key={`sideteam-${i}`}><Link onClick={async () => { onTeamNav(t.id) }} href={`/pub/league/${localLeague}/team/${t.id}${params}${tp}`} shallow>{t.name}</Link></SideTeam>
    });
  const onViewNav = async (option: { name: string, access: string }) => {
    console.log(option);
    setLocalView(option.name);
    router.replace(localLeague ? `/pub/league/${localLeague}?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2}` : `/pub?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2}`, undefined, { shallow: true })
    await recordEvent(sessionid as string || "",
      'view-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","view":"${option.name}"}`
    );
  }
  console.log("PAGE state:", { localUserId, v, localMode, localPageType, localLeague, localTeam, localPlayer, params, params2 })

  useEffect(() => {
    let mode = getCookie('mode');
    if (!mode) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      const matches = matchMedia.matches;
      document.body.setAttribute("data-theme", matchMedia.matches ? 'dark' : 'light');
      setLocalMode(matchMedia.matches ? 'dark' : 'light');
    }
    else {
      if (mode != localMode)
        setLocalMode(mode);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Findexar</title>
        <link rel="canonical" href="https://www.findexar.com/" />
        {pagetype!='landing'&&<meta name="robots" content="noindex,nofollow" />}
        <meta property="og:description" content="Real-time annotated media mentions index for Fantasy Sports." />
        <meta name="title" content="Findexar" />
        <meta property="og:title" content="Findexar" />
        <meta name="description" content="Real-time annotated media mentions index for Fantasy Sports." />
        <meta property="og:type" content="website" />
        <meta property="fb:appid" content="358234474670240" />
        <meta property="og:site_name" content="Findexar.com" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER} />
        <meta property="og:image" content="https://findexar.com/image" />
        <meta property="findexar:verify" content="findexar" />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content={localMode == 'dark' ? palette.dark.colors.background : palette.light.colors.background} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {(pagetype != 'league' || league || team || player) && <meta name="robots" content="noindex,nofollow" />}
        <link
          rel="shortcut icon"
          type="image/png"
          href={"/blue-bell.png"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-LWYQDGSGWQ`} strategy="afterInteractive"></Script>
      <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LWYQDGSGWQ', {
            page_path: window.location.pathname,
          });
        `,
      }} />

      <MuiTP theme={muiTheme}>
        <main className={roboto.className} >
          <ThemeProvider
            //@ts-ignore
            theme={palette}>
            <GlobalStyle $light={localMode == "light"} />
            <Header>
              <HeaderTopline>
                <LeftContainer>
                  <HeaderLeft>
                    <FLogo><Link href={`/${params}`}><Avatar sx={{ bgcolor: cyan[800] }}>Fi</Avatar></Link></FLogo>
                    <FLogoMobile ><Link href={`/${params}`}><Avatar sx={{ bgcolor: cyan[800] }}>Fi</Avatar></Link></FLogoMobile>
                  </HeaderLeft>
                  <ContainerCenter>
                    <HeaderCenter>
                      <Superhead>{(localPageType == "league" || localPageType == "landing") ? <Link href={`/pub${params}`}>FINDEXAR{localLeague ? ` : ${localLeague}` : ``}</Link> : !localTeam ? `${localLeague}` : localPlayer ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${localLeague}/team/${localTeam}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${localLeague} : ${teamName}`}</Superhead>
                      <SuperheadMobile>{(localPageType == "league" || localPageType == "landing") ? <Link href={`/pub${params}`}>{localLeague ? ` ${localLeague}` : `FINDEXAR`}</Link> : !localTeam ? `${localLeague}` : localPlayer ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${localLeague}/team/${localTeam}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${teamName}`}</SuperheadMobile>
                      {(localPageType == "league" || localPageType == "landing") && <div><Subhead>Annotated real-time index of media mentions for Fantasy Sports.</Subhead><SubheadMobile>Fantasy Sports Media Index</SubheadMobile></div>}
                      {localPageType == "player" && localPlayer && <div><Subhead>{localPlayer ? localPlayer : ''}</Subhead><SubheadMobile>{localPlayer ? localPlayer : ''}</SubheadMobile></div>}
                    </HeaderCenter>
                    {localPageType == "player" && localPlayer && <Photo><PlayerPhoto teamid={localTeam || ""} name={localPlayer || ""} /></Photo>}
                  </ContainerCenter>
                </LeftContainer>
                <HeaderRight>  <IconButton color={"inherit"} size="small" onClick={async () => {
                  await updateMode(localMode == "light" ? "dark" : "light");
                }}>
                  {localMode == "dark" ? <LightModeTwoToneIcon fontSize="small" /> : <ModeNightTwoToneIcon fontSize="small" />}
                </IconButton>
                  <SUserButton afterSignOutUrl="/" />
                  {pagetype != 'landing' && !localUserId && <SignInButton><IconButton color={"inherit"} size="small" ><LoginIcon fontSize="small" /></IconButton></SignInButton>}
                </HeaderRight>
              </HeaderTopline>
            </Header>
           
            {!isMobile&&<ContainerWrap>
              <Leagues>
               {LeaguesNav}
              </Leagues>
              {pagetype == "landing" && <Landing />}
              {pagetype !== "landing" &&<MainPanel>
                <LeftPanel>
                  {localLeague ? <><SideLeagueName>{localLeague}:</SideLeagueName> {TeamsNav}</> : <> <Welcome>
                    Welcome to Findexar!<br /><hr /><br />
                    Your indispensable Fantasy Sports<br />
                    and Major Leagues athletes <br />
                    media research and tracking tool.<br /><br />
                    Finding and indexing <br />
                    mentions of pro athletes<br />
                    in the media.<br /><br /><hr />
                    Powered by OpenAI.</Welcome>
                    <br /><br />
                    <Favorites><Button disabled={view == 'fav'} onClick={() => {
                      if (v != 'readme') {
                        setLocalView("readme")
                        router.push(`/pub?view=readme${params2}${tp2}`);
                      }
                      else {
                        setLocalView("mentions")
                        router.push(`/pub${params}${tp2}`);
                      }
                    }} style={{ padding: 10 }} variant="outlined">{v == "readme" ? <HomeIcon /> : <HelpOutlineIcon />}&nbsp;&nbsp;{v == "readme" ? <span>Back to Home</span> : <span>Read Me</span>}</Button></Favorites>
                    <br /><br />
                    <LeftText><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in Minnesota. L&apos;Étoile du Nord.</LeftText>
                    {!localUserId && <LeftText>Click here to sign-in or sign-up: <br /><br /><br /><SignInButton><Button style={{ padding: 10 }} size="small" variant="outlined"><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></LeftText>}
                    <LeftText><hr />Contact: @findexar on X (Twitter)</LeftText>
                    <LeftText><br />League News Digests on X (Twitter):</LeftText>
                    <LeftText><Link href="https://twitter.com/nflpress_digest">NFL Digest</Link></LeftText>
                    <LeftText><Link href="https://twitter.com/nhl_digest">NHL Digest</Link></LeftText>
                    <LeftText><Link href="https://twitter.com/mlbpressdigest">MLB Digest</Link></LeftText>
                    <LeftText><Link href="https://twitter.com/nba_digest">NBA Digest</Link></LeftText>
                    <LeftText><Link href="https://twitter.com/mls_digest">MLS Digest</Link></LeftText>
                  </>
                  }
                </LeftPanel>
                <CenterPanel>
                  {subscriptionPrompt && !dismiss && <SubscriptionMenu hardStop={hardStop} setDismiss={setDismiss} {...subscriptionObject} />}
                  {v != "readme" && (localPageType == "team" || localPageType == "player") && <Team  findexarxid={findexarxid} tp={tp} tp2={tp2} sessionid={sessionid} params={params} params2={params2} noUser={!localUserId} setDismiss={setDismiss} subscriptionPrompt={subscriptionPrompt && !dismiss} subscriptionObject={subscriptionObject} view={v} teams={null} team={localTeam} league={localLeague} teamName={teamName} pagetype={localPageType} player={localPlayer} setLocalPlayer={setLocalPlayer} setLocalPageType={setLocalPageType} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} />}
                  {v != "readme" && localPageType == "league" && !localTeam && <Mentions findexarxid={findexarxid} tp={tp} tp2={tp2} tab={localTab} sessionid={sessionid} params={params} params2={params2} league={localLeague || ""} noUser={!localUserId} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} view={v} setLocalTab={setLocalTab} />}
                  {v == 'readme' && <Readme />}
                </CenterPanel>
              </MainPanel>}
            </ContainerWrap>}
            {isMobile&&<MobileContainerWrap>
              <MuiTabs
                value={selectedLeague}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
              >
                {MobileLeaguesNav}
              </MuiTabs>
              {pagetype == "landing" && <Landing />}
              {pagetype !== "landing" &&<div>
              {localPageType == 'league' && !localLeague &&
                <div>
                  <SecondaryTabs options={[{ name: "Mentions", icon: <MentionIcon fontSize="small" />, access: "pub" }, { name: "My Team", icon: <ListIcon fontSize="small" />, access: "pub" }, { name: "Readme", icon: <ContactSupportIcon fontSize="small" />, access: "pub" }]} onChange={async (option: any) => { await onViewNav(option); }} selectedOptionName={v} />
                  <CenterPanel>
                    {subscriptionPrompt && !dismiss && <SubscriptionMenu hardStop={hardStop} setDismiss={setDismiss} {...subscriptionObject} />}

                    <Mentions findexarxid={findexarxid} tp={tp} tp2={tp2} tab={localTab} sessionid={sessionid} params={params} params2={params2} noUser={!localUserId} league={localLeague || ""} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} view={v} setLocalTab={setLocalTab} />
                  </CenterPanel>
                </div>}
              {localPageType == 'league' && localLeague &&
                <div>
                  <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "My Team", icon: <ListIcon />, access: "pub" }]} onChange={async (option: any) => { await onViewNav(option) }} selectedOptionName={v} />
                  {v != "readme" && v == 'teams' &&
                    <LeftMobilePanel>
                      <SideLeagueName>{localLeague}:</SideLeagueName>{TeamsNav}
                    </LeftMobilePanel>}
                  <CenterPanel>
                    {subscriptionPrompt && !dismiss && <SubscriptionMenu hardStop={hardStop} setDismiss={setDismiss} {...subscriptionObject} />}
                    <Mentions findexarxid={findexarxid} tp={tp} tp2={tp2} tab={localTab} sessionid={sessionid} params={params} params2={params2} noUser={!localUserId} league={localLeague || ""} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} view={v} setLocalTab={setLocalTab} />
                  </CenterPanel>
                </div>}
              {v != "readme" && (localPageType == 'team' || localPageType == 'player') &&
                <div>
                  <Team findexarxid={findexarxid} tp={tp} tp2={tp2} sessionid={sessionid} params={params} params2={params2} noUser={!localUserId} setDismiss={setDismiss} subscriptionPrompt={subscriptionPrompt && !dismiss} subscriptionObject={subscriptionObject} view={v} teams={<LeftMobilePanel>{TeamsNav}</LeftMobilePanel>} team={localTeam} league={localLeague} teamName={teamName} pagetype={localPageType} player={localPlayer} setLocalPlayer={setLocalPlayer} setLocalPageType={setLocalPageType} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} />
                </div>
              }
              {v == 'readme' && <Readme />}
              </div>}
            </MobileContainerWrap>}
          </ThemeProvider>
        </main>
      </MuiTP>
    </>
  )
}
export default SinglePage;