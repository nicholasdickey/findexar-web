import React from "react";
import useSWR from 'swr';
import { styled } from "styled-components";
import Skeleton from '@mui/material/Skeleton';
import { PlayerPhotoKey,getPlayerPhoto } from '@/lib/api';
import Avatar from '@mui/material/Avatar';

const Photo = styled.div`
    height:60px;
    width:60px;
    @media screen and (max-width: 1199px ){
        height:50px;
        width:50px;
    }

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
       <Photo><Avatar sx={{width:50,height:50}} src={photo} alt={name}></Avatar></Photo>
    );
};
export default PlayerPhoto;