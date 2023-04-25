import '../styles/globals.css'
import Head from 'next/head'
import { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-screen bg-green-100 overflow-auto">
      <Component {...pageProps} />
      <Head>
        <title>Kontent.ai Next.js boilerplate</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
    </div>
  )
}

