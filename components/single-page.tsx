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
import { ThemeProvider as MuiTP } from '@mui/material/styles';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
//clerk
import { UserButton } from "@clerk/nextjs";
//stripe
import { useSubscription } from "use-stripe-subscription";
//other
import 'material-icons/iconfont/outlined.css';
import { getCookie, hasCookie } from 'cookies-next';
//local
import { palette } from '@/lib/palette';
import GlobalStyle from '@/components/globalstyles';
import { recordEvent, AMentionKey, getAMention,AStoryKey,getAStory } from '@/lib/api';
import { AppWrapper } from '@/lib/context';

import Header from "@/components/nav-components/header";
import Desktop from "@/components/nav-components/desktop";
import Mobile from "@/components/nav-components/mobile";


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
  sid: string;
}

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const SinglePage: React.FC<Props> = (props) => {
  let { findexarxid, sid, mode, tab, t1, fbclid = "", sessionid = "", isfb, isbot, list, freeUser, createdAt, userId, utm_content, dark, leagues, league = "", team = "", pagetype = "league", player = "", view = "" } = props;

  const [localTeam, setLocalTeam] = useState(team);
  const [localPlayer, setLocalPlayer] = useState(player);
  const [localPageType, setLocalPageType] = useState(pagetype || 'landing');
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
  const [localSid, setLocalSid] = React.useState(sid);
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
    console.log("setPagetype:", pagetype)
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
    //console.log(`The page is now: ${router.pathname}`, query);
    const { id: findexarxid = "", tab: qtab = "", view: qview = "", ssr = [] } = query as { tab: string | null, view: string | null, ssr: string[], id: string | "" };

    setLocalTab(qtab as string);
    setLocalView(qview as string);

    let [arg1, arg2, arg3, arg4, arg5, arg6, arg7] = ssr;
    //console.log("ARGS", arg1, arg2, arg3, arg4, arg5, arg6, arg7)
    let qpagetype = 'league';
    let qleague = '';
    let qteam = '';
    let qplayer = '';
    qleague = arg2 || "";

    if (view == 'landing')
      qpagetype = "landing";

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

  const onLeagueNavClick = useCallback(async (l: string) => {
    setLocalLeague(l);
    setLocalView('mentions');
    console.log("onLeagueNavClick", l, "setpagetype league2")
    setLocalPageType('league');
    setLocalTeam("")
    await recordEvent(sessionid as string || "",
      'league-nav',
      `{"fbclid":"${fbclid}","utm_content":"${utm_content}","league":"${l}"}`
    );
  }, [fbclid, utm_content, sessionid]);

  console.log("PAGE state:", { localUserId, v, localMode, localPageType, localLeague, localTeam, localPlayer, params, params2 })

  const key: AMentionKey = { type: "AMention", findexarxid: localFindexarxid, noLoad: localFindexarxid !== "" ? false : true };
  const { data: amention } = useSWR(key, getAMention)
  const { summary: amentionSummary = "", league: amentionLeague = "", type = "", team: amentionTeam = "", teamName: amentionTeamName = "", name: amentionPlayer = "", image: amentionImage = "", date: amentionDate = "" } = amention ? amention : {};

  const astoryKey: AStoryKey = { type: "AStory", sid:sid, noLoad: localSid == "" ? true : false };
  const { data: astory } = useSWR(astoryKey, getAStory)
  const { title:astoryTitle="",site_name:astorySite_Name="",authors:astoryAuthors="",digest: astoryDigest = "", image: astoryImage = "", createdTime: astoryDate = "" ,mentions:mentions=[]} = astory ? astory : {};

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
  if(astory){
    ogUrl= league?`${process.env.NEXT_PUBLIC_SERVER}pub/league/${league}?sid=${localSid}`:`${process.env.NEXT_PUBLIC_SERVER}pub?sid=${localSid}`;
    ogTitle=astoryTitle;;
    ogDescription=astoryDigest;
    ogImage=astoryImage;
  }
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
            <AppWrapper userId={localUserId} isMobile={isMobile} setUserId={setLocalUserId} params={params} params2={params2} tp={tp} tp2={tp2} findexarxid={localFindexarxid} view={v} tab={localTab} noUser={!localUserId} mode={localMode} setMode={setLocalMode} pagetype={localPageType} sessionid={sessionid} setLeague={setLocalLeague} setPagetype={setLocalPageType} setPlayer={setLocalPlayer} setTeam={setLocalTeam} setTab={setLocalTab} setView={setLocalView} league={localLeague} team={localTeam} player={localPlayer} fbclid={fbclid} utm_content={utm_content} teamName={teamName} setTeamName={setTeamName} sid={localSid} setSid={setLocalSid}>
              <Header leagues={leagues} />
              {!isMobile && <Desktop />}
              {isMobile && <Mobile />}
            </AppWrapper>
          </ThemeProvider>
        </main>
      </MuiTP>
    </>
  )
}

export default SinglePage;