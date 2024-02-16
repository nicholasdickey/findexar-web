import * as React from 'react';
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
import { getReport } from '../lib/api'
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


const ReportItem= function(name:string,expanded:string,setExpanded:any,sessionid:string,reportItem:any){
  let cs=false;  
  const items=reportItem.items.map((record:any,i:number)=>{
      console.log("record:",record);
        const {url,name:eventName,utm_context='',league='',params='',fbclid='',team='',stamp='',player='',slug='',view='',time='',isMobile,ssrTime,userId,t1,findexarxid,story,sid,ua}=record;
        console.log("ReportItem",record,stamp,name)
        if(name.indexOf('ssr')<0)
          cs=true;
        return (
           <Paper sx={{background:"grey",m:2,p:2,color:"white"}} key={`keyasp-${i}`}>
                <Typography>Name: {eventName}</Typography>
                {ssrTime&&<Typography>SSR Time:{ssrTime}</Typography>}
                {time&&<div>SPA Time:{time}</div>}
                {t1&&<div>SSR start time (t1):{t1}</div>}
                {params&&<Typography>Params{params}</Typography>}
                {fbclid&&<Typography>fbclid:{fbclid}</Typography>}
                {stamp&&<Typography>stamp:{stamp}</Typography>}
                {league&&<div>League:{league}</div>}
                {team&&<div>Team:{team}</div>}
                {player&&<div>Player:{player}</div>}
                {slug&&<div>Slug:{slug}</div>}
                {url&&<div>Url:{url}</div>}
                {view&&<div>View:{view}</div>}
                {sid&&<div>SID:{sid}</div>}
                {ua&&<div>User Agent:{ua}</div>}
                {utm_context&&<div>utm_context:{utm_context}</div>}
                {userId&&<div>userId:{userId}</div>}
                {findexarxid&&<div>findexarxid:{findexarxid}</div>}
                {story&&<div>story:{story}</div>}
                {isMobile&&<div>isMobile:{isMobile}</div>}


                
           </Paper>
        )
        });

  
    return <Accordion key={name} style={{ background:'#844',color:"white",  borderRadius: 14 }} sx={{ mt: 5 }} expanded={expanded == sessionid} onChange={()=>setExpanded(expanded==sessionid?'':sessionid)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0,color:items.length>1&&cs?"#afa":"888" }}>{name}</Typography>
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
export default function Report({ report}:
  { report:any}) {


  const router = useRouter();
  const matches = useMediaQuery('(min-height:600px)');
const [expanded,setExpanded]=React.useState<string>("");
  const canvasRef = React.useRef<HTMLDivElement>(null);
  let theme: any;
  let itemsAll:any[]=[];
  for (const key in report){
    const item=report[key];
    const {sessionid,items}=item
    itemsAll.push(ReportItem(`${sessionid},items:${item.items.length};last:${items.length>0?items[0].name:''}`,expanded,setExpanded,sessionid,item))
  };


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
         </div>   
        
        </main>

     
    </>
  )
}
export const getServerSideProps =
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
  
 
      const data = await getReport();
      let report:any=null;
      if (data?.success) {
        report = data.report;
      }

     
      return {
        props: {
            report
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
