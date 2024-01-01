import type { AppProps } from 'next/app'
import { ClerkProvider } from "@clerk/nextjs";
import { SessionProvider } from "next-auth/react"
export default function App({ Component, pageProps }: AppProps) {
  return  ( 
    <ClerkProvider {...pageProps}>
   
    <Component {...pageProps} />

    </ClerkProvider>
        )
}
