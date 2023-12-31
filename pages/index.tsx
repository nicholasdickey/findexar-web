import * as React from 'react';
import { GetServerSidePropsContext } from "next";
import { isbot } from '../lib/isbot.js';
import SinglePage from '../components/single-page';
import { recordEvent } from '../lib/api'
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
    return <div/>
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
        return {
            redirect: {
                permanent: false,
                destination: "/league"
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
