import * as React from 'react';
import useSWRInfinite from 'swr/infinite'
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { AppBar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { useState, useCallback, useEffect } from "react"
import { useRouter } from 'next/router'
import { fetchReport,FetchedReportKey } from '../lib/api'
import styled from 'styled-components';
import Script from 'next/script'

import {
  GetServerSidePropsContext,
} from "next";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head'
import { blueGrey } from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Image from 'next/image'
//import { useSession, signIn, signOut } from "next-auth/react"
import { Roboto } from 'next/font/google';
import { AnyPtrRecord } from 'dns';
import Paper from '@mui/material/Paper';
import LoadMore from "@/components/func-components/load-more";

const ReportItem= function(name:string,expanded:string,setExpanded:any,sessionid:string,reportItem:any){
  let cs=false;  
  let bot=false;
  const items=reportItem.items.map((record:any,i:number)=>{
      console.log("record:",record);
        const {teamid="",label="",ogImage="",url,name:eventName,utm_content='',league='',params='',fbclid='',team='',stamp='',player='',slug='',view='',time='',isMobile,ssrTime,userId,t1,findexarxid,story,sid,ua}=record;
        console.log("ReportItem",record,stamp,name)
        if(eventName.indexOf('ssr')<0)
          cs=true;
        if(eventName.indexOf('bot')>=0){
          bot=true;
          console.log("===============>>>>bot",name);
        }
          
        return (
           <Paper sx={{background:"grey",m:2,p:2,color:"white"}} key={`keyasp-${i}`}>
                <Typography>Name: {eventName}</Typography>
                {ssrTime&&<Typography>SSR Time:{ssrTime}</Typography>}
                {time&&<Typography>SPA Time:{time}</Typography>}
                {false&&t1&&<Typography>SSR start time (t1):{t1}</Typography>}
                {params&&<Typography>Params{params}</Typography>}
                {fbclid&&<Typography>fbclid:{fbclid}</Typography>}
                {stamp&&<Typography>stamp:{stamp}</Typography>}
                {league&&<Typography>League:{league}</Typography>}
                {team&&<Typography>Team:{team}</Typography>}
                {player&&<Typography>Player:{player}</Typography>}
                {slug&&<Typography>Slug:{slug}</Typography>}
                {url&&<Typography>Url:{url}</Typography>}
                {ogImage&&<Typography>og:image:{ogImage}</Typography>}
                {view&&<Typography>View:{view}</Typography>}
                {sid&&<Typography>SID:{sid}</Typography>}
                {teamid&&<Typography>Team:{teamid}</Typography>}
                {label&&<Typography>Label:{label}</Typography>}
                {ua&&<Typography>User Agent:{ua}</Typography>}
                {utm_content&&<Typography>utm_content:{utm_content}</Typography>}
                {userId&&<Typography>userId:{userId}</Typography>}
                {findexarxid&&<Typography>findexarxid:{findexarxid}</Typography>}
                {story&&<Typography>story:{story}</Typography>}
                {isMobile&&<Typography>isMobile:{isMobile}</Typography>}
                {name=='story-click'&&story&&<>
                        <Typography>url:{story.url}</Typography>
                        <Typography>title:{story.title}</Typography>
                        <Typography>slug:{story.slug}</Typography>
                        <Typography>summary:{story.summary}</Typography>
                </>}
           </Paper>
        )
        });

    return <Accordion key={name} style={{ background:'#844',color:"white",  borderRadius: 14 }} sx={{ mt: 5 }} expanded={expanded == sessionid} onChange={()=>setExpanded(expanded==sessionid?'':sessionid)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '100%',color:bot?"#004400":items.length>1&&cs?"#afa":"888" }}>{name}:{reportItem.stamp}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ borderRadius: 14 }}>
                  <Box sx={{ my: 4 }}>
                    {items}
                  </Box>
                </AccordionDetails>
              </Accordion>
}


const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
export default function Report() {
  const router = useRouter();
  const matches = useMediaQuery('(min-height:600px)');
  const [expanded,setExpanded]=React.useState<string>("");
  //const canvasRef = React.useRef<HTMLDivElement>(null);

  const fetchReportKey = (pageIndex: number, previousPageData: any): FetchedReportKey | null => {
    let key: FetchedReportKey = { type: "FetchedReport",page: pageIndex};
    if (previousPageData && !previousPageData.length) return null // reached the end
    return key;
}
const { data, error: storiesError, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(fetchReportKey, fetchReport, { initialSize: 1, revalidateAll: true,parallel:true })
if(data)
console.log("R1",...(data as any[]))

//let report:{}={};

  let theme: any;
  let itemsAll:any[]=[];
  if(data)
  for(let i=0;i<data.length;i++){
    const sub=data[i];
    for (const key in sub){
        const item=sub[key];
    const {sessionid,items}=item
    itemsAll.push(ReportItem(`${sessionid},items:${items.length};last:${items.length>0?items[0].name:''}`,expanded,setExpanded,sessionid,item))
    }
  };
  const isLoadingMore =
  isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
let isEmpty = data?.[0]?.length === 0;
let isReachingEnd =
  isEmpty || (data && data[data.length - 1]?.length < 5);

  return (
    <>
      <Head>
        <title>A Report</title>
       
        <meta name="viewport" content="width=device-width" />
      
      </Head>
       <main className={roboto.className} >
          <div>
            <CssBaseline />
          </div>
            <Script src={`https://www.googletagmanager.com/gtag/js?${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
            <Script id="google-analytics">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
            </Script>
         <div style={{padding:"20px",background:"#444",color:"white",position:"absolute",top:"0"}}>
          {itemsAll}
          <LoadMore setSize={setSize} size={size} isLoadingMore={isLoadingMore || false} isReachingEnd={isReachingEnd || false} />
           <br/>
           <br/>   
         </div>   
        
        </main>

     
    </>
  )
}
export const getServerSideProps =
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
  
 /*
      const data = await getReport();
      let report:any=null;
      if (data?.success) {
        report = data.report;
      }
*/
     
      return {
        props: {
        }
      }
    } catch (x) {
      console.log("FETCH SSR PROPS ERROR", x);
      context.res.statusCode = 503;
      return {
        props: { error: 503 }
      }
    }
  }
