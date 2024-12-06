import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && <Analytics />}
    </>
  );
}
