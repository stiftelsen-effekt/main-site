import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { Auth0Provider, CacheLocation } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { UserWrapper } from "./userwrapper";
import { DonorProvider } from "./donorProvider";
import { ActivityProvider } from "./activityProvider";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import {
  BanerContextType,
  BannerContext,
  getInitialBannerMarginTop,
  WidgetContext,
  WidgetContextType,
} from "../../main/layout/layout";
import { WidgetPane } from "../../main/layout/WidgetPane/WidgetPane";
import { useRouterContext } from "../../../context/RouterContext";
import { PreviewBlock } from "../../main/layout/PreviewBlock/PreviewBlock";
import { MissingNameModal, MissingNameModalConfig } from "./MissingNameModal/MissingNameModal";
import { withStaticProps } from "../../../util/withStaticProps";
import { Widget } from "../../shared/components/Widget/components/Widget";
import { getClient } from "../../../lib/sanity.client";
import { token } from "../../../token";
import { ConsentState } from "../../../middleware.page";

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
    general_banner?: any;
    missing_name_modal_config?: MissingNameModalConfig;
  };
};

export const profileQuery = `
  {
    "data": {
      "site_title": *[_type == "site_settings"][0].title,
      "general_banner": *[_type == "site_settings"][0].general_banner->,
      "login_error_configuration": *[_id == "dashboard"][0].login_error_configuration,
      "missing_name_modal_config": *[_id == "dashboard"][0].missing_name_modal_configuration
    }
  }
`;

export const ProfileLayout = withStaticProps(
  async ({
    draftMode = false,
    consentState,
  }: {
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const result = await getClient(draftMode ? token : undefined).fetch<QueryResult>(profileQuery);

    return {
      footerData: await Footer.getStaticProps({ draftMode }),
      widgetData: await Widget.getStaticProps({ draftMode }),
      profileData: result.data,
      consentState,
      draftMode,
    };
  },
)(({ children, footerData, widgetData, profileData, consentState, draftMode }) => {
  const { dashboardPath } = useRouterContext();

  const [widgetContext, setWidgetContext] = useState<WidgetContextType>({
    open: false,
    prefilled: null,
    prefilledSum: null,
  });
  const widgetContextValue = useMemo<
    [WidgetContextType, Dispatch<SetStateAction<WidgetContextType>>]
  >(() => [widgetContext, setWidgetContext], [widgetContext]);

  const [banners, setBanners] = useState<BanerContextType>({
    consentState,
    consentExpired: false,
    privacyPolicyLastMajorChange: undefined,
    generalBannerDismissed: false,
    layoutPaddingTop:
      consentState === "undecided" || profileData.general_banner ? getInitialBannerMarginTop() : 0,
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
      authorizationParams={{
        audience: process.env.NEXT_PUBLIC_AUTH_AUDIENCE || "",
        redirect_uri:
          typeof window !== "undefined"
            ? [window.location.origin, ...dashboardPath, ""].join("/")
            : undefined,
      }}
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
                {draftMode && <PreviewBlock />}
                <WidgetContext.Provider value={widgetContextValue}>
                  <BannerContext.Provider value={[banners, setBanners]}>
                    <WidgetPane
                      darkMode={true}
                      {...widgetData}
                      prefilled={widgetContext.prefilled}
                      prefilledSum={widgetContext.prefilledSum}
                    />
                    <main className={styles.main}>{children}</main>
                    {profileData.missing_name_modal_config && (
                      <MissingNameModal config={profileData.missing_name_modal_config} />
                    )}
                  </BannerContext.Provider>
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
