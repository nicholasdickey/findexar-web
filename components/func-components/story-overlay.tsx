import React, { useEffect,useCallback } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AStoryKey,getAStory, recordEvent,removeAStory } from '@/lib/api';
import Story from '@/components/func-components/items/story';
import { useAppContext } from '@/lib/context';

const ContentWrap = styled.div`
    width: 100%;
    height: 100%;
    padding-left:0px;
    padding-right:0px;
    color:var(--text);
    font-family:'Roboto','Helvetica',sans-serif;
    @media (max-width: 600px) {
        padding: 0 0px;
    }
`;

const MentionWrap = styled.div`
    width: 100%;
    height: 100%;
    font-family:'Roboto','Helvetica',sans-serif;
`;

const XContainer = styled.div`
    width: 100%;
    height:32px;
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
    align-items:center;
    font-size:28px;
    :hover{
        cursor:pointer;
        color:var(--xColor);
    }
`;

const XElement = styled.div`
    width: 40px;
    height:20px;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items:center;
    font-size:28px;
    color:#fff;
    @media (max-width: 1199px) {
      margin-top:0px;
    }  
`;

const RElement = styled.div`
    width: 20px;
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
    align-items:center;
    font-size:28px;
    margin-top:-110px;
    color:#f44; 
    @media (max-width: 1199px) {
      margin-top:0px;
    }
`;

const TitleWrap = styled.div`
    color:#fff !important;
`;

const DialogTitleWrap = styled.div`
    display:block;
    height:20px;
    @media (max-width: 1199px) {
        display:none;
    }
`;

const DialogTitleMobileWrap = styled.div`
    display:block;
    margin-top:20px;
    @media (min-width: 1200px) {
        display:none;
    }
`;
interface Props {
    mutate: () => void;
    setDismiss: (dismiss: boolean) => void;
}

const MentionOverlay = ({setDismiss,mutate,...props}:Props) => {
    const [open, setOpen] = React.useState(false);
    let { tab,view,mode, userId, isMobile,league,team,teamName, setLeague, setView,setTab, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp,  pagetype,  sid} = useAppContext();
    const [xid, setXid] = React.useState<string>(sid||"");
    const key:AStoryKey={type:"AStory",sid:xid,noLoad:xid!==""?false:true};
    const{ data: astory, error, isLoading }= useSWR(key, getAStory)
    const {title, url, digest, site_name, image, authors, createdTime, mentions}=astory||{};
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const admin=params&&params.includes('x17nz')?true:false;

    useEffect(() => {
        if(astory){
            console.log("openDialog")
            setOpen(true);
        }
    },[astory]);

    useEffect(() => {
      if(sid){
          setXid(sid);
          console.log("openDialog")
          setOpen(true);
      }
      else {
          setXid("");
          console.log("closeDialog")
          setOpen(false);
      }
  },[sid]);

  const handleClose = useCallback(() => {
      setOpen(false);
      console.log("closeDialog xid=",sid)
      let localUrl=router.asPath.replace('&sid='+sid,'').replace('?sid='+sid+"&",'?').replace('?sid='+sid,'');
      router.replace(localUrl,undefined,{shallow:true});
  }, [sid]);

  let target=`${teamName}`;
  target=!target||target=='undefined'?'' : target; 

  useEffect(() => {
    const keyDownHandler = (event:any) => {
        console.log('User pressed: ', event.key);

        if (event.key === 'Escape') {
          event.preventDefault();
          handleClose();
        }
    };
    window.addEventListener('keydown', keyDownHandler);
    return () => {
        window.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  const remove=useCallback(async ()=>{
    if(admin){
        await removeAStory(key);
        setOpen(false);
        setDismiss(true);
    }
  },[admin]);

  if(!astory)
    return null;
  
  return <Dialog disableEscapeKeyDown={true} open={open} fullScreen={fullScreen} PaperProps={{
        style: {
          backgroundColor: isMobile?'transparent':'#555',
         // boxShadow: 'none',
        },
      }} >
      <DialogTitleMobileWrap> <DialogTitle/></DialogTitleMobileWrap>
      <DialogTitleWrap><DialogTitle onClick={()=>{setDismiss(true);}}><TitleWrap>{process.env.NEXT_PUBLIC_APP_NAME}</TitleWrap></DialogTitle></DialogTitleWrap>
      <ContentWrap>
          <div autoFocus onClick={()=>{handleClose();}}>
           <XContainer><XElement>x</XElement></XContainer> 
          </div>  
          {admin&&<div autoFocus onClick={()=>{remove();}}>
           <XContainer><RElement>R</RElement></XContainer> 
          </div>} 
          </ContentWrap>   
      <ContentWrap>
          <MentionWrap>
            <Story story={astory}/>
          </MentionWrap>  
      </ContentWrap> 
   </Dialog>
}

export default MentionOverlay;