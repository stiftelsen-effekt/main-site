import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { Suspense, lazy, useEffect, useRef } from "react";
import PlausibleProvider from "next-plausible";

// import { usePreviewSubscription } from "../lib/sanity";
import { RouterContext, RouterContextValue, fetchRouterContext } from "../context/RouterContext";
import { ProfileLayout } from "../components/profile/layout/layout";
import { Layout } from "../components/main/layout/layout";
import { Provider } from "react-redux";
import { VisualEditing } from "next-sanity/visual-editing";
import { ConsentState } from "../types/routing";
import { createWidgetStore } from "../components/shared/components/Widget/components/WidgetWithStore";
import { useRouter } from "next/router";

const PreviewProvider = lazy(() => import("../components/shared/PreviewProvider"));
const globalWidgetStore = createWidgetStore();

export enum LayoutType {
  Default = "default",
  Profile = "profile",
}

export type GeneralPageProps = Record<string, unknown> & {
  preview: boolean;
  draftMode: boolean;
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
  const [tracking, setTracking] = React.useState(false);

  const routerContextValue = useRef<RouterContextValue | null>(
    appStaticProps?.routerContext || null,
  );

  // check for plausible_ignore localstorage to disable plausible tracking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ignore = localStorage.getItem("plausible_ignore");
      if (ignore === "true") {
        setTracking(false);
      } else {
        setTracking(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      const handleVisibilityChange = () => {
        if (tracking) {
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
          enabled={tracking}
        >
          <Provider store={globalWidgetStore}>
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
      <Provider store={globalWidgetStore}>
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
  showGiveButton = true,
}: {
  draftMode: boolean;
  consentState: ConsentState;
  layout?: LayoutType;
  showGiveButton?: boolean;
}) {
  const routerContext = await fetchRouterContext();

  const appStaticProps = {
    routerContext,
    ...(layout === LayoutType.Default
      ? {
          layout: LayoutType.Default as const,
          layoutProps: await Layout.getStaticProps({ draftMode, consentState, showGiveButton }),
        }
      : {
          layout: LayoutType.Profile as const,
          layoutProps: await ProfileLayout.getStaticProps({ draftMode, consentState }),
        }),
  };
  return appStaticProps;
}

export default MyApp;
