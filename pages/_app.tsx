import '../styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { SmartLinkProvider } from '../components/shared/contexts/SmartLink';

export default function MyApp({
  Component,
  pageProps,
}: AppProps) {
  return (
    <SmartLinkProvider>
      <div className="w-full h-screen">
        <Component {...pageProps} />
        <Head>
          {/* default title */}
          <title>Ficto</title>
          <link
            rel="icon"
            href="/favicon.png"
          />
        </Head>
        <Analytics />
      </div>
    </SmartLinkProvider>
  );
}
