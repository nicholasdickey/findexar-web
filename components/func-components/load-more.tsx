import React, { use, useCallback, useEffect, useState,useRef } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'

import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";

import { styled} from "styled-components";

import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';
import useIntersectionObserver  from '@/lib/use-intersection-observer';

//import { LeagueTeamsKey, getLeagueTeams, recordEvent, setCookie, AMentionKey, getAMention } from '@/lib/api';
//import { useAppContext } from '@/lib/context';

interface Props {
    isLoadingMore:boolean;
    isReachingEnd:boolean;

    size:number;
    setSize: any;
}
const LoadMore:React.FC<Props> = ({isLoadingMore,isReachingEnd,setSize,size}) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {});
   // console.log("entry:",entry)
    const isVisible = !!entry?.isIntersecting ||false;
    useEffect(() => {
        console.log("useEffect isVisible",isVisible,visible);
        if (isVisible) {
            if(!visible){
                setVisible(true);
                setSize(size+1);
            }
        }
        else {
            if(visible)
                setVisible(false);
        }
    }, [isVisible,entry,ref]);
    return <div  ref={ref}><Button  style={{ padding: 4, marginTop: 20 }} onClick={() => setSize(size + 1)} variant="outlined">
    {isLoadingMore
        ? "loading..."
        : isReachingEnd
            ? `no more stories`
            : "load more"}
    </Button></div>
}

export default LoadMore;
