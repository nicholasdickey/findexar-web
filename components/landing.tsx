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
    background-color:var(--background);
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
    margin-top:0px;
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
    align-items: center;
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
   // margin-top: 120px;
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
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    color:var(--text);
    position: -webkit-sticky; /* Safari */
	position: sticky;
	top: 100;
    z-index:100;
    @media screen and (min-width: 1200px) {
        display:none;
    }
`;
const StickyDiv = styled.div`
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index:100;
    height:100px;
    padding:20px;
    width:100%;
    text-align:center;
    background-color:var(--background);
    color:var(--text);
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
   
`;
const InnerButton = styled.div`
    margin-top:0px;
    margin-bottom:2px;
    color:var(--text);
   // padding-top:2px;
    padding-left: 5px;
    padding-right:2px;
    font-size:18px;
    &:hover{
        color:var(--highlight);
        background-color:var(--highBackground) ;
       
    }
    a{
        &:hover{
            color:var(--highlight);
            background-color:var(--highBackground) ;
            
        }
    }

`;
const NegativeAnswer = styled.div`
    margin-bottom:10px;
   
    color:var(--text);
    height:60px;
    width:600px;
    border:1px solid red;
    border-radius:15px;
    padding:17px;
    text-align: center;
    &:hover{
        color:var(--highlight);
        background-color:var(--highBackground) ;
       
    }
    a{
        &:hover{
            color:var(--highlight);
            background-color:var(--highBackground) ;
            
        }
    }



`;
const PositiveAnswer = styled.div`
    margin-top:10px;
    margin-bottom:50px;
    color:var(--text);
    text-decoration:none;
    height:60px;
    width:600px;
    border:1px solid var(--qwiket-border-new);
    border-radius:15px;
    padding:8px;
    text-align: center;
    &:hover{
        color:var(--highlight);
        background-color:var(--highBackground) ;
       
    }
    a{
        &:hover{
            color:var(--highlight);
            background-color:var(--highBackground) ;
            
        }
    }
`;
const MobileNegativeAnswer = styled.div`
    margin-bottom:10px;
    color:var(--text);
    height:60px;
    width:300px;
    border:1px solid red;
    border-radius:15px;
    padding:10px;
    text-align: center;
    display:flex;
    flex-direction:column;
    justify-content:center;
 
`;
const MobilePositiveAnswer = styled.div`
    margin-top:10px;
    margin-bottom:40px;
    color:var(--text);
    text-decoration:none;
    height:60px;
    width:300px;
    border:1px solid var(--qwiket-border-new);
    border-radius:15px;
    padding:10px;
  
    
    display:flex;
    flex-direction:column;
    justify-content:center;
    
`;
const MobileAnswerText = styled.div`
    width:300px;
    text-align: center;
