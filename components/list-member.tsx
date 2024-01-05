import React, { useState } from "react";
import { styled } from "styled-components";
import useSWR from 'swr';
import { useRouter } from 'next/router'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { UserAddListParams, addUserList, UserListsKey, getUserLists,UserUpdateListMembersParams,updateUserListMembers,UserListMembersKey,getUserListMembers } from '@/lib/api';
import PlayerPhoto from "./player-photo";

const Photo = styled.div`
  height:60px;
  width:60px;
  @media screen and (max-width: 1199px) {
    height:50px;
    width:50px;
  }
`;
const Member=styled.div`
    font-size:28px;
    font-family: 'Roboto', sans-serif;
`;
const MemberContainer=styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    `;
export interface ListMemberProps {
    member: string;
    teamid: string;
    openListMember: boolean;
    setOpenListMember: (open: boolean) => void;
}
const ListMember = ({ member, teamid, openListMember, setOpenListMember }: ListMemberProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [listxid, setListxid] = useState("");
    const [listName,setListName]=useState("");
    const keyLists: UserListsKey = { type: "userLists" };
    const { data: lists, mutate: listsMutate, isLoading: listsIsLoading } = useSWR(keyLists, getUserLists);
    const keyListMembers: UserListMembersKey = { type: "userListMembers", listxid: listxid };
    const { data: listMembers, mutate: listMembersMutate, isLoading: listMembersIsLoading } = useSWR(keyListMembers, getUserListMembers);
    const ListMenu=lists&&lists.length>0&&!listsIsLoading?lists.map((list:{listxid:string,name:string},i:number) => {
        return <MenuItem key={"wefo-"+i} value={list.listxid}>{list.name}</MenuItem>
    }):null;
    const theme = useTheme();
    const router = useRouter();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    console.log("ListMembers",{listxid,lists,listMembers});
    return <Dialog fullScreen={fullScreen} open={openListMember} onClose={() => { setOpenListMember(false); }}>
        <DialogTitle>Add Player to List</DialogTitle>
        <DialogContent>
        < MemberContainer><Photo><PlayerPhoto teamid={teamid || ""} name={member || ""} /></Photo> <Member>{member}</Member></MemberContainer> 
        <br/>
            <DialogContentText>
               Select an existing custom list:
            </DialogContentText>
            <br/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">List</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={listxid}
                    label="List"
                    onChange={(e)=>setListxid(e.target.value as string)}
                >
                    {ListMenu}
                </Select>
            </FormControl>
            <br/><br/><br/>
            <DialogContentText>
               Or create a new list:
            </DialogContentText>
            <TextField onChange={(e)=>setName(e.target.value)} value={name} margin="dense" fullWidth id="name" label="Name" variant="outlined" />
            <TextField onChange={(e)=>setDescription(e.target.value)} value={description} margin="dense" fullWidth multiline id="description" label="Description" variant="outlined" />

            <Button onClick={async () => {
              //  setOpenListMember(false);
                const param: UserAddListParams = { name: name, description: description };
                const lists:{listxid:string,name:string,description:string}[]=await addUserList(param);
                setName("");
                setDescription("");
               
                listsMutate(lists);
                //find listxid from lists where name==name
                const list:{listxid:string,name:string,description:string}|undefined=lists.find((l:{name:string})=>l.name==name);
                if(list){
                    setListName(list.name);
                    setListxid(list.listxid);
                }
            }}>Create New List</Button>

        </DialogContent>
        <DialogActions><Button onClick={() => { setOpenListMember(false); router.push(`/pro/list/${listxid}`)}}>Go to list</Button></DialogActions>
        <DialogActions>
            
            <Button onClick={() => { setOpenListMember(false); }}>Cancel</Button>
            <Button disabled={!listxid} onClick={async () => { 
                setOpenListMember(false); 
                const newMembersList=listMembers?[{member,teamid},...listMembers]:[{member,teamid}]
                const updateParams: UserUpdateListMembersParams = { listxid: listxid, members:  newMembersList};
                listMembersMutate(newMembersList);
                await updateUserListMembers(updateParams);            
            }}>{`Add to list`}</Button>


            
        </DialogActions>
    </Dialog>
}
export default ListMember;