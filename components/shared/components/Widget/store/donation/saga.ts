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
  RegisterDonationResponse,
  setPaymentProviderURL,
} from "./actions";

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

export function* registerDonation(action: Action<undefined>): SagaIterator<void> {
  yield put(setLoading(true));
  try {
    const donation: Donation = yield select((state: State) => state.donation);

    const data: RegisterDonationObject = {
      donor: donation.donor,
      method: donation.method || PaymentMethod.BANK,
      amount: donation.sum || 0,
      recurring: donation.recurring,
      phone: donation.phone,
    };

    if (donation.shareType === ShareType.CUSTOM) {
      data.organizations = donation.shares;
    }

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
    if (result.status !== 200) throw new Error(result.content as string);

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
    yield put(nextPane());
  } catch (ex) {
    yield put(registerDonationAction.failed({ params: action.payload, error: ex as Error }));
  }
}
