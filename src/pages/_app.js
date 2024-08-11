import "@/styles/tailwind.css";
// import { UserProvider } from "@/context/UserContext";
import Head from "next/head";
import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import 'rsuite/dist/rsuite.min.css';
import { UserProvider } from "./api/context/UserContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Satu Farmasi</title>
      </Head>
      <div>
        <UserProvider >
          <Component {...pageProps} />
        </UserProvider>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}
