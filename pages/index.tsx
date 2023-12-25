import * as React from 'react';
import { SWRConfig, unstable_serialize } from 'swr'
//import { withSessionSsr, Options } from '../lib/with-session';
import { isbot } from '../lib/isbot.js';
import SinglePage from '../components/single-page';
import {
    GetServerSidePropsContext,
} from "next";
//import { DocumentHeadTags, DocumentHeadTagsProps, documentGetInitialProps } from '@mui/material-nextjs/v14-pagesRouter';


import { /*fetchSession,updateSession,*/ recordEvent } from '../lib/api'

interface Props {
    disable?: boolean;
    dark?: number;
    fbclid?: string;
    utm_content?: string;
    isbot?: number;
    isfb?: number;
    sessionid?: string;
}
export default function Home(props: Props) {

    return <SinglePage  {...props} />
}
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            let { fbclid, utm_content, dark }:
                { fbclid: string, utm_content: string, dark: number } = context.query as any;



            console.log("IRON_PASSWORD:", process.env.IRON_PASSWORD);
            utm_content = utm_content || '';

            fbclid = fbclid || '';
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });

            let host = context.req.headers.host || "";


            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // let sessionid = context.req.session?.sessionid || randomstring();
            // const fresh = !context.req.session.sessionid;
            const sessionid = randomstring();
            if (!botInfo.bot) {
                console.log('ssr-landing-init');
                try {
                    recordEvent(sessionid, 'ssr-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-landing-init-error', x);
                }

            }
            if (botInfo.bot) {
                try {
                    await recordEvent(sessionid, 'ssr-bot-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-bot-landing-init-error', x);
                }
            }
            /*      if (fresh || context.req.session.sessionid != sessionid) {
                      context.req.session.sessionid = sessionid;
      
                      await context.req.session.save();
                  }*/
            return {
                redirect: {
                    permanent: false,
                    destination: "/league"
                }
            }
            return {
                props: {
                    sessionid,
                    fbclid,
                    utm_content,
                    isbot: botInfo.bot,
                    isfb: botInfo.fb || fbclid ? 1 : 0,
                    dark: dark || 0
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
