import React, { useMemo, useState } from "react";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { Auth0Provider, CacheLocation } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { UserWrapper } from "./userwrapper";
import { DonorProvider } from "./donorProvider";
import { ActivityProvider } from "./activityProvider";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { CookiesAccepted, WidgetContext } from "../../main/layout/layout";
import { WidgetPane } from "../../main/layout/WidgetPane/WidgetPane";
import { useRouterContext } from "../../../context/RouterContext";
import { PreviewBlock } from "../../main/layout/PreviewBlock/PreviewBlock";
import { MissingNameModal } from "./MissingNameModal/MissingNameModal";
import { withStaticProps } from "../../../util/withStaticProps";
import { Widget } from "../../shared/components/Widget/components/Widget";
import { getClient } from "../../../lib/sanity.server";

const createRedirectCallback = (dashboardPath: string[]) => (appState: any) => {
  Router.replace(appState?.returnTo || dashboardPath.join("/"));
};

const routesToBypass = ["/min-side/vipps-anonym"];

const useShouldAuthenticate = (): boolean => {
  const { asPath } = useRouter();
  const shouldBypass = routesToBypass.some((route) => asPath.startsWith(route));
  return shouldBypass;
};

type QueryResult = {
  data: {
    site_title: string;
    login_error_configuration: {
      login_abort_label: string;
      login_button_label: string;
    };
  };
};

export const profileQuery = `
  {
    "data": {
      "site_title": *[_type == "site_settings"][0].title,
      "login_error_configuration": *[_id == "dashboard"][0].login_error_configuration,
    }
  }
`;

export const ProfileLayout = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<QueryResult>(profileQuery);

  return {
    footerData: await Footer.getStaticProps({ preview }),
    widgetData: await Widget.getStaticProps({ preview }),
    profileData: result.data,
    isPreview: preview,
  };
})(({ children, footerData, widgetData, profileData, isPreview }) => {
  const { dashboardPath } = useRouterContext();
  const [widgetOpen, setWidgetOpen] = useState(false);
  // Set true as default to prevent flashing on first render
  const [cookiesAccepted, setCookiesAccepted] = useState({
    accepted: true,
    loaded: true,
  });
  const bypassAuth = useShouldAuthenticate();

  let cacheLocation: CacheLocation = "memory";
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      cacheLocation = "localstorage";
    } else if ((window as any).Cypress) {
      cacheLocation = "localstorage";
    }
  }

  const onRedirectCallback = useMemo(() => createRedirectCallback(dashboardPath), [dashboardPath]);

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || ""}
      audience={process.env.NEXT_PUBLIC_AUTH_AUDIENCE || ""}
      redirectUri={
        typeof window !== "undefined"
          ? [window.location.origin, ...dashboardPath, ""].join("/")
          : undefined
      }
      onRedirectCallback={onRedirectCallback}
      cacheLocation={cacheLocation}
    >
      <div className={styles.container + " " + styles.dark}>
        <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
          <UserWrapper
            skipAuthentication={bypassAuth}
            siteTitle={profileData.site_title}
            loginErrorConfig={profileData.login_error_configuration}
          >
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
                {isPreview && <PreviewBlock />}
                <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
                  <CookiesAccepted.Provider value={[cookiesAccepted, setCookiesAccepted]}>
                    <WidgetPane darkMode={true} {...widgetData} />
                    <main className={styles.main}>{children}</main>
                    <MissingNameModal />
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
});
