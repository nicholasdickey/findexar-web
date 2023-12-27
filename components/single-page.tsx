
import React from "react";
import Head from 'next/head'
import Link from 'next/link'
import { Roboto } from 'next/font/google';
import 'material-icons/iconfont/outlined.css';
import Script from "next/script";
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable'
import { styled, ThemeProvider } from "styled-components";
import { LeagueTeamsKey, getLeagueTeams } from '@/lib/api';
import Team from './team-page';
import Mentions from './league-mentions';
import { palette } from '@/lib/palette';
import { GlobalStyle } from '@/components/themes/globalStyle';

const Header = styled.header`
  height: 70px;
  width: 100%;
  background-color: #444;
  color: #fff;
  text-align: center;
  font-size: 40px;
  padding-top: 10px;
  margin: 0px;
  a{
      color: #fff;
      text-decoration: none;
      &:hover{
        color: #4f8;
      }  
  }
`;

const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
interface Props {
  disable?: boolean;
  dark?: number;
  fbclid?: string;
  utm_content?: string;
  isbot?: number;
  isfb?: number;
  sessionid?: string;
  leagues?: string[];
  league?: string;
  team?: string;
  player?: string;
  pagetype?: string;
}
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const Landing: React.FC<Props> = (props) => {
  const { dark, leagues, league, team, pagetype, player } = props;
  const leagueTeamsKey: LeagueTeamsKey = { func: "leagueTeams", league: league || "" };
  const teams = useSWR(leagueTeamsKey, getLeagueTeams).data;

  const LeaguesNav = leagues?.map((l:string,i:number) => {
    return l == league ? <SelectedLeague key={`league-${i}`}><Link href={`/league/${l}`}>{l}</Link></SelectedLeague> : <League><Link href={`/league/${l}`}>{l}</Link></League>
  });

  let teamName = "";
  let TeamsNav = null;
  
  if (teams && teams.length > 0)
    TeamsNav = teams?.map((t: { id: string, name: string },i:number) => {
      if (t.id == team)
        teamName = t.name;
      return t.id == team ? <SelectedSideTeam key={`sideteam-${i}`}><Link href={`/league/${league}/team/${t.id}`}>{t.name}</Link></SelectedSideTeam> : <SideTeam key={`sideteam-${i}`}><Link href={`/league/${league}/team/${t.id}`}>{t.name}</Link></SideTeam>
    });

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

      <main className={roboto.className} >
        <ThemeProvider
          //@ts-ignore
          theme={palette}>
          <GlobalStyle />
          <Header>
            <Link href="/league">FINDEXAR</Link>
          </Header>
          <ContainerWrap>
            <Leagues>
              {LeaguesNav}
            </Leagues>
            <MainPanel>
              <LeftPanel>
                {league ? TeamsNav : <Welcome>Welcome to Findexar!<br /><hr /><br />Your indespensible Fantasy Sports<br/> research tool!<br /><br/>Monitoring and indexing <br/>athlete mentions<br/>by pro sports writers in <br/> the media.</Welcome>}
              </LeftPanel>
              <CenterPanel>
                {(pagetype == "team" || pagetype == "player") && <Team team={team} league={league} teamName={teamName} pagetype={pagetype} player={player} />}
                {pagetype == "league" && !team && <Mentions league={league || ""} />}
              </CenterPanel>
            </MainPanel>
          </ContainerWrap>
        </ThemeProvider>
      </main>
    </>
  )
}
export default Landing;