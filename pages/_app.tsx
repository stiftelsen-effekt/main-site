import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LayoutPage } from "../types";
import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import { State } from "../components/main/widget/store/state";
import { donationReducer } from "../components/main/widget/store/donation/reducer";
import { layoutReducer } from "../components/main/widget/store/layout/reducer";
import { errorReducer } from "../components/main/widget/store/error/reducer";
import { watchAll } from "../components/main/widget/store/root.saga";
import { referralReducer } from "../components/main/widget/store/referrals/reducer";
import { Layout } from "../components/main/layout/layout";

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
  return pageProps.data ? (
    <Provider store={store}>
      <PageLayout footerData={pageProps.data.result.footer[0]}>
        <Component {...pageProps} />
      </PageLayout>
    </Provider>
  ) : (
    <Component {...pageProps} />
  );
}

export default MyApp;
