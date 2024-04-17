import Head from "next/head";
import "../styles/variables.css";
import "../styles/globals.css";
import "../styles/compositions.css";
import "../styles/blocks.css";
import "../styles/utilities.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
