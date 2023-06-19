import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useRef } from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { State } from "../components/shared/components/Widget/store/state";
import { donationReducer } from "../components/shared/components/Widget/store/donation/reducer";
import { layoutReducer } from "../components/shared/components/Widget/store/layout/reducer";
import { errorReducer } from "../components/shared/components/Widget/store/error/reducer";
import { watchAll } from "../components/shared/components/Widget/store/root.saga";
import { referralReducer } from "../components/shared/components/Widget/store/referrals/reducer";
import { Layout } from "../components/main/layout/layout";
import { usePreviewSubscription } from "../lib/sanity";
import { RouterContext, RouterContextValue, fetchRouterContext } from "../context/RouterContext";
import { ProfileLayout } from "../components/profile/layout/layout";
import { composeWithDevTools } from "@redux-devtools/extension";

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
  const { data: propsData } = pageProps;

  const { data: previewData, loading: previewLoading } = usePreviewSubscription(propsData?.query, {
    params: propsData?.queryParams ?? {},
    initialData: propsData?.result,
    enabled: pageProps.preview,
  });

  if (pageProps.data) {
    if (Array.isArray(previewData.page)) {
      previewData.page = filterPageToSingleItem(previewData, pageProps.preview);
    }

    pageProps.data.result = previewData;

    return (
      <Provider store={store}>
        <RouterContext.Provider value={routerContextValue.current}>
          <Component {...pageProps} />
        </RouterContext.Provider>
      </Provider>
    );
  } else {
    return <Component {...pageProps} />;
  }
}

export async function getAppStaticProps() {
  const routerContext = await fetchRouterContext();
  const appStaticProps = {
    routerContext,
  };
  return appStaticProps;
}

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
