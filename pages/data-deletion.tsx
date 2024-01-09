import * as React from 'react';
import { GetServerSidePropsContext } from "next";
import { isbot } from '../lib/isbot.js';
import SinglePage from '../components/single-page';
import { recordEvent } from '../lib/api'
interface Props {

}
export default function Home(props: Props) {
    return (
        
        <html>
        <head>
            <title>Data Deletion Instructions - Findexar.com</title>
        </head>
        <body>
        
        <h1>Data Deletion Instructions for Findexar.com</h1>
        
        <p>To request the deletion of your data from Findexar.com, please follow the instructions below:</p>
        
        <ol>
            <li>Visit our data deletion request page at <a href="https://www.findexar.com/data-deletion">https://www.findexar.com/data-deletion</a>.</li>
            <li>Provide the necessary information, including your user ID and contact details.</li>
            <li>Submit the deletion request form.</li>
        </ol>
        
        <p>Upon receiving your request, we will verify your identity and proceed with the deletion of your data from our systems. Please allow us a reasonable time frame to process your request.</p>
        
        <p>If you have any questions or need assistance with the data deletion process, feel free to contact us at <a href="mailto:contact@findexar.com">contact@findexar.com</a>.</p>
        
        </body>
        </html>
        )
    
}
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      
        return {
            props: { }
        }
    }
    catch(x){
        console.log(x);
        return {
            props: { error: 503 }
        }
    }
}
