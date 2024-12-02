import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { Suspense, lazy, useEffect, useRef } from "react";
import createSagaMiddleware from "redux-saga";
import PlausibleProvider from "next-plausible";
import { State } from "../components/shared/components/Widget/store/state";
import { donationReducer } from "../components/shared/components/Widget/store/donation/reducer";
import { layoutReducer } from "../components/shared/components/Widget/store/layout/reducer";
import { errorReducer } from "../components/shared/components/Widget/store/error/reducer";
import { watchAll } from "../components/shared/components/Widget/store/root.saga";
import { referralReducer } from "../components/shared/components/Widget/store/referrals/reducer";

// import { usePreviewSubscription } from "../lib/sanity";
import { RouterContext, RouterContextValue, fetchRouterContext } from "../context/RouterContext";
import { ProfileLayout } from "../components/profile/layout/layout";
import { Layout } from "../components/main/layout/layout";
import { Tuple, combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { VisualEditing } from "next-sanity";
import { ConsentState } from "../middleware.page";

const PreviewProvider = lazy(() => import("../components/shared/PreviewProvider"));

export enum LayoutType {
  Default = "default",
  Profile = "profile",
}

const sagaMiddleware = createSagaMiddleware();
const store = configureStore<State>({
  reducer: combineReducers({
    donation: donationReducer,
    layout: layoutReducer,
    error: errorReducer,
    referrals: referralReducer,
  }) as any,
  middleware: () => new Tuple(sagaMiddleware),
});
sagaMiddleware.run(watchAll);

export type GeneralPageProps = Record<string, unknown> & {
  preview: boolean;
  draftMode: boolean;
  consentState: ConsentState;
  token: string | null;
  data?: {
    result: Record<string, unknown>;
    query: string;
    queryParams: { slug?: string };
  };
  appStaticProps?: Awaited<ReturnType<typeof getAppStaticProps>>;
};

function MyApp({
  Component,
  pageProps: { appStaticProps, preview, ...pageProps },
}: AppProps<GeneralPageProps>) {
  const routerContextValue = useRef<RouterContextValue | null>(
    appStaticProps?.routerContext || null,
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          navigator.sendBeacon(
            "https://plausible.io/api/event",
            JSON.stringify({
              name: "visibility_hidden",
              url: window.location.href,
              domain: window.location.hostname,
            }),
          );
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, []);

  if (!appStaticProps) {
    console.error(`appStaticProps is not defined - did you forget to use getAppStaticProps?`);

    return <Component {...pageProps} />;
  }

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "gieffektivt.no"; //TODO: Remove temporary fallback when Vercel setup is done

  if (pageProps.draftMode) {
    if (!pageProps.token) {
      pageProps.token = process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN || "";
    }

    return (
      <PreviewProvider token={pageProps.token}>
        <PlausibleProvider
          domain={plausibleDomain}
          trackOutboundLinks={true}
          taggedEvents={true}
          revenue={true}
          trackLocalhost={false}
        >
          <Provider store={store}>
            <RouterContext.Provider value={routerContextValue.current}>
              {appStaticProps.layout === LayoutType.Default ? (
                <Layout {...appStaticProps.layoutProps}>
                  <Component {...pageProps} />
                </Layout>
              ) : (
                <ProfileLayout {...appStaticProps.layoutProps}>
                  <Component {...pageProps} />
                </ProfileLayout>
              )}
            </RouterContext.Provider>
          </Provider>
        </PlausibleProvider>
        <Suspense>
          <VisualEditing zIndex={Number.MAX_SAFE_INTEGER} />
        </Suspense>
      </PreviewProvider>
    );
  }

  return (
    <PlausibleProvider
      domain={plausibleDomain}
      trackOutboundLinks={true}
      taggedEvents={true}
      revenue={true}
    >
      <Provider store={store}>
        <RouterContext.Provider value={routerContextValue.current}>
          {appStaticProps.layout === LayoutType.Default ? (
            <Layout {...appStaticProps.layoutProps}>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <ProfileLayout {...appStaticProps.layoutProps}>
              <Component {...pageProps} />
            </ProfileLayout>
          )}
        </RouterContext.Provider>
      </Provider>
    </PlausibleProvider>
  );
}

export async function getAppStaticProps({
  draftMode = false,
  consentState,
  layout = LayoutType.Default,
}: {
  draftMode: boolean;
  consentState: ConsentState;
  layout?: LayoutType;
}) {
  const routerContext = await fetchRouterContext();
  const appStaticProps = {
    routerContext,
    ...(layout === LayoutType.Default
      ? {
          layout: LayoutType.Default as const,
          layoutProps: await Layout.getStaticProps({ draftMode, consentState }),
        }
      : {
          layout: LayoutType.Profile as const,
          layoutProps: await ProfileLayout.getStaticProps({ draftMode }),
        }),
  };
  return appStaticProps;
}

export default MyApp;
