import React,{useState,useEffect} from "react";
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { styled } from "styled-components";
import MentionIcon from '@mui/icons-material/AlternateEmailOutlined';
import TeamIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayerIcon from '@mui/icons-material/PersonPinOutlined';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { UserListMembersKey,getUserListMembers } from '@/lib/api';
import TeamDetails from "./team-details";
import PlayerDetails from "./player-details";
import SecondaryTabs from "./secondary-tabs";
import SubscriptionMenu from "./subscription-menu";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
const SidePlayer = styled.div`
  ///height: 40px;
  //width: 200px; 
  color: #fff;
  //text-align: center;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom:10px;
`;

const TeamName = styled.div`
  height: 20px;
  width: 200px; 
  color: #aea;
  //text-align: center;
  font-size: 16px;
 //margin: 10px;
`;
const RightExplanation = styled.div`
  //height: 30px;
  width: 270px; 
  color: #ccc;
 // text-align: center;
  font-size: 13px;
  margin-top: 20px;
  margin-bottom:10px;
`;

const MobileTeamName = styled.div`
  height: 40px;
  color: #aea;
  text-align: center;
  font-size: 24px;
  margin: 10px;
`;

const SelectedSidePlayer = styled.div`
  height: 40px;
  width: 200px;
  color: #ff8;
  text-align: center;
  font-size: 14px;
  margin: 10px;
  a{
    color: #ff8 !important;
    text-decoration: none;
    &:hover{
      color: #F8F;
    }
  }
`;

const RightPanel = styled.div`
  height:100%;
  width:300px;
  padding-left:20px;
  min-height: 1000vh;
  background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start; 
  padding-top:18px;
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;

const MobilePlayersPanel = styled.div`
  height:100%;
  background-color:  #668;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:center; 
  a{
    color: #fff;
    text-decoration: none;
    &:hover{
      color: #4f8;
    }
  }
`;

const CenterPanel = styled.div`
  height:100%;
`;

const MainPanel = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  height:100%;
  @media screen and (max-width: 1199px) {
    display: none 
  }
`;

const MainMobilePanel = styled.div`
  width:100%;
  height:100%;
  visibility: visible;
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;
interface Props {
  dark?: number;
  list?: string;
  pagetype?: string;
  listName?: string;
  lists:any;
  view:string;
  setLocalList?:(listxid:string)=>void;
  setLocalPlayer:(player:string)=>void;
  setLocalPageType:(pagetype:string)=>void;
  subscriptionPrompt:boolean;
  subscriptionObject:any;
  setDismiss:any;
}

const List: React.FC<Props> = (props) => {
  let { setDismiss,subscriptionPrompt,subscriptionObject,view,lists,dark,  list,  pagetype, listName,setLocalList,setLocalPlayer,setLocalPageType } = props;
  const [v,setV]=React.useState((!view||view.toLowerCase()=="home")?"mentions":view.toLowerCase());
  const [selectedList,setSelectedList]=React.useState(list);

  const [globalLoading,setGlobalLoading]=React.useState(false);
  const userListMembersKey: UserListMembersKey = {type:"UserListMembers",listxid: selectedList || ""};
  const {data:players,error,isLoading} = useSWR(userListMembersKey, getUserListMembers);
 useEffect(()=>{
  if(!v||v=="home")
    setV("mentions");
 },[v]);
 useEffect(()=>{
    setSelectedList(list);
    setV("mentions");
    setGlobalLoading(false);

 },[list]);

useEffect(()=>{
  setV(view.toLowerCase());
  //setGlobalLoading(true);
},[view]);

console.log("ListPage",{subscriptionPrompt,v,list,pagetype,view,selectedList})
  const PlayersNav = players?.map((p: { member: string, teamid:string,  league:string }) => {
    return  <SidePlayer><Link onClick={()=>{ setLocalPageType("player"),setLocalPlayer(p.member);setV("mentions");setGlobalLoading(true)}} href={`/pro/league/${p.league}/team/${p.teamid}/player/${encodeURIComponent(p.member)}`}>{p.member} </Link></SidePlayer>
  });
  console.log("List",{v,list,pagetype});
 /* if(isLoading||globalLoading){
    return  <MainPanel>Loading...</MainPanel>
  }*/
 
  return (
    <div className="list">
      <MainPanel>
                
        <CenterPanel>
           <TeamDetails {...props} /> : <PlayerDetails {...props} />
        </CenterPanel>
        <RightPanel>
       
        <RightExplanation><em> To add to the list, use "+" icon next to player<br/> name when browsing the team rosters.</em></RightExplanation>
        <TeamName>List Members: </TeamName>
          {PlayersNav}
        </RightPanel>
      </MainPanel>
      <MainMobilePanel>
     
      <SecondaryTabs options={[{ name: "Teams", icon: <TeamIcon /> },{ name: "Mentions", icon: <MentionIcon /> },{name:"Players",icon:<PlayerIcon/>}]} onChange={(option: any) => { console.log(option);/*router.replace(`/league/${league}/team/${team}?view=${encodeURIComponent(option.name)}`)*/setV(option.name.toLowerCase()); }} selectedOptionName={v} />
      {subscriptionPrompt&&<SubscriptionMenu hardStop={false} {...subscriptionObject} setDismiss={setDismiss}/>}
     
        {v=='lists'&&lists}  
        {v=='mentions'&&(isLoading||globalLoading)&& <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
 
     
      <Skeleton variant="rounded" animation="pulse" height={160} />
      <Skeleton variant="rounded" animation="pulse" height={80} />
      <Skeleton variant="rounded" animation="pulse" height={120} />
      <Skeleton variant="rounded" animation="pulse" height={160} />
    </Stack>} 
    
        {!isLoading&&!globalLoading&&v=='mentions'&&pagetype == "team" && <TeamDetails {...props} />}
        {!isLoading&&!globalLoading&&v=='mentions'&&pagetype == "player" && <PlayerDetails {...props} />}
        {v=='players'&&
         <MobilePlayersPanel>
        
          { globalLoading?<div>Loading...</div>:PlayersNav}
          </MobilePlayersPanel>}
      </MainMobilePanel>
    </div>
  );
};

export default List;