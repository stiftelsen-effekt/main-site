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
import { CauseArea } from "../../types/CauseArea";
import {
  calculateDonationBreakdown,
  calculateOrganizationSharesWithinCauseArea,
} from "../../utils/donationCalculations";

export function* draftVippsAgreement(): SagaIterator<void> {
  try {
    yield put(setLoading(true));

    const donation = yield select((state: State) => state.donation);
    const causeAreas = yield select((state: State) => state.layout.causeAreas) || [];

    const breakdown = calculateDonationBreakdown(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      donation.causeAreaDistributionType,
      donation.operationsPercentageModeByCauseArea || {},
      donation.operationsPercentageByCauseArea || {},
      causeAreas,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId,
      donation.globalOperationsEnabled,
      donation.globalOperationsPercentage || 0,
      donation.operationsConfig.excludedCauseAreaIds,
      donation.operationsConfig.operationsCauseAreaId ?? 4,
      donation.smartDistributionTotal,
    );

    const initialCharge: boolean = yield select(
      (state: State) => state.donation.vippsAgreement?.initialCharge,
    );
    const monthlyChargeDay: Date = yield select(
      (state: State) => state.donation.vippsAgreement?.monthlyChargeDay,
    );
    const data = {
      KID: donation.kid,
      sum: breakdown.totalAmount,
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
    const dueDay: Date = yield select((state: State) => state.donation.dueDay);

    const donation = yield select((state: State) => state.donation);
    const causeAreas = yield select((state: State) => state.layout.causeAreas) || [];

    const breakdown = calculateDonationBreakdown(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      donation.causeAreaDistributionType,
      donation.operationsPercentageModeByCauseArea || {},
      donation.operationsPercentageByCauseArea || {},
      causeAreas,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId,
      donation.globalOperationsEnabled,
      donation.globalOperationsPercentage || 0,
      donation.operationsConfig.excludedCauseAreaIds,
      donation.operationsConfig.operationsCauseAreaId ?? 4,
      donation.smartDistributionTotal,
    );

    const data = {
      KID: donation.kid,
      sum: breakdown.totalAmount,
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
    const donation = yield select((state: State) => state.donation);
    const causeAreas = yield select((state: State) => state.layout.causeAreas) || [];

    const breakdown = calculateDonationBreakdown(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      donation.causeAreaDistributionType,
      donation.operationsPercentageModeByCauseArea || {},
      donation.operationsPercentageByCauseArea || {},
      causeAreas,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId,
      donation.globalOperationsEnabled,
      donation.globalOperationsPercentage || 0,
      donation.operationsConfig.excludedCauseAreaIds,
      donation.operationsConfig.operationsCauseAreaId ?? 4,
      donation.smartDistributionTotal,
    );

    const request: Response = yield call(fetch, `${API_URL}/donations/bank/pending`, {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data={"KID":"${donation.kid}", "sum":${breakdown.totalAmount}}`,
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
    // --- Select necessary state parts ---
    const donation: Donation = yield select((state: State) => state.donation);
    const allCauseAreas: CauseArea[] = yield select((state: State) => state.layout.causeAreas) ||
      [];

    const {
      selectionType,
      causeAreaAmounts = {},
      orgAmounts = {},
      causeAreaDistributionType = {},
      selectedCauseAreaId,
      recurring,
      donor,
      method,
      smartDistributionTotal,
      operationsPercentageModeByCauseArea = {},
      operationsPercentageByCauseArea = {},
      globalOperationsEnabled = false,
      globalOperationsPercentage = 0,
      operationsConfig,
    } = donation;

    const OPERATIONS_CAUSE_AREA_ID = operationsConfig?.operationsCauseAreaId ?? 4;

    // Use the centralized calculation function to get the breakdown
    const breakdown = calculateDonationBreakdown(
      causeAreaAmounts,
      orgAmounts,
      causeAreaDistributionType,
      operationsPercentageModeByCauseArea,
      operationsPercentageByCauseArea,
      allCauseAreas,
      selectionType || "multiple",
      selectedCauseAreaId,
      globalOperationsEnabled,
      globalOperationsPercentage,
      operationsConfig?.excludedCauseAreaIds ?? [],
      OPERATIONS_CAUSE_AREA_ID,
      smartDistributionTotal,
    );

    let distributionPayload: {
      id: number;
      standardSplit: boolean;
      name: string;
      percentageShare: string;
      amount: number;
      organizations: { id: number; percentageShare: string; amount: number }[];
    }[] = [];

    // Build the distribution payload from the breakdown
    allCauseAreas.forEach((area) => {
      const orgAmountsForArea = area.organizations
        .map((org) => ({ id: org.id, amount: breakdown.organizationAmounts[org.id] || 0 }))
        .filter((org) => org.amount > 0);

      // Only add areas that have organizations with amounts
      if (orgAmountsForArea.length > 0 && breakdown.totalAmount > 0) {
        const areaAmount = orgAmountsForArea.reduce((sum, org) => sum + org.amount, 0);
        // Cause area's percentage is of the overall donation, but each
        // organization's percentage share must be of this cause area
        const areaPercentage = (areaAmount / breakdown.totalAmount) * 100;
        const areaOrgPayloads = calculateOrganizationSharesWithinCauseArea(orgAmountsForArea);

        // Determine the standardSplit flag
        let isStandardSplit = causeAreaDistributionType[area.id] === ShareType.STANDARD;

        // For smart distribution, all areas use standard split
        if (selectedCauseAreaId === -1) {
          isStandardSplit = true;
        }
        // For operations area, it should be true if operations amount is present
        else if (area.id === OPERATIONS_CAUSE_AREA_ID && breakdown.operationsAmount > 0) {
          isStandardSplit = true;
        }

        distributionPayload.push({
          id: area.id,
          name: area.name,
          standardSplit: isStandardSplit,
          percentageShare: areaPercentage.toFixed(8),
          amount: Math.round(areaAmount),
          organizations: areaOrgPayloads,
        });
      }
    });

    // Add operations cause area if there's an operations amount
    if (breakdown.operationsAmount > 0) {
      const operationsCauseArea = allCauseAreas.find((ca) => ca.id === OPERATIONS_CAUSE_AREA_ID);
      if (
        operationsCauseArea &&
        !distributionPayload.some((p) => p.id === OPERATIONS_CAUSE_AREA_ID)
      ) {
        const operationsPercentage = (breakdown.operationsAmount / breakdown.totalAmount) * 100;

        // Calculate organization amounts for the operations cause area, then
        // scale them to percentages of this cause area (not of the total)
        const operationsOrgAmounts = operationsCauseArea.organizations
          .filter((org) => org.standardShare && org.standardShare > 0)
          .map((org) => ({
            id: org.id,
            amount: (org.standardShare! / 100) * breakdown.operationsAmount,
          }));
        const operationsOrgPayloads =
          calculateOrganizationSharesWithinCauseArea(operationsOrgAmounts);

        distributionPayload.push({
          id: OPERATIONS_CAUSE_AREA_ID,
          name: operationsCauseArea.name,
          standardSplit: true,
          percentageShare: operationsPercentage.toFixed(8),
          amount: Math.round(breakdown.operationsAmount),
          organizations: operationsOrgPayloads,
        });
      }
    }

    // --- Prepare final data object for API ---
    const data: RegisterDonationObject & {
      distributionCauseAreas: any;
    } = {
      distributionCauseAreas: distributionPayload,
      donor: donor,
      method: method || PaymentMethod.BANK,
      amount: breakdown.totalAmount,
      recurring: recurring,
    };

    // --- Make API call ---
    // A signal timeout ensures a slow/hanging connection fails (and resets
    // the payment button's loading state) instead of leaving the donor
    // staring at a spinner indefinitely
    const request = yield call(fetch, `${API_URL}/donations/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(20000),
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

    // --- Handle API response and subsequent actions ---
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

    if (method === PaymentMethod.BANK && recurring === RecurringDonation.NON_RECURRING) {
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
    console.error("Error registering donation:", ex);
    // Handle network errors and other exceptions. A signal timeout throws a
    // DOMException whose message isn't donor-friendly, so fall back to the
    // notification's own generic message for that case.
    const isTimeout = ex instanceof DOMException && ex.name === "TimeoutError";
    const errorMessage = isTimeout
      ? null
      : ex instanceof Error
      ? ex.message
      : "Something went wrong";
    yield put(setApiError(errorMessage));
    yield put(setLoading(false));
    yield put(registerDonationAction.failed({ params: action.payload, error: ex as Error }));
  }
}
