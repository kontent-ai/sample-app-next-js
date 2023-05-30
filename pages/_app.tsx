import '../styles/globals.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-screen">
      <Component {...pageProps} />
      <Head>
        <title>Kontent.ai Next.js boilerplate</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Analytics />
    </div>
  )
}

