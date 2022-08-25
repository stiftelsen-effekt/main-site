import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LayoutPage } from "../types";
import React from "react";
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

const rootReducer = combineReducers<State>({
  donation: donationReducer,
  layout: layoutReducer,
  error: errorReducer,
  referrals: referralReducer,
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(watchAll);

function MyApp({ Component, pageProps }: AppProps) {
  // Gets the page layout from the component, defaults to the main layout
  const PageLayout = (Component as LayoutPage).layout || Layout;

  if (pageProps.data) {
    const propsData = pageProps.data;
    const { data: previewData } = usePreviewSubscription(propsData?.query, {
      params: propsData?.queryParams ?? {},
      initialData: propsData?.result,
      enabled: pageProps.preview,
    });
    pageProps.data.result = previewData;

    const widgetData = filterWidgetToSingleItem(previewData, pageProps.preview);
    if ((Component as LayoutPage).filterPage) {
      pageProps.data.result.page = filterPageToSingleItem(previewData, pageProps.preview);
    }

    return (
      <Provider store={store}>
        <PageLayout footerData={pageProps.data.result.footer[0]} widgetData={widgetData}>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>
    );
  } else {
    return <Component {...pageProps} />;
  }
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

export const filterPageToSingleItem = (data: any, preview: boolean) => {
  if (!Array.isArray(data.page)) {
    return data.page;
  }

  if (data.page.length === 1) {
    return data.page[0];
  }

  if (preview) {
    return data.page.find((item: any) => item._id.startsWith("drafts.")) || data.page[0];
  }

  return data.page[0];
};

export default MyApp;
