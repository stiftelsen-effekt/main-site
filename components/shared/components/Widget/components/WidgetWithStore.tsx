import { Tuple, combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import { State } from "../store/state";
import { donationReducer } from "../store/donation/reducer";
import { layoutReducer } from "../store/layout/reducer";
import { errorReducer } from "../store/error/reducer";
import { referralReducer } from "../store/referrals/reducer";
import { watchAll } from "../store/root.saga";
import { useMemo } from "react";
import { getClient } from "../../../../../lib/sanity.client";
import { withStaticProps } from "../../../../../util/withStaticProps";
import { Widget, widgetQuery } from "./Widget";
import { WidgetProps } from "../types/WidgetProps";
import { token } from "../../../../../token";
import dynamic from "next/dynamic";
import {
  PrefilledDistribution,
  WidgetPaneProps,
} from "../../../../main/layout/WidgetPane/WidgetPane";
import { RecurringDonation } from "../types/Enums";

// Create a store factory function
export const createWidgetStore = () => {
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
  return store;
};

// Create a wrapper component that provides its own store
export const WidgetStoreProvider: React.FC<{
  children: React.ReactNode;
  isInline?: boolean;
}> = ({ children, isInline }) => {
  // Create a new store instance for this widget
  const store = useMemo(() => createWidgetStore(), []);

  return <Provider store={store}>{children}</Provider>;
};

// Modified Widget component that uses the store provider
export const WidgetWithStore = withStaticProps(
  async ({
    draftMode,
    inline,
    prefilled,
    prefilledSum,
    defaultPaymentType,
  }: {
    draftMode: boolean;
    inline?: boolean;
    prefilled?: PrefilledDistribution;
    prefilledSum?: number;
    defaultPaymentType?: RecurringDonation;
  }) => {
    const result = await getClient(draftMode ? token : undefined).fetch<WidgetProps>(widgetQuery);

    if (!result.methods?.length) {
      throw new Error("No payment methods found");
    }

    return {
      data: {
        result,
        query: widgetQuery,
      },
      inline: inline ?? false,
      prefilled: prefilled ?? null,
      prefilledSum: prefilledSum ?? null,
      defaultPaymentType: defaultPaymentType ?? RecurringDonation.NON_RECURRING,
    };
  },
)(({ data, inline = false, prefilled, prefilledSum, defaultPaymentType }) => {
  return (
    <WidgetStoreProvider isInline={inline}>
      <Widget
        data={data}
        inline={inline}
        prefilled={prefilled}
        defaultPaymentType={defaultPaymentType}
      />
    </WidgetStoreProvider>
  );
});
