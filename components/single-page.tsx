
import React, { use, useEffect, useState } from "react";
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Roboto } from 'next/font/google';
import 'material-icons/iconfont/outlined.css';
import Script from "next/script";
import useSWR from 'swr';
import { useSubscription } from "use-stripe-subscription";
import { styled, ThemeProvider } from "styled-components";
import { Tabs, Tab, Alert } from '@mui/material'
import { ThemeProvider as MuiTP, createTheme } from '@mui/material/styles';
import { blueGrey, cyan, teal } from '@mui/material/colors'
import HomeIcon from '@mui/icons-material/HomeOutlined';
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { UserButton, SignInButton,SignedOut,SignedIn } from "@clerk/nextjs";
import { palette } from '@/lib/palette';
import { GlobalStyle } from '@/components/themes/globalStyle';

import { LeagueTeamsKey, getLeagueTeams, recordEvent } from '@/lib/api';
import Team from './team-page';

import Mentions from './league-mentions';
import SecondaryTabs from "./secondary-tabs";
import PlayerPhoto from "./player-photo";
import SubscriptionMenu from "./subscription-menu";
import Readme from "./readme";

const Header = styled.header`
  height: 80px;
  width: 100%;
  background-color: #333;
  color: #fff;
  text-align: center;
  font-size: 40px;
  padding-top: 10px;
  padding-bottom:10px;
  font-family: 'Roboto', sans-serif;
  
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
  font-family: 'Roboto', sans-serif;
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
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;

const SideTeam = styled.div`
  height: 40px;
  width: 300px; 
  color: #aaa;
  
 // text-align: center;
  font-size: 18px;
  padding-left:20px;
  margin: 10px;
`;

const SelectedSideTeam = styled.div`
  height: 40px;
  width: 300px;
  color: #ff8 !important;
  //text-align: center;
  font-size: 18px;
  padding-left:20px;
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
  align-items: center;
  height: 38px;
  width: 100%;
  background-color: #555;
  color: #aaa;
  text-align: center;
  font-size: 28px;
  margin: 0px;
  a{
    color: #ccc;
    text-decoration: none;
    &:hover{
      color: #4f8;
    } 
  }
