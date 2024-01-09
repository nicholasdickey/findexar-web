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
        <title>Privacy Policy - Findexar.com</title>
    </head>
    <body>
    
    <h1>Privacy Policy for Findexar.com</h1>
    
    <p><strong>Last Updated:</strong> January 8th, 2024</p>
    
    <h2>1. Introduction</h2>
    <p>Welcome to Findexar.com. We are committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and protection of your personal information when you use our website. We do not share any personal information with third parties.</p>
    
    <h2>2. Information Collection</h2>
    <p>We collect information to provide better services to all our users. The types of personal information we may collect include:</p>
    <ul>
        <li>Contact information such as name, email address, and phone number.</li>
        <li>User-generated content, such as comments or posts you make on our forums.</li>
    </ul>
    
    <h2>3. Use of Information</h2>
    <p>The information we collect is used for the following purposes:</p>
    <ul>
        <li>To provide, maintain, and improve our services.</li>
        <li>To communicate with you, such as to respond to your inquiries or send service updates.</li>
    </ul>
    
    <h2>4. Data Protection</h2>
    <p>We take the security of your personal information seriously. We implement various security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
    
    <h2>5. Your Data Rights</h2>
    <p>You have the right to access, update, or delete the information we have on you. You can do this by contacting us directly.</p>
    
    <h2>6. Cookies</h2>
    <p>Our website may use &ldquo;cookies&ldquo; to enhance the user experience. You may choose to set your web browser to refuse cookies or to alert you when cookies are being sent.</p>
    
    <h2>7. Changes to This Privacy Policy</h2>
    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
    
    <h2>8. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at @findexar</p>
    
    </body>
    </html>)
    
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
