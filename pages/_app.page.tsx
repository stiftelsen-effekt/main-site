import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useRef } from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
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
import { composeWithDevTools } from "@redux-devtools/extension";
import { Layout } from "../components/main/layout/layout";

export enum LayoutType {
  Default = "default",
  Profile = "profile",
}

const rootReducer = combineReducers<State>({
  donation: donationReducer,
  layout: layoutReducer,
  error: errorReducer,
  referrals: referralReducer,
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(watchAll);

export type GeneralPageProps = Record<string, unknown> & {
  preview: boolean;
  data?: {
    result: Record<string, unknown> & { page?: any; footer?: any };
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

  /*
  const { data: previewData, loading: previewLoading } = usePreviewSubscription(
    pageProps.data?.query || "",
    {
      params: pageProps.data?.queryParams ?? {},
      initialData: pageProps.data?.result,
      enabled: preview && !!pageProps.data?.query,
    },
  );
  */

  if (!appStaticProps) {
    console.error(`appStaticProps is not defined - did you forget to use getAppStaticProps?`);

    return <Component {...pageProps} />;
  }

  /*
  if (previewData?.page && Array.isArray(previewData.page)) {
    previewData.page = filterPageToSingleItem(previewData, preview);
  }

  if (pageProps.data) {
    pageProps.data.result = previewData;
  }
  */

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "gieffektivt.no"; //TODO: Remove temporary fallback when Vercel setup is done

  return (
    <PlausibleProvider
      domain={plausibleDomain}
      trackOutboundLinks={true}
      taggedEvents={true}
      trackLocalhost={true} // TODO: Remove when testing is done
      enabled={true} // TODO: Remove when testing is done
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
  preview,
  layout = LayoutType.Default,
}: {
  preview: boolean;
  layout?: LayoutType;
}) {
  const routerContext = await fetchRouterContext();
  const appStaticProps = {
    routerContext,
    ...(layout === LayoutType.Default
      ? {
          layout: LayoutType.Default as const,
          layoutProps: await Layout.getStaticProps({ preview }),
        }
      : {
          layout: LayoutType.Profile as const,
          layoutProps: await ProfileLayout.getStaticProps({ preview }),
        }),
  };
  return appStaticProps;
}

export const filterPageToSingleItem = <T,>(
  data: { page?: T | T[] },
  preview: boolean,
): T | null => {
  if (!data.page) {
    return null;
  }

  if (!Array.isArray(data.page)) {
    return data.page;
  }

  if (data.page.length === 1) {
    return data.page[0];
  }

  if (data.page.length === 0) {
    return null;
  }

  if (preview) {
    return data.page.find((item: any) => item._id.startsWith("drafts.")) || data.page[0];
  }

  return data.page[0];
};

export default MyApp;
