import { NextPage } from "next";
import React, { ReactElement } from "react";
import { Footer } from "../footer";
import { Navbar } from "./navbar";
import styles from '../../styles/Layout.module.css'
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Router from 'next/router';
import { LayoutElement } from "../../types";
import { UserWrapper } from "./userwrapper";

const onRedirectCallback = (appState: any) => {
  Router.replace(appState?.returnTo || '/profile/');
};

export const Layout: LayoutElement = ({ children }) => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ''}
      audient={'https://data.gieffektivt.no'}
      scope="read_all_donations"
      redirectUri={typeof window !== 'undefined' ? window.location.origin + '/profile/' : undefined}
      onRedirectCallback={onRedirectCallback}
    >
      <div className={styles.container}>
        <UserWrapper>
          <Navbar />
          <main className={styles.main}>{children}</main>
          <Footer />
        </UserWrapper>
      </div>
    </Auth0Provider>
  )
}