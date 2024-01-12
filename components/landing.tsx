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
import { RotatingLines } from 'react-loader-spinner'
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { palette } from '@/lib/palette';
import { GlobalStyle } from '@/components/themes/globalStyle';

import { LeagueTeamsKey, getLeagueTeams, recordEvent } from '@/lib/api';
import Team from './team-page';

import Mentions from './league-mentions';
import SecondaryTabs from "./secondary-tabs";
import PlayerPhoto from "./player-photo";
import SubscriptionMenu from "./subscription-menu";
import Readme from "./readme";

const LoadingContainer = styled.div`
    position: fixed;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    z-index: 1000;
    background-color: #000;
    opacity: 0.4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const ContainerWrap = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    color:#444;
    @media screen and (max-width: 1199px) {
        display: none;
    }
    //background-color: #666;
    //color:#fff;
    a{
        color: #fff;
        text-decoration: none;
        &:hover{
        color: #4f8;
        }
    }
`;
const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 600px;
    line-height: 1.5;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    @media screen and (max-width: 1199px) {
        display: none;
    }
   
`;
const MobileTextContainer = styled.div`
    display: flex;
    flex-direction: column;
  
    //height: 100%;
    width: 250px;
    line-height: 1.5;
    font-family: 'Roboto', sans-serif;
    @media screen and (min-width: 1200px) {
        display: none;
    }
   
`
const TextContainerCenter = styled.div`
    text-align:center;
   
`;
const MobileContainerWrap = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
   // height: 100%;
    //min-height:100%;
    line-height: 1.5;
    //width: 100%;
   // padding:40px;
   // background-color: #666;
    color:#444;
    font-family: 'Roboto', sans-serif;
    @media screen and (min-width: 1200px) {
        display: none;
    }
    a{
        color: #fff;
        text-decoration: none;
        &:hover{
        color: #4f8;
        }
    }
`;

const Title = styled.div`
    font-size: 28px;
    margin:10px;
    text-align:center;
    padding-bottom:10px;
`;
const MobileTitle = styled.div`
    font-size: 18px;
    //margin:10px;
    text-align:center;
   // padding-bottom:10px;
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
const MobileLogoVContainer = styled.div`
    min-height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
`;
const MobileLogoContainer = styled.div`
    height:20px;
    display:flex;
    flex-direction:row;
    margin-top:20px;
    justify-content:flex-begin;
`;
const ButtonContainer = styled.div`
    margin-top: 120px;
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    color: #2aa;
    @media screen and (max-width: 1199px) {
        display:none;
    }
`;
const MobileButtonContainer = styled.div`
    margin-top: 20px;
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    color: #2aa;
   
    @media screen and (min-width: 1200px) {
        display:none;
    }
`;
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })


const Landing = () => {
    const [fbclid, setFbclid] = useState("");
    const [utm_content, setUtm_content] = useState("");
    const [params, setParams] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) return;
        const query = router.query;
        console.log("query", query);
        const fbclid = query.fbclid as string || "";
        const utm_content = query.utm_content as string || "";
        setUtm_content(utm_content);
        setFbclid(fbclid);

        let params = ''
        let p: string[] = [];

        console.log("parsed params", fbclid, utm_content);
        if (fbclid)
            p.push(`fbclid=${fbclid}`);
        if (utm_content)
            p.push(`utm_content=${utm_content}`);
        if (p.length > 0) {
            params = `?${p.join('&')}`;
        }
        setParams(params);
    }, [router.isReady, router.query]);
    useEffect(() => {
        if (!router.isReady) return;

        try {
            recordEvent("", `landing-loaded`, `{"fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }

    }, [router.isReady, router.query, fbclid, utm_content]);

    const theme = useTheme();
    const onClick = () => {
        try {
            setLoading(true);
            recordEvent("", `enter-clicked`, `{"fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }

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
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
                        <ContainerWrap><TextContainer>
                            <Title><h3>Welcome to Findexar!</h3></Title><br />
                            Effortlessly stays in touch with the news about your fantasy stars. Create &ldquo;My Team&ldquo; &#8212; a list of your Fantasy Team athletes, and Findexar will find and index mentions of them in the media, across more than a hundred different sources.
                            Available minutes after the publication.<br />
                            <br />Or browse leagues, teams and athletes to quickly scroll though their media mentions.


                        </TextContainer>
                        </ContainerWrap>
                        <MobileContainerWrap><MobileTextContainer>
                            <MobileTitle><h3>Welcome to Findexar!</h3></MobileTitle><br />
                            Create &ldquo; My Team&ldquo; &#8212; a list of your Fantasy Team athletes, and Findexar will find and index mentions of them in the media, across more than a hundred different sources. Available minutes after the publication.

                            <br /><br />Or browse leagues, teams and athletes to quickly scroll though their media mentions.
                        </MobileTextContainer></MobileContainerWrap>
                        <ButtonContainer><Button onClick={onClick} variant="outlined" color="primary" href={`/pub${params}`}>Enter Findexar</Button></ButtonContainer>
                        <MobileButtonContainer><Button onClick={onClick} variant="outlined" color="primary" href={`/pub${params}`}><b>Enter Findexar</b></Button></MobileButtonContainer>

                        <ContainerWrap><TextContainerCenter>{loading && <LoadingContainer><RotatingLines
                            visible={true}
                            //@ts-ignore
                            height="96"
                            width="96"
                            color="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        /></LoadingContainer>}

                            <br /><br /><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in USA.
                        </TextContainerCenter></ContainerWrap>
                        <MobileContainerWrap><TextContainerCenter> {loading && <LoadingContainer><RotatingLines
                            visible={true}
                              //@ts-ignore
                            height="96"
                            width="96"
                            color="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        /></LoadingContainer>}
                            <br /><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in USA.
                        </TextContainerCenter></MobileContainerWrap>

                    </ThemeProvider>
                </main>
            </MuiTP>
        </>

    )




}

export default Landing;