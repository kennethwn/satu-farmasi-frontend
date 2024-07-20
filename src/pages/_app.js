import "@/styles/tailwind.css";
// import { UserProvider } from "@/context/UserContext";
import Head from "next/head";
import React from "react";
import 'rsuite/dist/rsuite.min.css';
import { UserProvider } from "./api/context/UserContext";

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
      </div>
    </React.Fragment>
  )
}
