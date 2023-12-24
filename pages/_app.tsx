//import '@/styles/globals.css'
import type { AppProps } from 'next/app'
if (typeof document === 'undefined') { // @ts-ignore 
  global.document = { querySelector: function () {}, }; }
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
