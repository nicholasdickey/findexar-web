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
import { getCookie, hasCookie } from 'cookies-next';
//local
import { palette } from '@/lib/palette';
import GlobalStyle from '@/components/globalstyles';
import { LeagueTeamsKey, getLeagueTeams, recordEvent, setCookie, AMentionKey, getAMention } from '@/lib/api';
import { AppWrapper } from '@/lib/context';
import Team from './team-page';
import Mentions from './league-mentions';
import Stories from './league-stories';
import SecondaryTabs from "./secondary-tabs";

import SubscriptionMenu from "./subscription-menu";
import Readme from "./readme";
import Landing from "./landing";

import Header from "@/components/nav-components/header";
import Desktop from "@/components/nav-components/desktop";
import Mobile from "@/components/nav-components/mobile";


//styles
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
  findexarxid: string;
}

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const SinglePage: React.FC<Props> = (props) => {
  let { findexarxid, mode, tab, t1, fbclid = "", sessionid = "", isfb, isbot, list, freeUser, createdAt, userId, utm_content, dark, leagues, league = "", team = "", pagetype = "league", player = "", view = "" } = props;

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
  const [localFindexarxid, setLocalFindexarxid] = React.useState(findexarxid);
  const [localView, setLocalView] = useState(view.toLowerCase());
  const [teamName, setTeamName] = useState("");
  const router = useRouter();
  const muiTheme = useTheme();
  const fullScreen = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMobile = useMediaQuery('(max-width:1199px)');
  console.log("isMobile", isMobile);

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


  const {
    isLoaded,
    products,
    subscription,
    redirectToCheckout,
    redirectToCustomerPortal,
  } = subscriptionObject;

  useEffect(() => {
    if (isLoaded && !freeUser) {
      if (!subscription && userId) {
        const now = new Date().getTime();
        const diff: number = (now - (+(createdAt || 0))) / 1000;
        console.log("no subscription", diff)

        if (diff > 10 * 24 * 3600) { // if account created over three days ago, hard stop
          setSubscriptionPrompt(true);
          setHardStop(true);
        }
        else if (diff > 7 * 24 * 3600) {
          setSubscriptionPrompt(true);
        }
      }
    }
  }, [isLoaded, subscription, products, userId, createdAt, freeUser]);



  useEffect(() => {
    const query = router.query;
    console.log(`The page is now: ${router.pathname}`, query);
    const { id: findexarxid = "", tab: qtab = "", view: qview = "", ssr = [] } = query as { tab: string | null, view: string | null, ssr: string[], id: string | "" };
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
        qplayer = arg6.replaceAll('_', ' ');
        qpagetype = "player";
      }
    }
    else if (arg3 == 'player') {
      qplayer = arg4.replaceAll('_', ' ');
    }
    setLocalLeague(qleague);
    setLocalTeam(qteam);
    setLocalPlayer(qplayer);
    setLocalPageType(qpagetype);
    setLocalFindexarxid(findexarxid);
  }, [router]);

  useEffect(() => {
    setLocalView(view.toLowerCase());
  }, [view]);

  let v = (!localView || localView == "home") ? "mentions" : localView;
  v = v.toLowerCase();

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

  useEffect(() => {
    if (!hasCookie('mode')) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      const matches = matchMedia.matches;
      document.body.setAttribute("data-theme", matchMedia.matches ? 'dark' : 'light');
      setLocalMode(matchMedia.matches ? 'dark' : 'light');
    }
    else {
      let mode = getCookie('mode') || "";
      if (mode != localMode)
        setLocalMode(mode);
    }
  }, []);

  const leagueTeamsKey: LeagueTeamsKey = { func: "leagueTeams", league: localLeague || "", noLoad: pagetype == "landing" };
  const { data: teams, error, isLoading } = useSWR(leagueTeamsKey, getLeagueTeams);


  const onLeagueNavClick = useCallback(async (l: string) => {
    setLocalLeague(l);
    setLocalView('mentions');
    setLocalPageType('league');
    setLocalTeam("")
    await recordEvent(sessionid as string || "",
      'league-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","league":"${l}"}`
    );
  }, [fbclid, utm_content, sessionid]);

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

  const onTeamNav = useCallback(async (name: string) => {
    setLocalPageType("team");
    setLocalPlayer("");
    setLocalTeam(name);
    setLocalView("mentions");
    await recordEvent(sessionid as string || "",
      'team-nav',
      `{"params":"${params}","teamid":"${name}"}`
    );
  }, [sessionid, params]);

  
  
  const onViewNav = useCallback(async (option: { name: string, access: string }) => {
    console.log(option);
    setLocalView(option.name);
    router.replace(localLeague ? `/pub/league/${localLeague}?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2.replace('?', '&')}` : `/pub?view=${encodeURIComponent(option.name.toLowerCase())}${params2}${tp2.replace('?', '&')}`, undefined, { shallow: true })
    await recordEvent(sessionid as string || "",
      'view-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","view":"${option.name}"}`
    );
  }, [fbclid, utm_content, sessionid, localLeague, params2, tp2]);

  console.log("PAGE state:", { localUserId, v, localMode, localPageType, localLeague, localTeam, localPlayer, params, params2 })

  const key: AMentionKey = { type: "AMention", findexarxid: localFindexarxid, noLoad: localFindexarxid !== "" ? false : true };
  const { data: amention } = useSWR(key, getAMention)
  const { summary: amentionSummary = "", league: amentionLeague = "", type = "", team: amentionTeam = "", teamName: amentionTeamName = "", name: amentionPlayer = "", image: amentionImage = "", date: amentionDate = "" } = amention ? amention : {};

  //prep meta data for amention
  let ogUrl = '';
  if (amention && amentionLeague && amentionTeam && amentionPlayer)
    ogUrl = `${process.env.NEXT_PUBLIC_SERVER}pub/league/${amentionLeague}/team/${amentionTeam}/player/${amentionPlayer}?id=${localFindexarxid}`;
  else if (amention && amentionLeague && amentionTeam)
    ogUrl = `${process.env.NEXT_PUBLIC_SERVER}pub/league/${amentionLeague}/team/${amentionTeam}?id=${localFindexarxid}`;
  else if (amention && amentionLeague)
    ogUrl = `${process.env.NEXT_PUBLIC_SERVER}pub/league/${amentionLeague}?id=${localFindexarxid}`;
  else if (amention)
    ogUrl = `${process.env.NEXT_PUBLIC_SERVER}pub?id=${localFindexarxid}`;
  else
    ogUrl = `${process.env.NEXT_PUBLIC_SERVER}`;

  let ogTarget = '';
  if (amention && amentionLeague && amentionTeam && amentionPlayer && type == 'person')
    ogTarget = `${amentionPlayer} of ${amentionTeamName}`;
  else if (amention && amentionLeague && amentionTeam)
    ogTarget = `${amentionTeamName} on Findexar`;

  let ogDescription = amentionSummary ? amentionSummary : "Fantasy Sports Media Tracker.";
  let ogImage = amentionImage ? amentionImage : "https://findexar.com/findexar-logo.png";
  let ogTitle = ogTarget ? `${ogTarget}` : "Findexar Sports Media Tracker";

  return (
    <>
      <Head>
        <title>Qwiket</title>
        <link rel="canonical" href={ogUrl} />
        {pagetype != 'landing' && <meta name="robots" content="noindex,nofollow" />}
        <meta property="og:description" content={ogDescription} />
        <meta name="title" content={ogTitle} />
        <meta property="og:title" content={ogTitle} />
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="fb:appid" content="358234474670240" />
        <meta property="og:site_name" content="qwiket.com" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="findexar:verify" content="findexar" />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@findexar" />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
        <link rel="apple-touch-icon" href="/FiLogo.png"></link>
        <meta name="theme-color" content={localMode == 'dark' ? palette.dark.colors.background : palette.light.colors.background} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {(pagetype != 'league' || league || team || player) && <meta name="robots" content="noindex,nofollow" />}
        <link
          rel="shortcut icon"
          type="image/png"
          href={"/FiLogo.png"}
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
            <AppWrapper userId={localUserId} isMobile={isMobile} setUserId={setLocalUserId} params={params} params2={params2} tp={tp} tp2={tp2} findexarxid={localFindexarxid} view={v} tab={localTab} noUser={!localUserId} mode={localMode} setMode={setLocalMode} pagetype={localPageType} sessionid={sessionid} setLeague={setLocalLeague} setPagetype={setLocalPageType} setPlayer={setLocalPlayer} setTeam={setLocalTeam} setTab={setLocalTab} setView={setLocalView} league={localLeague} team={localTeam} player={localPlayer} fbclid={fbclid} utm_content={utm_content} teamName={teamName} setTeamName={setTeamName}>
           
            <Header leagues={leagues}/>
            

            {!isMobile && <Desktop/>}
            {isMobile && <Mobile/>}
             </AppWrapper>
          </ThemeProvider>
        </main>

      </MuiTP>
    </>
  )
}
export default SinglePage;