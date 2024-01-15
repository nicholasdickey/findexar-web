import React from 'react';
import styled from 'styled-components';
import { SignInButton} from "@clerk/nextjs";
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
const Container = styled.div`
padding: 20px;
background-color:var(--background);
color:var(--text);
padding-bottom:100vw;
`;

interface Props {
    type: string;
    noUser?: boolean;
}
const Explanation = ({type,noUser}:Props) => {
    if(type=='myfeed'){
        return (
            <Container>
              <h2>My Feed</h2>
              <p> My Feed is a stream of mentions for athletes selected in &ldquo;My Team&ldquo; collection. </p>
              {!noUser&&<p>It appears your feed is empty.</p>}
              {noUser&&<p>&ldquo;My Team&ldquo; is only available to registered users. Please sign-up or sign-in to use this feature.</p>}
              <br/>
              {noUser && <SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
       
            </Container>
        )
    }
    return (
        <Container>
            <h2>Favorites</h2>
            <p> Favorites is a list of mentions that you saved by clicking on a star icon. </p>
            <p> It appears your favorites collection is empty. </p>
            {noUser&&<p>&ldquo;Favorites&ldquo; is only available to registered users. Please sign-up or sign-in to use this feature.</p>}
              <br/>
              {noUser && <SignInButton><Button size="small" variant="outlined" style={{ paddingRight: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}><LoginIcon />&nbsp;&nbsp;Sign-In</Button></SignInButton>}
       
        </Container>
    )

}

export default Explanation;
