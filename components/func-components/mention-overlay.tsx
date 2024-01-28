import React, { useEffect } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AMentionKey,getAMention, recordEvent,removeAMention } from '@/lib/api';
import Mention from '@/components/func-components/items/mention';
import { useAppContext } from '@/lib/context';

const ContentWrap = styled.div`
  width: 100%;
  height: 100%;
  padding-left:0px;
  padding-right:0px;
  //overflow: auto;
  font-family:'Roboto','Helvetica',sans-serif;
  @media (max-width: 600px) {
    //padding: 0 10px;
    padding: 0 0px;
  }
`;
const MentionWrap = styled.div`
    
    width: 100%;
    height: 100%;
   // padding:40px;
   // padding: 0 20px;
    //overflow: auto;
    font-family:'Roboto','Helvetica',sans-serif;
   /* @media (max-width: 600px) {
        padding: 0 10px;
    }*/
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
const DismissContainer=styled.div`
    width: 100%;
    height:32px;
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
    align-items:center;
    font-size:18px;
    padding-bottom:10px;
   // background-color:#333;
    color:white;

    :hover{
        cursor:pointer;
        color:var(--xColor);

    }
`;
const XElement = styled.div`
    width: 30px;
    height:20px;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items:center;
    font-size:28px;
    margin-top:-110px;
    
    //background-color:#444;
    color:#fff;
    @media (max-width: 1199px) {
      margin-top:0px;
    }
  
`;
const RElement = styled.div`
    width: 20px;
   // height:20px;
    
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
    align-items:center;
    font-size:28px;
    margin-top:-110px;
   // background-color:#444;
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
    let { tab,view,mode, userId, isMobile, setLeague, setView,setTab, setPagetype, setTeam, setPlayer, setMode, sessionid, fbclid, utm_content, params, tp,  pagetype,  findexarxid} = useAppContext();
    const [xid, setXid] = React.useState<string>(findexarxid||"");
 
    const key:AMentionKey={type:"AMention",findexarxid:xid,noLoad:xid!==""?false:true};
    const{ data: amention, error, isLoading }= useSWR(key, getAMention)
    const {date,url,summary,fav,type,league,team,teamName,name}=amention||{};
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
   
    
    const linkType=team?'final':'top';
    const admin=params&&params.includes('x17nz')?true:false;
    console.log("dialog render, open=",{open,findexarxid,type,league,team,teamName,name});
   
    useEffect(() => {
        if(amention){
            console.log("openDialog")
            setOpen(true);
        }
    },[amention]);
    useEffect(() => {
      if(findexarxid){
          setXid(findexarxid);
          console.log("openDialog")
          setOpen(true);
      }
      else {
          setXid("");
          console.log("closeDialog")
          setOpen(false);
      }
  },[findexarxid]);
  const handleClose = () => {
    setOpen(false);
    console.log("closeDialog xid=",findexarxid)
    let localUrl=router.asPath.replace('&id='+findexarxid,'').replace('?id='+findexarxid+"&",'?').replace('?id='+findexarxid,'');
    router.replace(localUrl,undefined,{shallow:true});
    //(type == 'person' ? `/pub/league/${league}/team/${team}/player/${name}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}` : `/pub/league/${league}/team/${team}${params}${tp}${params.includes('?') ? '&' : '?'}id=${findexarxid}`)
  }
  let target=type=='person'?`${teamName}: ${name}`: `${teamName}`;
  target=!target||target=='undefined'?'' : target;
  console.log("linkType=",linkType);

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
  const remove=async ()=>{
    if(admin){
      await removeAMention(key);
      setOpen(false);
      setDismiss(true);
    }
  }
  if(!amention)
    return null;
    return <Dialog disableEscapeKeyDown={true} open={open} fullScreen={fullScreen} PaperProps={{
        style: {
          backgroundColor: isMobile?'transparent':'#555',
         // boxShadow: 'none',
        },
      }} >
      <DialogTitleMobileWrap> <DialogTitle/></DialogTitleMobileWrap>
      <DialogTitleWrap><DialogTitle onClick={()=>{setDismiss(true);}}><TitleWrap>{target}</TitleWrap></DialogTitle></DialogTitleWrap>
   
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
      <Mention startExtended={true} linkType={linkType} mention={{findexarxid,date,url,summary,fav,type,team,teamName,league,name}} mutate={mutate}/>
      </MentionWrap>  
      </ContentWrap>
     
      <DialogActions>
      <ContentWrap>
          
      </ContentWrap>
            
        </DialogActions>
        
      </Dialog>
}
export default MentionOverlay;