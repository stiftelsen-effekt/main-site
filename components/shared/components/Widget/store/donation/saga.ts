import { SagaIterator } from "redux-saga";
import { call, put, select } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { ANONYMOUS_DONOR } from "../../config/anonymous-donor";
import { API_URL } from "../../config/api";
import { PaymentMethod, ShareType, RecurringDonation } from "../../types/Enums";
import { DraftAgreementResponse, IServerResponse } from "../../types/Temp";
import { nextPane, setAnsweredReferral, setLoading } from "../layout/actions";
import { Donation, RegisterDonationObject, State } from "../state";
import {
  registerBankPendingAction,
  registerDonationAction,
  RegisterDonationActionPayload,
  RegisterDonationResponse,
  setPaymentProviderURL,
  setApiError,
  clearApiError,
} from "./actions";
import { error } from "console";

export function* draftVippsAgreement(): SagaIterator<void> {
  try {
    yield put(setLoading(true));

    const KID: number = yield select((state: State) => state.donation.kid);
    const amount: number = yield select((state: State) => state.donation.sum);
    const initialCharge: boolean = yield select(
      (state: State) => state.donation.vippsAgreement?.initialCharge,
    );
    const monthlyChargeDay: Date = yield select(
      (state: State) => state.donation.vippsAgreement?.monthlyChargeDay,
    );
    const data = {
      KID,
      amount,
      initialCharge,
      monthlyChargeDay,
    };

    const draftRequest = yield call(fetch, `${API_URL}/vipps/agreement/draft`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const draftResponse: IServerResponse<DraftAgreementResponse> = yield call(
      draftRequest.json.bind(draftRequest),
    );

    if (draftResponse.status === 200) {
      window.location.href = (draftResponse.content as DraftAgreementResponse).vippsConfirmationUrl;

      yield put(
        setPaymentProviderURL(
          (draftResponse.content as DraftAgreementResponse).vippsConfirmationUrl,
        ),
      );
    }

    if (draftResponse.status !== 200) {
      yield put(setLoading(false));
      throw new Error(draftResponse.content as string);
    }
  } catch (ex) {
    console.error(ex);
  }
}

export function* draftAvtaleGiro(): SagaIterator<void> {
  try {
    yield put(setLoading(true));

    const KID: number = yield select((state: State) => state.donation.kid);
    const amount: number = yield select((state: State) => state.donation.sum);
    const dueDay: Date = yield select((state: State) => state.donation.dueDay);

    const data = {
      KID,
      amount,
      dueDay,
    };

    const draftRequest = yield call(fetch, `${API_URL}/avtalegiro/draft`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const draftResponse: IServerResponse<undefined> = yield call(
      draftRequest.json.bind(draftRequest),
    );

    if (draftResponse.status === 200) {
      const form = document.getElementById("avtalegiro-form") as HTMLFormElement;
      form.submit();
    }

    if (draftResponse.status !== 200) {
      yield put(setLoading(false));
      throw new Error("Drafting AvtaleGiro failed");
    }
  } catch (ex) {
    console.error(ex);
  }
}

export function* registerBankPending(): SagaIterator<void> {
  try {
    const KID: number = yield select((state: State) => state.donation.kid);
    const sum: number = yield select((state: State) => state.donation.sum);

    const request: Response = yield call(fetch, `${API_URL}/donations/bank/pending`, {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data={"KID":"${KID}", "sum":${sum}}`,
    });

    const result: IServerResponse<never> = yield call(request.json.bind(request));

    if (result.status !== 200) throw new Error(result.content as string);
  } catch (ex) {
    console.error(ex);
  }
}

export function* registerDonation(
  action: Action<RegisterDonationActionPayload>,
): SagaIterator<void> {
  yield put(setLoading(true));
  yield put(clearApiError()); // Clear any existing API errors
  try {
    const donation: Donation = yield select((state: State) => state.donation);

    const data: RegisterDonationObject = {
      distributionCauseAreas: donation.distributionCauseAreas
        .filter((c) => parseFloat(c.percentageShare) > 0)
        .map((c) => ({
          ...c,
          // Removes any potential prefilled data from the submitted data
          organizations: c.organizations.map((o) => ({
            id: o.id,
            percentageShare: o.percentageShare,
          })),
        })),
      donor: donation.donor,
      method: donation.method || PaymentMethod.BANK,
      amount: donation.sum || 0,
      recurring: donation.recurring,
    };

    const request = yield call(fetch, `${API_URL}/donations/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result: IServerResponse<RegisterDonationResponse> = yield call(
      request.json.bind(request),
    );

    if (result.status !== 200) {
      // Handle API error response
      let errorMessage = null;

      // Check if result.content is an object with message property
      if (typeof (result as any).message === "string") {
        errorMessage = (result as any).message;
      } else if (typeof result.content === "string") {
        errorMessage = result.content;
      }

      yield put(setApiError(errorMessage));
      yield put(setLoading(false));
      yield put(
        registerDonationAction.failed({
          params: action.payload,
          error: new Error(errorMessage),
        }),
      );
      return;
    }

    yield put(
      setAnsweredReferral(
        data.donor?.email === ANONYMOUS_DONOR.email
          ? false
          : (result.content as RegisterDonationResponse).hasAnsweredReferral,
      ),
    );

    yield put(
      setPaymentProviderURL((result.content as RegisterDonationResponse).paymentProviderUrl),
    );

    yield put(
      registerDonationAction.done({
        params: action.payload,
        result: result.content as RegisterDonationResponse,
      }),
    );

    if (
      donation.method === PaymentMethod.BANK &&
      donation.recurring === RecurringDonation.NON_RECURRING
    ) {
      yield put(registerBankPendingAction.started(undefined));
    }

    yield put(setLoading(false));

    if (
      action.payload?.openExternalPaymentOnRegisterSuccess &&
      (result.content as RegisterDonationResponse).paymentProviderUrl
    ) {
      window.open((result.content as RegisterDonationResponse).paymentProviderUrl, "_self");
    } else {
      yield put(nextPane());
    }
  } catch (ex) {
    // Handle network errors and other exceptions
    const errorMessage = ex instanceof Error ? ex.message : "Something went wrong";
    yield put(setApiError(errorMessage));
    yield put(setLoading(false));
    yield put(registerDonationAction.failed({ params: action.payload, error: ex as Error }));
  }
}
