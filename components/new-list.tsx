import React,{useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {  UserAddListParams, addUserList } from '@/lib/api';
 
interface NewListProps {
    mutateLists: any;
    addList: boolean;
    setAddList: (value: boolean) => void;
}
const NewList = ({mutateLists,addList,setAddList}:NewListProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return <Dialog fullScreen={fullScreen} open={addList} onClose={() => { setAddList(false); }}>
        <DialogTitle>Add List</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To create a custom list of athletes, choose a unique short name and provide a brief description.
            </DialogContentText>
            <TextField onChange={(e)=>setName(e.target.value)} value={name} margin="dense" fullWidth id="name" label="Name" variant="outlined" />
            <TextField onChange={(e)=>setDescription(e.target.value)} value={description} margin="dense" fullWidth multiline id="description" label="Description" variant="outlined" />

        </DialogContent>
        <DialogActions>
            <Button onClick={() => { setAddList(false); }}>Cancel</Button>


            <Button onClick={async () => {
                setAddList(false);
                const param: UserAddListParams = { name: name, description:description};
                const lists=await addUserList(param);
                mutateLists(lists);
            }}>Create List</Button>
        </DialogActions>
    </Dialog>
}
export default NewList;