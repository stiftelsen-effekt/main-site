import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import React, { useMemo, useRef } from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import { State } from "../components/shared/components/Widget/store/state";
import { donationReducer } from "../components/shared/components/Widget/store/donation/reducer";
import { layoutReducer } from "../components/shared/components/Widget/store/layout/reducer";
import { errorReducer } from "../components/shared/components/Widget/store/error/reducer";
import { watchAll } from "../components/shared/components/Widget/store/root.saga";
import { referralReducer } from "../components/shared/components/Widget/store/referrals/reducer";
import { Layout } from "../components/main/layout/layout";
import { usePreviewSubscription } from "../lib/sanity";
import App from "next/app";
import { RouterContext, RouterContextValue, fetchRouterContext } from "../context/RouterContext";
import { ProfileLayout } from "../components/profile/layout/layout";

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

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  preview: boolean;
  data: { result: { page: any; footer: any }; query: string; queryParams: { slug: string } };
  appStaticProps?: Awaited<ReturnType<typeof getAppStaticProps>>;
}>) {
  const routerContextValue = useRef<RouterContextValue | null>(
    pageProps.appStaticProps?.routerContext || null,
  );
  const { data: propsData, appStaticProps } = pageProps;

  const PageLayout = { [LayoutType.Default]: Layout, [LayoutType.Profile]: ProfileLayout }[
    appStaticProps?.layout || LayoutType.Default
  ];

  const { data: previewData } = usePreviewSubscription(propsData?.query, {
    params: propsData?.queryParams ?? {},
    initialData: propsData?.result,
    enabled: pageProps.preview,
  });

  if (pageProps.data) {
    pageProps.data.result = previewData;

    const widgetData = filterWidgetToSingleItem(previewData, pageProps.preview);

    return (
      <Provider store={store}>
        <RouterContext.Provider value={routerContextValue.current}>
          <PageLayout footerData={pageProps.data.result.footer[0]} widgetData={widgetData}>
            <Component {...pageProps} />
          </PageLayout>
        </RouterContext.Provider>
      </Provider>
    );
  } else {
    return <Component {...pageProps} />;
  }
}

export async function getAppStaticProps(options?: { layout?: LayoutType }) {
  const routerContext = await fetchRouterContext();
  const appStaticProps = {
    routerContext,
    layout: options?.layout ?? LayoutType.Default,
  };
  return appStaticProps;
}

export const filterWidgetToSingleItem = (data: any, preview: boolean) => {
  if (!Array.isArray(data.widget)) {
    return data.widget;
  }

  if (data.widget.length === 1) {
    return data.widget[0];
  }

  if (preview) {
    return data.widget.find((item: any) => item._id.startsWith("drafts.")) || data.widget[0];
  }

  return data.widget[0];
};

export const filterPageToSingleItem = <T,>(data: { page: T | T[] }, preview: boolean): T | null => {
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
