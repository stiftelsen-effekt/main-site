import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { Auth0Provider, CacheLocation } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { UserWrapper } from "./userwrapper";
import { DonorProvider } from "./donorProvider";
import { ActivityProvider } from "./activityProvider";
import { NavbarAuthProvider } from "./NavbarAuthProvider";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import {
  BanerContextType,
  BannerContext,
  WidgetContext,
  WidgetContextType,
} from "../../main/layout/layout";
import { WidgetPane } from "../../main/layout/WidgetPane/WidgetPane";
import { useRouterContext } from "../../../context/RouterContext";
import { MainLocaleContext } from "../../../context/MainLocaleContext";
import { PreviewBlock } from "../../main/layout/PreviewBlock/PreviewBlock";
import { MissingNameModal } from "./MissingNameModal/MissingNameModal";
import { withStaticProps } from "../../../util/withStaticProps";
import { getProfileLayoutStaticProps } from "./layoutStaticProps";
import {
  useExternalDonationWidget,
  getExternalDonationUrls,
} from "../../../util/externalDonationWidget";

const createRedirectCallback = (dashboardPath: string[]) => (appState: any) => {
  const path = appState?.returnTo || dashboardPath.join("/");
  window.history.pushState({}, "", path);
};

const routesToBypass = ["/min-side/vipps-anonym"];

const useShouldAuthenticate = (): boolean => {
  const { asPath } = useRouter();
  const shouldBypass = routesToBypass.some((route) => asPath.startsWith(route));
  return shouldBypass;
};

export const ProfileLayout = withStaticProps(getProfileLayoutStaticProps)(({
  children,
  footerData,
  widgetData,
  profileData,
  consentState,
  draftMode,
}) => {
  const { dashboardPath } = useRouterContext();

  const [widgetContext, setInternalWidgetContext] = useState<WidgetContextType>({
    open: false,
    prefilled: null,
    prefilledSum: null,
  });
  const externalDonationUrls = getExternalDonationUrls(
    widgetData.data.result.external_donation_widget,
  );
  const usesExternalWidget = externalDonationUrls !== null;
  const setWidgetContext = useExternalDonationWidget(
    externalDonationUrls,
    widgetContext,
    setInternalWidgetContext,
  );
  const widgetContextValue = useMemo<
    [WidgetContextType, Dispatch<SetStateAction<WidgetContextType>>]
  >(() => [widgetContext, setWidgetContext], [widgetContext, setWidgetContext]);

  const [banners, setBanners] = useState<BanerContextType>({
    consentState,
    consentExpired: false,
    privacyPolicyLastMajorChange: undefined,
    generalBannerDismissed: false,
  });

  const bypassAuth = useShouldAuthenticate();

  let cacheLocation: CacheLocation = "memory";
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    cacheLocation = "localstorage";
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
          <MainLocaleContext.Provider
            value={(profileData.main_locale as "no" | "sv" | "dk" | "en" | "et") ?? "no"}
          >
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
                  <WidgetContext.Provider value={widgetContextValue}>
                    <BannerContext.Provider value={[banners, setBanners]}>
                      {!usesExternalWidget && (
                        <WidgetPane
                          darkMode={true}
                          {...widgetData}
                          prefilled={widgetContext.prefilled}
                          prefilledSum={widgetContext.prefilledSum}
                        />
                      )}
                      <main className={styles.main}>
                        <NavbarAuthProvider>{children}</NavbarAuthProvider>
                      </main>
                      {profileData.missing_name_modal_config && (
                        <MissingNameModal config={profileData.missing_name_modal_config} />
                      )}
                    </BannerContext.Provider>
                  </WidgetContext.Provider>
                  <Footer {...footerData} />
                </ActivityProvider>
              </DonorProvider>
            </UserWrapper>
          </MainLocaleContext.Provider>
        </SWRConfig>
      </div>
    </Auth0Provider>
  );
});
