import React from "react";
import Footer from "../footer";
import { Navbar } from "./navbar";
import styles from "../../styles/Layout.module.css";
import { Auth0Provider } from "@auth0/auth0-react";
import Router from "next/router";
import { LayoutElement } from "../../types";
import { UserWrapper } from "./userwrapper";
import { DonorProvider } from "./donorProvider";
import { ActivityProvider } from "./activityProvider";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { MainHeader } from "../main/header";

const onRedirectCallback = (appState: any) => {
  Router.replace(appState?.returnTo || "/profile/");
};

export const Layout: LayoutElement = ({ children, footerData }) => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}
      audience="https://data.gieffektivt.no"
      scope="openid profile email read:donations read:profile write:profile read:distributions read:agreements write:agreements"
      redirectUri={typeof window !== "undefined" ? window.location.origin + "/profile/" : undefined}
      onRedirectCallback={onRedirectCallback}
      cacheLocation={
        typeof window !== "undefined"
          ? (window as any).Cypress
            ? "localstorage"
            : "memory"
          : undefined
      }
    >
      <div className={styles.container + " " + styles.dark}>
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
                  style={{ maxWidth: 200 }}
                  toastStyle={{ borderRadius: 0, background: "white", color: "black" }}
                />
                <main className={styles.main}>{children}</main>
                <Footer {...footerData} />
              </ActivityProvider>
            </DonorProvider>
          </UserWrapper>
        </SWRConfig>
      </div>
    </Auth0Provider>
  );
};
