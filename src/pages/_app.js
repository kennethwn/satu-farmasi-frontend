import "@/styles/tailwind.css";
import Head from "next/head";
import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import 'rsuite/dist/rsuite.min.css';

export default function App({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Satu Farmasi</title>
      </Head>
      <div>
        <Component {...pageProps} />
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}
