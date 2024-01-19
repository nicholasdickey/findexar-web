import React, { useEffect } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { GetAMentionKey,getAMention, recordEvent } from '@/lib/api';
import Mention from './mention';

const ContentWrap = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  overflow: auto;
  font-family:'Roboto','Helvetica',sans-serif;
  @media (max-width: 600px) {
    padding: 0 10px;
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
    width: 20px;
    height:20px;
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
    align-items:center;
    font-size:28px;
   // background-color:#444;
    color:#fff;
  
`;
interface Props {
  
    
    fav: number;
    noUser: boolean;
    setLocalPageType: (pageType: string) => void;
    setLocalPlayer: (player: string) => void;
    setLocalLeague: (league: string) => void;
    setLocalTeam: (team: string) => void;
    mutate: () => void;
    params: string;
    sessionid: string;
    tp:string;
    setDismiss: (dismiss: boolean) => void;
    findexarxid:string;
}
const MentionOverlay = ({findexarxid,setDismiss,...props}:Props) => {
    const [open, setOpen] = React.useState(false);
    const [xid, setXid] = React.useState<string>(findexarxid||"");
    const key:GetAMentionKey={type:"GetAMention",findexarxid:xid,noLoad:xid!==""?false:true};
    const{ data: amention, error, isLoading }= useSWR(key, getAMention)
    const {date,url,summary,fav,type,league,team,teamName,name}=amention||{};
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    console.log("dialog render, open=",open)
    useEffect(() => {
        if(amention){
            console.log("openDialog")
            setOpen(true);
        }
    },[amention]);
    return <Dialog open={open} fullScreen={fullScreen}PaperProps={{
        style: {
          backgroundColor: 'transparent',
         // boxShadow: 'none',
        },
      }} >
    
      <DialogContent>
      <DialogActions>
      <ContentWrap>
          <div autoFocus onClick={()=>{console.log("closeDialog");setOpen(false);}}>
           <XContainer><XElement>x</XElement></XContainer> 
          </div>  
          </ContentWrap>  
        </DialogActions>
      <ContentWrap>
        <MentionWrap>
      <Mention {...props} findexarxid={findexarxid} date={date} url={url} summary={summary} fav={fav} type={type} team={team} teamName={teamName} league={league} name={name} mutate={()=>{}}/>
      </MentionWrap>
      </ContentWrap>
      </DialogContent>
      <DialogActions>
      <ContentWrap>
          <DismissContainer autoFocus onClick={()=>{console.log("closeDialog");setOpen(false);}}>
            <span>Dismiss</span>
          </DismissContainer>    
          </ContentWrap>
        </DialogActions>
        
      </Dialog>
}
export default MentionOverlay;