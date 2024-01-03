import React from "react";
import useSWR from 'swr';
import { useSession, signIn, signOut } from "next-auth/react"
import { styled } from "styled-components";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { PlayerPhotoKey,getPlayerPhoto } from '@/lib/api';
import Mention from "./mention";
import Avatar from '@mui/material/Avatar';
const MainPanel = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    height:100%;
    padding-left:20px;
    @media screen and (max-width: 1199px ){
    padding-left:1px;
  }
`;

const TeamHeader = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    height:40px;
`;

const TeamName = styled.div`
    width:300px;
    font-size: 24px;
    margin:10px;
`;

const TeamFindex = styled.div`
    margin-right:20px;
    font-size: 18px;
`;

const TeamDetailsBody = styled.div`
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:flex-start;
    padding-right : 30px;
    @media screen and (max-width: 1199px ){
        padding-right:1px;
    }
 `;

const TeamDetailsDigest = styled.div`
  
    min-height:100px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    border: 1px solid #ccc;
    margin-right:40px;
    margin-top:20px;
`;

const TeamDetailsFindex = styled.div`
    width:40px;
    height:100%;
    margin-right:20px;
    font-size: 18px;
    padding-left:20px;
    padding-top:20px;
    background-color: #fff;
`;

const TeamDetailsSummary = styled.div`
    width:100%;
    padding-right:20px;
    font-size: 18px;
    padding:20px;
    background-color: #ddd;
    a{
        font-size: 12px;
        color: #000;
        text-decoration: none;
        &:hover{
          color: #888;
        }   
    }
`;

const MentionsHeader = styled.div`
    @media screen and (max-width: 1199px ){
        margin-left:10px;
        margin-bottom:10px;
    }
`;
const Photo = styled.div`
height:60px;
width:60px;
   `;
interface Props {
   name:string;
   teamid:string;
}

const PlayerPhoto: React.FC<Props> = (props) => {
    const { teamid, name } = props;
    const photoKey: PlayerPhotoKey = { func:"photo",teamid: teamid || "", name: name || "" };
    const {data:photo,error,isLoading} = useSWR(photoKey, getPlayerPhoto);


    if(isLoading||!photo) return (
        <Skeleton variant="circular" animation="pulse" height={40} />
         )
   

  
    return (
       <Photo><Avatar sx={{width:60,height:60}} src={photo} alt={name}></Avatar></Photo>
    );
};
export default PlayerPhoto;