`;

const LeftPanel = styled.div`
  width:300px;
  height:auto !important;
  height:100%;
  min-height: 200vw;
  background-color:  #333;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-top:18px;
  a{
    color: #ccc;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;
const Favorites = styled.div`
  margin-top:28px;
  margin-left:22px;
  width:100%;
  height:40px;
  color:#aaa;
  //align-self:center;
  font-size:12px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;
const LeftText = styled.div`
  padding-top:28px;
  padding-left:22px;
  padding-right:20px;
  //width:100%;
  color:#bbb;
  //align-self:center;
  font-size:12px;
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
  padding-left:22px;
  color:#aaa;
  //align-self:center;
  font-size:13px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
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
 // width:100%;
  height:100%;
`;
const MuiTabs = styled(Tabs)`
  width:100%;
  padding:0px;
  margin:0px;
`;
const Subhead = styled.div`
  font-size: 18x;
  margin-top:4px;
  text-align:left;
  color: ${blueGrey[200]};
  font-size:18px;
  @media screen and (max-width: 1199px ){
   display:none;
  }
`;
const SubheadMobile = styled.div`
  font-size: 17px;
  margin-top:4px;
  text-align:left;
  color: ${blueGrey[200]};
  font-size:14px;
  width:200px;
  @media screen and (min-width: 1200px ){
    display:none;
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
const LeftContainer = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  //align-items:center;
`;
const HeaderLeft = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  height:56px;
  margin-left:20px;
  //margin-right:20px;
  @media screen and (max-width: 1199px) {
    margin-left:0px;
    margin-right:0px;
  }
`;
const ContainerCenter = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
`;
const HeaderCenter = styled.div`
margin-left:60px;
display:flex;
flex-direction:column;
align-items: flex-start;
@media screen and (max-width: 1199px) {
    margin-left:0px;
    width:120px;
   
  }
`;
const HeaderRight = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  margin-left:20px;
  margin-top:0px;
  //width:40px;
  
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
const Photo = styled.div`
  height:60px;
  width:60px;
  @media screen and (max-width: 1199px) {
    height:50px;
    width:50px;
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
//padding-top:30px;
height:80px;
width:80px;
  img{
    width:80px !important;
    height:80px !important;
  }
  &.cl-avatarBox{
    width:80px !important;
    height:80px !important;
  }
  &.cl-formButtonPrimary {
    font-size: 14px;
    text-transform: none;
    background-color: #611bbd;
    width:80px;
    height:80px;
}
`;
const PlayerNameGroup = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  font-size: 28px;
  //margin-left:20px;
  margin-right:20px;
  @media screen and (max-width: 1199px) {
    font-size: 14px;
    margin-right:0px;
  }
`;
const PlayerName = styled.div`
 //margin-right:20px;
 text-align:left;
`;
const NewListForm = styled.div`
padding-right:20px;
  color: #fff;//${blueGrey[900]};
  font-size:18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items:flex-start;
  //background-color:#000;// ${blueGrey[800]};
  &.MuiTextField-root{
    color:#fff !important;
  }
  input{
    color:#fff;
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
  userId?: string;
  createdAt?: string;
  freeUser?: boolean;
  list?: string;
  t1: number;
}

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const Landing: React.FC<Props> = (props) => {
  let { t1, fbclid = "", sessionid = "", isfb, isbot, list, freeUser, createdAt, userId, utm_content, dark, leagues, league = "", team = "", pagetype = "league", player = "", view = "" } = props;
  const [localTeam, setLocalTeam] = useState(team);
  const [localPlayer, setLocalPlayer] = useState(player);
  const [localPageType, setLocalPageType] = useState(pagetype);
  const [localLeague, setLocalLeague] = useState(league);
  const [subscriptionPrompt, setSubscriptionPrompt] = useState(false);
  const [dismiss, setDismiss] = useState(false);
  const [hardStop, setHardStop] = useState(false);
  const [addList, setAddList] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [readme, setReadme] = useState(false);
  const [params, setParams] = useState("");
  const [params2, setParams2] = useState("");
  if (userId == "null")
    userId = "";
  console.log("pageType:", localPageType)

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  console.log("localLeague=", localLeague, "league=", league);
  //const [redirect:(args: redirectToCheckoutArgs) => Promise<void>, setRedirect] = useState(null);
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
  //console.log("==============>", subscriptionObject)
  // if (subscriptionObject) {
  const {
    isLoaded,
    products,
    subscription,
    redirectToCheckout,
    redirectToCustomerPortal,
  } = subscriptionObject;
  console.log("isLoaded", isLoaded, subscription, products)
  useEffect(() => {
    console.log("useEffect", isLoaded, subscription, products)
    if (isLoaded && !freeUser) {
      if (!subscription && userId) {
        //setRedirect(redirectToCheckout);
        //time now in milliseconds:
        const now = new Date().getTime();
        const diff: number = (now - (+(createdAt || 0))) / 1000;
        console.log("no subscription", diff)

        if (diff > 3 * 24 * 3600) { // if account created over three days ago, hard stop
          setSubscriptionPrompt(true);
          setHardStop(true);
        }
        else if (diff > 24 * 3600) {
          // axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/subscription/update-ping`);
          setSubscriptionPrompt(true);
          //setHardStop(true);
        }
        //redirectToCheckout({ price: products[0] }); // Fix: Pass the required argument
      }
      //return null;
    }
  }, [isLoaded, subscription, products, userId, createdAt, freeUser]);

  //}
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;
    console.log("query", query);
    fbclid = query.fbclid as string || "";
    utm_content = query.utm_content as string || "";
    let params = '';
    let params2 = ''
    let p: string[] = [];
    let p2: string[] = [];
    console.log("parsed params", fbclid, utm_content);
    if (fbclid)
      p.push(`fbclid=${fbclid}`);
    if (utm_content)
      p.push(`utm_content=${utm_content}`);
    p2 = [...p];
    if (localView != `mentions`) {
      p.push(`view=${localView}`);
    }
    if (p.length > 0) {
      params = `?${p.join('&')}`;
    }
    if (p2.length > 0) {
      params2 = `&${p2.join('&')}`;
    }

    console.log("params:", utm_content, localView, params, params2);
    setParams(params);
    setParams2(params2);
  }, [router.isReady, router.query]);


  const leagueTeamsKey: LeagueTeamsKey = { func: "leagueTeams", league: localLeague || "" };
  const { data: teams, error, isLoading } = useSWR(leagueTeamsKey, getLeagueTeams);

  if (!view)
    view = "home";
  if (view == "home")
    view = "mentions";
  const [localView, setLocalView] = useState(view);
  useEffect(() => {
    setLocalView(view);
  }, [view]);


  const onLeagueNavClick=async (l:string)=>{
      setLocalLeague(l); 
      setLocalView('mentions'); 
      setLocalPageType('league'); 
      setLocalTeam("") 
      await recordEvent (sessionid as string||"", 
      'league-nav', 
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","league":"${l}"}`
      );
  }
  const LeaguesNav = leagues?.map((l: string, i: number) => {
    return l == localLeague ? <SelectedLeague key={`league-${i}`} ><Link href={`/pub/league/${l}${params}`} onClick={async () => {await onLeagueNavClick(l)}} >{l}</Link></SelectedLeague> : <League key={`league-${i}`}><Link href={`/pub/league/${l}${params}`} onClick={async () => {await onLeagueNavClick(l)}} >{l}</Link></League>
  });
  const MobileLeaguesNav = leagues?.map((l: string, i: number) => {
    return <Tab key={`league-${i}`} label={l} onClick={() => { onLeagueNavClick(l).then(()=>{}); router.replace(`/pub/league/${l}${params}`); }} />
  })
  MobileLeaguesNav.unshift(<Tab key={`league-${leagues?.length}`} icon={<HomeIcon />} onClick={() => { onLeagueNavClick('mentions').then(()=>{}); router.replace(`/pub${params}`); }} />)
  LeaguesNav.unshift(localLeague ? <League key={`league-${leagues?.length}`}><Link href={`/pub${params}`} onClick={() => { onLeagueNavClick('mentions').then(()=>{}) }}><HomeIcon sx={{ m: 0.3 }} /></Link></League> : <SelectedLeague key={`league-${leagues?.length}`}><Link href={`/pub${params}`} onClick={() => { onLeagueNavClick('mentions').then(()=>{}) }}><HomeIcon sx={{ m: 0.3 }} /></Link></SelectedLeague>)
  console.log("userId", userId);
  const selectedLeague = leagues?.findIndex((l: string) => l == localLeague) + 1;
  console.log("selectedLeague", selectedLeague)

  /*useEffect(() => {
    const t2= new Date().getTime();
    recordEvent(sessionid as string||"", 'load-time', `{"fbclid":"${fbclid}","isbot":"${isbot}","league":"${league}", "team":"${team}", "player":"${player}", "pagetype":"${pagetype}", "view":"${view}", "userId":"${userId}", "utm_content":"${utm_content}","time":"${t2-t1||0}"}`);

  },[]);*/
  useEffect(() => {
    if (!router.isReady) return;
    try {
      recordEvent(sessionid as string || "", 'single-page-loaded', `{"fbclid":"${fbclid}","isbot":"${isbot}","league":"${league}", "team":"${team}", "player":"${player}", "pagetype":"${pagetype}", "view":"${view}", "userId":"${userId}", "utm_content":"${utm_content}"}`)
      .then((r: any) => {
        console.log("recordEvent", r);
      });
    } catch (x) {
      console.log('recordEvent', x);
    }
  }, [router.isReady, pagetype, league, team, player, view, fbclid, utm_content]);
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
  };
  /* if (dark) {
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
   }*/
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
        <Link onClick={async () => {await onTeamNav(t.id);  }} href={`/pub/league/${localLeague}/team/${t.id}${params}`}>{t.name}</Link></SelectedSideTeam> : <SideTeam key={`sideteam-${i}`}><Link onClick={async () => { onTeamNav(t.id) }} href={`/pub/league/${localLeague}/team/${t.id}${params}`}>{t.name}</Link></SideTeam>
    });

  console.log("view", localView)
  const onViewNav=async(option:{name:string,access:string})=>{
     console.log(option); 
     setLocalView(option.name); 
     router.replace(localLeague ? `/${option.access || "pub"}/league/${localLeague}?view=${encodeURIComponent(option.name)}${params2}` : `/${option.access}?view=${encodeURIComponent(option.name)}${params2}`)
     await recordEvent (sessionid as string||"", 
     'view-nav', 
     `{"fbclid":"${fbclid}","utm_content":"${utm_content}","view":"${option.name}"}`
     );
    }
  return (
    <>
      <Head>
        <title>Findexar</title>
        <link rel="canonical" href="https://www.findexar.com/" />
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

      <MuiTP theme={theme}>
        <main className={roboto.className} >
          <ThemeProvider
            //@ts-ignore
            theme={palette}>
            <GlobalStyle />
            <Header>
              <HeaderTopline>
                <LeftContainer> <HeaderLeft>
                  <FLogo><Link href="/pub"><Avatar sx={{ bgcolor: cyan[800] }}>Fi</Avatar></Link></FLogo>
                  <FLogoMobile ><Link href="/pub"><Avatar sx={{ bgcolor: cyan[800] }}>Fi</Avatar></Link></FLogoMobile>
                </HeaderLeft>
                  <ContainerCenter>

                    <HeaderCenter>
                      {localPageType == "league" && !localLeague && !localTeam ? <Link href={`/pub${params}`}>FINDEXAR</Link> : !localTeam ? `${localLeague}` : localPlayer ? <PlayerNameGroup><PlayerName><Link href={`/pub/league/${localLeague}/team/${localTeam}${params}`}>{teamName}</Link></PlayerName> </PlayerNameGroup> : `${teamName}`}
                      {localPageType == "league" && !localLeague && !localTeam && <div><Subhead>Major Leagues and Fantasy Sports Professional Athletes and Teams Media Monitor</Subhead><SubheadMobile>Professional Athletes<br />Media Index And Monitor</SubheadMobile></div>}

                      {localPageType == "player" && localPlayer && <div><Subhead>{localPlayer ? localPlayer : ''}</Subhead><SubheadMobile>{localPlayer ? localPlayer : ''}</SubheadMobile></div>}

                    </HeaderCenter>
                    {localPageType == "player" && localPlayer && <Photo><PlayerPhoto teamid={localTeam || ""} name={localPlayer || ""} /></Photo>}

                  </ContainerCenter>

                </LeftContainer>

                <HeaderRight>  <SUserButton afterSignOutUrl="/" /></HeaderRight>
              </HeaderTopline>
            </Header>

            <ContainerWrap>
              <Leagues>
                {LeaguesNav}
              </Leagues>

              <MainPanel>

                <LeftPanel>
                  {localLeague ? TeamsNav : <> <Welcome>
                    Welcome to Findexar!<br /><hr /><br />
                    Your indispensable Fantasy Sports<br />
                    and Major Leagues athletes <br />
                    media research and tracking tool.<br /><br />
                    Finding and indexing <br />
                    mentions of pro athletes<br />
                    in the media.<br /><br /><hr />
                    Powered by OpenAI.</Welcome>
                    <br /><br />
                    <Favorites><Button disabled={localView == 'readme'} onClick={() => {


                      if (localView != 'fav') {
                        setLocalView("fav")
                        // setLocalPageType("Favorites");
                        // setLocalLeague("");
                        // setLocalTeam("");
                        //  setFavorites(true);
                        router.push(`/pro?view=fav${params2}`);
                      }
                      else {
                        setLocalView("mentions")
                        //  setFavorites(false);
                        router.push(`/pub${params2}`);

                      }

                    }} style={{ padding: 10 }} variant="outlined">{localView == "fav" ? <HomeIcon /> : <StarOutlineIcon />}&nbsp;&nbsp;{localView == "fav" ? <span>Back to Home</span> : <span>My Favorites</span>}</Button></Favorites>

                    <Favorites><Button disabled={view == 'fav'} onClick={() => {

                      if (localView != 'readme') {
                        setLocalView("readme")
                        // setLocalPageType("Favorites");
                        // setLocalLeague("");
                        // setLocalTeam("");
                        // setReadme(true);
                        router.push(`/pub?view=readme${params2}`);
                      }
                      else {
                        // setReadme(false);
                        setLocalView("mentions")
                        router.push(`/pub${params2}`);
                      }


                    }} style={{ padding: 10 }} variant="outlined">{localView == "readme" ? <HomeIcon /> : <HelpOutlineIcon />}&nbsp;&nbsp;{localView == "readme" ? <span>Back to Home</span> : <span>Read Me</span>}</Button></Favorites>
                    <br /><br />
                    <LeftText><b>&ldquo;My Team&ldquo; tracker List:</b> Use &ldquo;add to list&ldquo; icons next to player name in team rosters to add or remove players to tracker list.<br /><br /><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in USA.</LeftText>
                    {!userId && <LeftText>Needs to be a logged-in user to explore the teams and individual athletes&apos; mentions and use the tracker list or &ldquo;favorites&ldquo; functionality.<br /><br />Click here to sign-in or sign-up: <br /><br /><br /><SignInButton><Button style={{ padding: 10 }} size="small" variant="outlined"><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton></LeftText>}
                  </>
                  }
                </LeftPanel>
                <CenterPanel>
                  {subscriptionPrompt && !dismiss && <SubscriptionMenu hardStop={hardStop} setDismiss={setDismiss} {...subscriptionObject} />}
                  {localView != "readme" && (localPageType == "team" || localPageType == "player") && <Team sessionid={sessionid} params={params} params2={params2} noUser={!userId} setDismiss={setDismiss} subscriptionPrompt={subscriptionPrompt && !dismiss} subscriptionObject={subscriptionObject} view={localView} teams={null} team={localTeam} league={localLeague} teamName={teamName} pagetype={localPageType} player={localPlayer} setLocalPlayer={setLocalPlayer} setLocalPageType={setLocalPageType} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} />}
                  {localPageType == "league" && !localTeam && <Mentions sessionid={sessionid} params={params} params2={params2} league={localLeague || ""} noUser={!userId} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} view={localView} />}
                  {localView == 'readme' && <Readme />}
                </CenterPanel>
              </MainPanel>
            </ContainerWrap>
            <MobileContainerWrap>
              <MuiTabs
                value={selectedLeague}
                // onChange={(event: React.SyntheticEvent, newValue: number) => { setLocalLeague(newValue ? leagues[newValue - 1] : '');setLocalView('mentions');router.replace(`/pub/league/${newValue ? leagues[newValue - 1] : ''}?view=Mentions`) }}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
              >
                {MobileLeaguesNav}
              </MuiTabs>
              {localPageType == 'league' && !localLeague &&
                <div>
                  <SecondaryTabs options={[{ name: "Mentions", icon: <MentionIcon />, access: "pub" }, { name: "My Team", icon: <ListIcon />, access: "pro" }, { name: "Readme", icon: <ContactSupportIcon />, access: "pub" }]} onChange={async(option:any)=>{await onViewNav(option);}} selectedOptionName={localView} />
                  <CenterPanel>
                    {subscriptionPrompt && !dismiss && <SubscriptionMenu hardStop={hardStop} setDismiss={setDismiss} {...subscriptionObject} />}

                    <Mentions sessionid={sessionid} params={params} params2={params2} noUser={!userId} league={localLeague || ""} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} view={localView} />
                  </CenterPanel>
                </div>}
              {localPageType == 'league' && localLeague &&
                <div>
                  <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> }, { name: "Mentions", icon: <MentionIcon /> }, { name: "My Team", icon: <ListIcon />, access: "pro" }]} onChange={async (option: any) => { await onViewNav(option) }} selectedOptionName={localView} />
                  {localView != "readme" && localView == 'teams' &&
                    <LeftMobilePanel>{TeamsNav}</LeftMobilePanel>}

                  <CenterPanel>
                    {subscriptionPrompt && !dismiss && <SubscriptionMenu hardStop={hardStop} setDismiss={setDismiss} {...subscriptionObject} />}

                    <Mentions sessionid={sessionid} params={params} params2={params2} noUser={!userId} league={localLeague || ""} setLocalPageType={setLocalPageType} setLocalPlayer={setLocalPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} view={localView} />
                  </CenterPanel>
                </div>}
              {localView != "readme" && (localPageType == 'team' || localPageType == 'player') &&
                <div>
                  <Team sessionid={sessionid} params={params} params2={params2} noUser={!userId} setDismiss={setDismiss} subscriptionPrompt={subscriptionPrompt && !dismiss} subscriptionObject={subscriptionObject} view={localView} teams={<LeftMobilePanel>{TeamsNav}</LeftMobilePanel>} team={localTeam} league={localLeague} teamName={teamName} pagetype={localPageType} player={player} setLocalPlayer={setLocalPlayer} setLocalPageType={setLocalPageType} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalView={setLocalView} />
                </div>
              }
              {localView == 'readme' && <Readme />}
            </MobileContainerWrap>
          </ThemeProvider>
        </main>
      </MuiTP>
    </>
  )
}
export default Landing;