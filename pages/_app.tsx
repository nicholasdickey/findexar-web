import type { AppProps } from 'next/app'
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { SubscriptionProvider } from "use-stripe-subscription";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SubscriptionProvider
      stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
    >
      <ClerkProvider {...pageProps}>

        <Component {...pageProps} />

      </ClerkProvider></SubscriptionProvider>
  )
}
