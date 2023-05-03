import React, { ReactNode, useState } from "react";
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
import { useRouterContext } from "../../../context/RouterContext";

const onRedirectCallback = (dashboardPath: string[]) => (appState: any) => {
  Router.replace(appState?.returnTo || dashboardPath.join("/"));
};

const shouldBypassAuth = (): boolean => {
  if (typeof window === "undefined") return false;

  const routesToBypass = ["/min-side/vipps-anonym"];
  return routesToBypass.includes(window.location.pathname);
};

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <UserWrapper>
      <DonorProvider>
        <ActivityProvider>{children}</ActivityProvider>
      </DonorProvider>
    </UserWrapper>
  );
};

const UnauthenticatedLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const ProfileLayout: React.FC<LayoutProps> = ({ children, footerData, widgetData }) => {
  const { dashboardPath } = useRouterContext();
  const [widgetOpen, setWidgetOpen] = useState(false);
  // Set true as default to prevent flashing on first render
  const [cookiesAccepted, setCookiesAccepted] = useState(true);
  const bypassAuth = shouldBypassAuth();

  let cacheLocation: CacheLocation = "memory";
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      cacheLocation = "localstorage";
    } else if ((window as any).Cypress) {
      cacheLocation = "localstorage";
    }
  }

  const CustomAuth0Provider = ({ children }: { children: ReactNode }) => {
    if (bypassAuth) return <>{children}</>;

    return (
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_DOMAIN || ""}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}
        audience="https://data.gieffektivt.no"
        scope="openid profile email read:donations read:profile write:profile read:distributions read:agreements write:agreements"
        redirectUri={
          typeof window !== "undefined"
            ? [window.location.origin, ...dashboardPath, ""].join("/")
            : undefined
        }
        onRedirectCallback={() => onRedirectCallback(dashboardPath)}
        cacheLocation={cacheLocation}
      >
        {children}
      </Auth0Provider>
    );
  };

  const layoutContent = bypassAuth ? (
    <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
  ) : (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  );

  return (
    <CustomAuth0Provider>
      <div className={styles.container + " " + styles.dark}>
        <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
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
              <main className={styles.main}>{layoutContent}</main>
            </CookiesAccepted.Provider>
          </WidgetContext.Provider>
          <Footer {...footerData} />
        </SWRConfig>
      </div>
    </CustomAuth0Provider>
  );
};
