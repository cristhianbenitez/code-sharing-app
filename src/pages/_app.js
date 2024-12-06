import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>NoteCode - Create and Share Code Easily</title>
        <meta name="title" content="NoteCode - Create and Share Code Easily" />
        <meta
          name="description"
          content="Create, edit, and share your code snippets instantly with NoteCode. Support for multiple programming languages, real-time collaboration, and easy sharing."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://notecode.yourdomain.com/" />
        <meta property="og:title" content="NoteCode - Create and Share Code Easily" />
        <meta
          property="og:description"
          content="Create, edit, and share your code snippets instantly with NoteCode. Support for multiple programming languages, real-time collaboration, and easy sharing."
        />
        <meta property="og:image" content="https://notecode.yourdomain.com/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://notecode.yourdomain.com/" />
        <meta property="twitter:title" content="NoteCode - Create and Share Code Easily" />
        <meta
          property="twitter:description"
          content="Create, edit, and share your code snippets instantly with NoteCode. Support for multiple programming languages, real-time collaboration, and easy sharing."
        />
        <meta property="twitter:image" content="https://notecode.yourdomain.com/og-image.png" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="code editor, code sharing, programming, developer tools, collaboration, IDE, code snippets"
        />
        <meta name="author" content="NoteCode" />
        <meta name="theme-color" content="#743EE4" />
      </Head>
      <Component {...pageProps} />
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && <Analytics />}
    </>
  );
}