`;
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

let s=false;

const Landing = () => {
    const [fbclid, setFbclid] = useState("");
    const [utm_content, setUtm_content] = useState("");
    const [params, setParams] = useState("");
    const [loading, setLoading] = useState(false);
    const [localMode, setLocalMode] = useState("");
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const listener = () => {
            if (window.scrollY > 0) {
                if (!scrolled&&!s) {
                    try {
                        s=true;
                        setScrolled(true);
                        recordEvent("", `landing-scrolled`, `{"fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
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
        window.addEventListener('scroll',listener );
        return () => window.removeEventListener("scroll", listener);
    }, [fbclid,utm_content,scrolled]);


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
        if (!router.isReady||!params) return;
     
        try {
            recordEvent("", `landing-loaded`, `{"fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }

    }, [params,router.isReady]);

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
    const onHover = (label:string) => {
        try {
            //setLoading(true);
            recordEvent("", `hover`, `{"label","${label}","fbclid":"${fbclid}", "utm_content":"${utm_content}"}`)
                .then((r: any) => {
                    console.log("recordEvent", r);
                });
        } catch (x) {
            console.log('recordEvent', x);
        }



    }
    return (

        <OuterContainer>
            
            {false && <StickyDiv>
                <ButtonContainer><Button onClick={onClick} size="large" variant="outlined" href={`/pub${params}`}><InnerButton><h2>Enter Findexar</h2></InnerButton></Button></ButtonContainer>
                <MobileButtonContainer><Button onClick={onClick} variant="outlined" sx={{ color: '0xFF0000' }} href={`/pub${params}`}><b>Enter Findexar</b></Button></MobileButtonContainer>



            </StickyDiv>}

            <ContainerWrap><TextContainer>
                <h4>Do you want to know when your favorite athletes or teams are mentioned in the media?</h4>
                <ul>
                    <NegativeAnswer  onMouseEnter={() => onHover('D-N1')}>
                        No, I am in the wrong place.
                    </NegativeAnswer>
                    <PositiveAnswer  onMouseEnter={() => onHover('D-P1')}>

                        Yes,&nbsp;<Button onClick={onClick} href={`/pub${params}`}><InnerButton><b>Enter Findexar</b></InnerButton></Button>

                    </PositiveAnswer>
                </ul>

                <h4>Do you want to peruse an annotated real-time index of media mentions for NFL, NHL, MLB and NBA athletes and teams?</h4>
                <ul>
                    <NegativeAnswer onMouseEnter={() => onHover('D-N2')}>
                        No, I am definitely in the wrong place. <a href="https://www.thefarside.com/">Take me to the Far Side.</a>
                    </NegativeAnswer>
                    <PositiveAnswer onMouseEnter={() => onHover('D-P2')}>
                        Yes,&nbsp;<Button onClick={onClick} href={`/pub${params}`}><InnerButton><b>Enter Findexar</b></InnerButton></Button>

                    </PositiveAnswer>
                </ul>

                <h4>Need the capability to monitor all media stories mentioning the athletes from your fantasy team?</h4>
                <ul>
                    <NegativeAnswer onMouseEnter={() => onHover('D-N3')}>

                        What&apos;s a &ldquo;fantasy team&ldquo;?
                    </NegativeAnswer>

                    <PositiveAnswer onMouseEnter={() => onHover('D-P31')}>
                        Yes,&nbsp;<Button onClick={onClick} href={`/pub${params}`}><InnerButton><b>Enter Findexar</b></InnerButton></Button>

                    </PositiveAnswer>
                </ul>
                <p>
                    Effortlessly stay in touch with the latest news about your fantasy sports stars.
                    Create &ldquo;My Team&rdquo; &mdash; a custom list of your Fantasy Team athletes,
                    and Findexar will track and index media mentions of them from over
                    a hundred different sources.<br /><br />
                    Alternatively, browse leagues, teams, and athletes to quickly scroll through their media mentions.</p>

            </TextContainer>
            </ContainerWrap>
            <MobileVContainer>
                <MobileContainerWrap>
                    <MobileTextContainer>
                        <h4>Do you want to know when your favorite athletes or teams are mentioned in the media?</h4>
                    </MobileTextContainer>
                </MobileContainerWrap>
                <MobileNegativeAnswer onMouseEnter={() => onHover('M-N1')}>
                    <MobileAnswerText>
                        No, I am in the wrong place.
                    </MobileAnswerText>
                </MobileNegativeAnswer>
                <MobilePositiveAnswer onMouseEnter={() => onHover('M-P1')}>
                    <MobileAnswerText>
                        Yes,<Button onClick={onClick} href={`/pub${params}`}><InnerButton><b>Enter Findexar</b></InnerButton></Button>
                    </MobileAnswerText>
                </MobilePositiveAnswer>

                <MobileContainerWrap>
                    <MobileTextContainer>
                        <h4>Do you want to peruse an annotated real-time index of media mentions for NFL, NHL, MLB and NBA athletes and teams?</h4>
                    </MobileTextContainer>
                </MobileContainerWrap>
                <MobileNegativeAnswer onMouseEnter={() => onHover('M-N2')}>
                    <MobileAnswerText>
                        No, I am definitely in the wrong place. <a href="https://www.thefarside.com/">Take me to the Far Side.</a>
                    </MobileAnswerText>
                </MobileNegativeAnswer>
                <MobilePositiveAnswer onMouseEnter={() => onHover('M-P2')}>
                    <MobileAnswerText>
                        Yes,<Button onClick={onClick} href={`/pub${params}`}><InnerButton><b>Enter Findexar</b></InnerButton></Button>
                    </MobileAnswerText>
                </MobilePositiveAnswer>
                <MobileContainerWrap>
                    <MobileTextContainer>
                        <h4>Need the capability to monitor all media stories mentioning the athletes from your fantasy team?</h4>
                    </MobileTextContainer></MobileContainerWrap>
                <MobileNegativeAnswer  onMouseEnter={() => onHover('M-N3')}>
                    <MobileAnswerText>
                        What&apos;s a &ldquo;fantasy team&ldquo;?
                    </MobileAnswerText>
                </MobileNegativeAnswer>

                <MobilePositiveAnswer  onMouseEnter={() => onHover('M-P3')}>
                    <MobileAnswerText>
                        Yes,<Button onClick={onClick} href={`/pub${params}`}><InnerButton><b>Enter Findexar</b></InnerButton></Button>
                    </MobileAnswerText>
                </MobilePositiveAnswer>
                <MobileContainerWrap>
                    <MobileTextContainer>
                        <p>
                            Effortlessly stay in touch with the latest news about your fantasy sports stars.
                            Create &ldquo;My Team&rdquo; &mdash; a custom list of your Fantasy Team athletes,
                            and Findexar will track and index media mentions of them from over
                            a hundred different sources.<br /><br />
                            Alternatively, browse leagues, teams, and athletes to quickly scroll through their media mentions.</p>

                    </MobileTextContainer>
                </MobileContainerWrap>
                <MobileContainerWrap>
                    <TextContainerCenter>
                        <br /><br /><hr /> Copyright &#169; 2024, Findexar, Inc.<br />Made in Minnesota, USA.
                    </TextContainerCenter>
                </MobileContainerWrap>
            </MobileVContainer>



            <ContainerWrap><TextContainerCenter>

                <br /><br /><hr />Copyright &#169; 2024, Findexar, Inc.<br />Made in USA.
            </TextContainerCenter></ContainerWrap>
        </OuterContainer>


    )




}

export default Landing;