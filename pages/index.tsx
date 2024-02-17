import * as React from 'react';
import { GetServerSidePropsContext } from "next";
import { SWRConfig } from 'swr'
import { isbot } from '../lib/isbot.js';
import SinglePage from '../components/single-page';
import { recordEvent } from '../lib/api'
import { getCookie,setCookie } from 'cookies-next';


interface Props {
    disable?: boolean;
    dark?: number;
    fbclid?: string;
    utm_content?: string;
    isbot?: number;
    isfb?: number;
    sessionid?: string;
    pagetype?: string;
    league?: string;
    team?: string;
    player?: string;
    fallback?: any,
    pageType?: string;
    leagues: string[];
    view: string;
    userId?: string;
    createdAt?: string;
    freeUser?: boolean;
    t1: number;
    tab:string;
    mode:string;
    findexarxid:string;
    sid:string;
    teamName:string;
    slug:string;
}
export default function Home(props: Props) {
   // const fallback = props.fallback;
    return <SinglePage  {...props} />
}

export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
        let { fbclid, utm_content, dark }:
            { fbclid: string, utm_content: string, dark: number } = context.query as any;
        utm_content = utm_content || '';
        fbclid = fbclid || '';
        const ua = context.req.headers['user-agent'];
        const botInfo = isbot({ ua });
        let host = context.req.headers.host || "";
        var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let fresh = false;
        let sessionid=getCookie('sessionid', { req:context.req, res:context.res });
      
        if(!sessionid){
            fresh=true;
            sessionid = randomstring();
            setCookie('sessionid', sessionid, { req:context.req, res:context.res, maxAge: 60 * 6 * 24 });  
        }
        if (!botInfo.bot) {
            console.log('ssr-landing-init');
            try {
                recordEvent(sessionid, `ssr-landing${fresh?'-init':''}`, `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
            } catch (x) {
                console.log('ssr-landing-init-error', x);
            }
        }
        if (botInfo.bot) {
            try {
                await recordEvent(sessionid, 'ssr-bot-landing', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
            } catch (x) {
                console.log('ssr-bot-landing-init-error', x);
            }
        }
      /*  return {
            props: {
                sessionid,
                fbclid,
                utm_content,
                isbot: botInfo.bot,
                isfb: botInfo.fb || fbclid ? 1 : 0,
                dark: dark || 0,
                league:'',
                team:'',
                player:'',
                leagues:[],
                pagetype:'landing',
                fallback:{},
                view:'',
                userId:'',
                createdAt:0,
                freeUser:0,
                list:[],
                t1:0

            }
        }
        */
        return {
            redirect: {
                permanent: false,
                destination: `/pub?${fbclid ? `fbclid=${fbclid}&` : ''}${utm_content ? `utm_content=${utm_content}` : ''}`,
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

/*
export async function getStaticProps() {
    const t1=Date.now();

    let fallback = {
       
    };
   
    console.log("ISR!!!");    
    return {
      props: {
        leagues: ["NFL","NHL","MLB","NBA"],
        fallback,
        pagetype: "landing",
        view:"landing",
        tab:"all",
        mode:"light",
        t1,
        findexarxid:"",
        sid:"",
        teamName:"",
      },
      
    };
  }
*/