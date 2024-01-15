import React, { use, useEffect, useState } from "react";
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Roboto } from 'next/font/google';
import 'material-icons/iconfont/outlined.css';
import Script from "next/script";
import { styled, ThemeProvider } from "styled-components";
import { ThemeProvider as MuiTP, createTheme } from '@mui/material/styles';

import { Watch } from 'react-loader-spinner'
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { palette } from '@/lib/palette';
import GlobalStyle from '@/components/globalstyles';

import { recordEvent } from '@/lib/api';
const OuterContainer = styled.div`
    background-color:var(--highBackground);
    padding-bottom:200px;
`;
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
    color:var(--text);
   // background-color: var(--background);
  //  color:#444;
    @media screen and (max-width: 1199px) {
        display: none;
    }
    //background-color: #666;
    //color:#fff;
    a{
        color:var(--text);
        text-decoration: none;
        &:hover{
        color:var(--highlight);
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
    justify-content: flex-start;
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
const MobileVContainer = styled.div`
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 1200px) {
        display: none;
    }
`;
const MobileContainerWrap = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    //min-height:100%;
    line-height: 1.5;
    //width: 100%;
   // padding:40px;
   // background-color: #666;
    //olor:#444;

    font-family: 'Roboto', sans-serif;
    @media screen and (min-width: 1200px) {
        display: none;
    }
    a{
        color: var(--text);
        text-decoration: none;
        &:hover{
        color: var(--highlight);
        }
    }
`;

const Title = styled.div`
    font-size: 28px;
    width:100%;
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
    //color: #2aa;
    color:var(--text);
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
    color:var(--text);
    padding-bottom:30px;
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
    const [localMode, setLocalMode] = useState("");
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
            //setLoading(true);
            recordEvent("", `enter-clicked`, `{"fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }

    }
    return (

        <OuterContainer><ContainerWrap><TextContainer>
            <Title><h3>Welcome to Findexar!</h3></Title><br />
            <p>Effortlessly stay in touch with the latest news about your fantasy sports stars.
                Create &ldquo;My Team&rdquo; &mdash; a custom list of your Fantasy Team athletes,
                and Findexar will track and index media mentions of them from over
                a hundred different sources.
                Expect updates available just minutes after publication.<br /><br />
                Alternatively, browse leagues, teams, and athletes to quickly scan through their media mentions.</p>

        </TextContainer>
        </ContainerWrap>
            <MobileVContainer> <MobileTitle><h3>Welcome to Findexar!</h3></MobileTitle><MobileContainerWrap><br />
                <MobileTextContainer>
                    <p>Effortlessly stay in touch with the latest news about your fantasy sports stars.
                        Create &ldquo;My Team&rdquo; &mdash; a custom list of your Fantasy Team athletes,
                        and Findexar will track and index all media mentions.
                        <br /><br />
                        Alternatively, browse leagues, teams, and athletes to quickly scan through their media mentions.</p>
                </MobileTextContainer></MobileContainerWrap>
                <MobileButtonContainer><Button onClick={onClick} variant="outlined" sx={{ color: '0xFF0000' }} href={`/pub${params}`}><b>Enter Findexar</b></Button></MobileButtonContainer>
                <MobileContainerWrap><TextContainerCenter> {loading && <LoadingContainer><Watch
                    visible={true}
                    height="80"
                    width="80"
                    radius="48"
                    color="#4fa94d"
                    ariaLabel="watch-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                /></LoadingContainer>}
                    <hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in USA.
                </TextContainerCenter></MobileContainerWrap>

            </MobileVContainer>
            <ButtonContainer><Button onClick={onClick} size="large" variant="outlined" href={`/pub${params}`}>Enter Findexar</Button></ButtonContainer>

            <ContainerWrap><TextContainerCenter>{loading && <LoadingContainer><Watch
                visible={true}
                height="80"
                width="80"
                radius="48"
                color="#4fa94d"
                ariaLabel="watch-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></LoadingContainer>}

                <br /><br /><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in USA.
            </TextContainerCenter></ContainerWrap>
        </OuterContainer>


    )




}

export default Landing;