import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="light">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('editor-theme') === 'dark' ||
                    (!localStorage.getItem('editor-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
                ) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `
          }}
        />
      </Head>
      <body className="antialiased bg-gradient-to-br from-[#B787F5] to-[#743EE4]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
