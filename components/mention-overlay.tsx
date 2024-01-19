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
   // padding: 0 20px;
    overflow: auto;
    font-family:'Roboto','Helvetica',sans-serif;
   /* @media (max-width: 600px) {
        padding: 0 10px;
    }*/
`;
interface Props {
    league: string;
    type: string;
    team: string;
    teamName: string;
    name: string;
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
    const {date,url,summary,fav}=amention||{};
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    console.log("dialog render, open=",open)
    useEffect(() => {
        if(amention){
            console.log("openDialog")
            setOpen(true);
        }
    },[amention]);
    return <Dialog open={open} fullScreen={fullScreen}>
    
      <DialogContent>
      <DialogActions>
      <ContentWrap>
          <div autoFocus onClick={()=>{console.log("closeDialog");setXid("");setOpen(false);}}>
            X
          </div>  
          </ContentWrap>  
        </DialogActions>
      <ContentWrap>
        <MentionWrap>
      <Mention {...props} findexarxid={findexarxid} date={date} url={url} summary={summary} fav={fav} mutate={()=>{}}/>
      </MentionWrap>
      </ContentWrap>
      </DialogContent>
      <DialogActions>
      <ContentWrap>
          <div autoFocus onClick={()=>{console.log("closeDialog");setXid("");setOpen(false);}}>
            Dismiss
          </div>    
          </ContentWrap>
        </DialogActions>
        
      </Dialog>
}
export default MentionOverlay;