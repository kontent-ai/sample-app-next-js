import '../styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { LivePreviewProvider } from '../components/shared/contexts/LivePreview';
import {
  SmartLinkProvider,
  useSmartLink,
} from '../components/shared/contexts/SmartLink';

const App = ({
  Component,
  pageProps,
}: AppProps) => {
  const smartLink = useSmartLink();

  return (
    <LivePreviewProvider smartLink={smartLink}>
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
    </LivePreviewProvider>
  );
};

export default function MyApp(props: AppProps) {
  return (
    <SmartLinkProvider>
      <App {...props} />
    </SmartLinkProvider>
  );
}
