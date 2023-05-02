import React, { useState } from "react";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { Auth0Provider, CacheLocation } from "@auth0/auth0-react";
import Router from "next/router";
import { LayoutProps } from "../../../types";
import { UserWrapper } from "./userwrapper";
import { DonorProvider } from "./donorProvider";
import { ActivityProvider } from "./activityProvider";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { CookiesAccepted, WidgetContext } from "../../main/layout/layout";
import { WidgetPane } from "../../main/layout/WidgetPane/WidgetPane";

const onRedirectCallback = (appState: any) => {
  Router.replace(appState?.returnTo || "/min-side/");
};

export const ProfileLayout: React.FC<LayoutProps> = ({ children, footerData, widgetData }) => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  // Set true as default to prevent flashing on first render
  const [cookiesAccepted, setCookiesAccepted] = useState(true);

  let cacheLocation: CacheLocation = "memory";
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      cacheLocation = "localstorage";
    } else if ((window as any).Cypress) {
      cacheLocation = "localstorage";
    }
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}
      audience="https://data.gieffektivt.no"
      scope="openid profile email read:donations read:profile write:profile read:distributions read:agreements write:agreements"
      redirectUri={
        typeof window !== "undefined" ? window.location.origin + "/min-side/" : undefined
      }
      onRedirectCallback={onRedirectCallback}
      cacheLocation={cacheLocation}
    >
      <div className={styles.container + " " + styles.dark}>
        <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
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
                  toastStyle={{ borderRadius: 0, background: "white", color: "black" }}
                />
                <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
                  <CookiesAccepted.Provider value={[cookiesAccepted, setCookiesAccepted]}>
                    <WidgetPane darkMode={true} text={widgetData} />
                    <main className={styles.main}>{children}</main>
                  </CookiesAccepted.Provider>
                </WidgetContext.Provider>
                <Footer {...footerData} />
              </ActivityProvider>
            </DonorProvider>
          </UserWrapper>
        </SWRConfig>
      </div>
    </Auth0Provider>
  );
};
