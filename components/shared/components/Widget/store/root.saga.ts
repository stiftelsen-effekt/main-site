import { Middleware } from "redux";
import { all, takeLatest } from "redux-saga/effects";
import { PaymentMethod, RecurringDonation } from "../types/Enums";
import {
  draftAgreementAction,
  draftAvtaleGiroAction,
  registerBankPendingAction,
  registerDonationAction,
} from "./donation/actions";
import {
  draftAvtaleGiro,
  draftVippsAgreement,
  registerBankPending,
  registerDonation,
} from "./donation/saga";
import { fetchReferralsAction, submitReferralAction } from "./referrals/actions";
import { fetchReferrals, submitReferral } from "./referrals/saga";
import { State } from "./state";
import { fetchCauseAreasAction } from "./layout/actions";
import { fetchCauseAreas } from "./layout/saga";

const postCustomEvent = (
  action: string,
  category: string,
  recurring: RecurringDonation,
  value?: number,
) => {
  const eventData = {
    action,
    category,
    label: recurring === RecurringDonation.RECURRING ? "Recurring" : "Non-recurring",
  };
  window.parent.postMessage(value ? { ...eventData, value } : eventData, "https://gieffektivt.no/");
};

const postPurchaseEvent = (kid?: string, value?: number) => {
  const eventData = {
    action: "purchase",
    kid,
    value,
  };
  window.parent.postMessage(eventData, "https://gieffektivt.no/");
};

export const postMessageMiddleware: Middleware =
  ({ getState }) =>
  (next) =>
  (action: any) => {
    const { donation, layout }: State = getState();
    switch (action.type) {
      case "SELECT_PAYMENT_METHOD":
        if (action.payload.method) {
          postCustomEvent(
            `Payment method selected: ${PaymentMethod[action.payload.method]}`,
            "Payment method selected",
            donation.recurring,
          );
        }
        break;
      case "INCREMENT_CURRENT_PANE":
        postCustomEvent(
          `Proceeded to step ${layout.paneNumber + 2}`,
          "Step change",
          donation.recurring,
        );
        break;
      case "DECREMENT_CURRENT_PANE":
        postCustomEvent(
          `Went back to step ${layout.paneNumber}`,
          "Step change",
          donation.recurring,
        );
        break;
      default:
    }

    return next(action);
  };

export function* watchAll() {
  yield all([
    takeLatest(fetchCauseAreasAction.started.type, fetchCauseAreas),
    takeLatest(fetchReferralsAction.started.type, fetchReferrals),
    takeLatest(registerDonationAction.started.type, registerDonation),
    takeLatest(submitReferralAction.started.type, submitReferral),
    takeLatest(registerBankPendingAction.started.type, registerBankPending),
    takeLatest(draftAgreementAction.started.type, draftVippsAgreement),
    takeLatest(draftAvtaleGiroAction.started.type, draftAvtaleGiro),
  ]);
}
