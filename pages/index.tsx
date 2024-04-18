import { GetServerSidePropsContext } from "next";
import { isbot } from '../lib/isbot.js';
import SinglePage from '../components/single-page';
interface Props {
    disable?: boolean;
    dark?: number;
    fbclid?: string;
    utm_content?: string;
    isbot?: number;
    isfb?: number;
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
    tracker_filter:number;
}
export default function Home(props: Props) {
    return null;//<SinglePage  {...props} />
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