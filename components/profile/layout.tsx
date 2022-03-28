import { NextPage } from "next";
import React, { ReactElement, useState } from "react";
import { Footer } from "../footer";
import { Navbar } from "./navbar";
import styles from '../../styles/Layout.module.css'
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Router from 'next/router';
import { LayoutElement } from "../../types";
import { UserWrapper } from "./userwrapper";
import { DonorProvider } from "./donorProvider";
import { ActivityIndicator } from "../elements/activityindicator";
import { ActivityProvider } from "./activityProvider";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";

const onRedirectCallback = (appState: any) => {
  Router.replace(appState?.returnTo || '/profile/');
};

export const Layout: LayoutElement = ({ children }) => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ''}
      audience='https://data.gieffektivt.no'
      scope="read:donations read:profile write:profile read:distributions read:agreements write:agreements"
      redirectUri={typeof window !== 'undefined' ? window.location.origin + '/profile/' : undefined}
      onRedirectCallback={onRedirectCallback}
    >
      <div className={styles.container}>
        <SWRConfig value={{ revalidateOnFocus: false }}>
          <UserWrapper>
            <DonorProvider>
              <ActivityProvider>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={true}
                  newestOnTop={true}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  closeButton={false}
                  style={{ maxWidth:200 }}
                  toastStyle={{ borderRadius: 0, background: 'white', color: 'black' }}
                  />
                <Navbar />
                <main className={styles.main}>{children}</main>
                <Footer />
              </ActivityProvider>
            </DonorProvider>
          </UserWrapper>
        </SWRConfig>
      </div>
    </Auth0Provider>
  )
}