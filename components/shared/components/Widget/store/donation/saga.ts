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
import { CauseArea } from "../../types/CauseArea";
import { calculateDonationBreakdown } from "../../utils/donationCalculations";

export function* draftVippsAgreement(): SagaIterator<void> {
  try {
    yield put(setLoading(true));

    const donation = yield select((state: State) => state.donation);
    const causeAreas = yield select((state: State) => state.layout.causeAreas) || [];

    const breakdown = calculateDonationBreakdown(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      donation.causeAreaDistributionType,
      donation.operationsAmountsByCauseArea,
      causeAreas,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId,
      donation.globalOperationsEnabled,
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
      donation.operationsAmountsByCauseArea,
      causeAreas,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId,
      donation.globalOperationsEnabled,
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
      donation.operationsAmountsByCauseArea,
      causeAreas,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId,
      donation.globalOperationsEnabled,
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

const TIP_PERCENTAGE = 5;
const OPERATIONS_CAUSE_AREA_ID = 4;

export function* registerDonation(action: Action<undefined>): SagaIterator<void> {
  yield put(setLoading(true));
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
      operationsAmountsByCauseArea = {},
      globalOperationsEnabled = false,
    } = donation;

    // Use the centralized calculation function to get the breakdown
    const breakdown = calculateDonationBreakdown(
      causeAreaAmounts,
      orgAmounts,
      causeAreaDistributionType,
      operationsAmountsByCauseArea,
      allCauseAreas,
      selectionType || "multiple",
      selectedCauseAreaId,
      globalOperationsEnabled,
      smartDistributionTotal,
    );

    let distributionPayload: {
      id: number;
      standardSplit: boolean;
      name: string;
      percentageShare: string;
      organizations: { id: number; percentageShare: string }[];
    }[] = [];

    // Build the distribution payload from the breakdown
    allCauseAreas.forEach((area) => {
      let areaOrgPayloads: { id: number; percentageShare: string }[] = [];
      let areaTotalPercentage = 0;
      let hasOrganizationsWithAmounts = false;

      area.organizations.forEach((org) => {
        const orgAmount = breakdown.organizationAmounts[org.id] || 0;

        if (orgAmount > 0 && breakdown.totalAmount > 0) {
          // Calculate percentage based on the TOTAL amount
          const orgPercentage = (orgAmount / breakdown.totalAmount) * 100;
          areaOrgPayloads.push({
            id: org.id,
            percentageShare: orgPercentage.toFixed(8),
          });
          areaTotalPercentage += orgPercentage;
          hasOrganizationsWithAmounts = true;
        }
      });

      // Only add areas that have organizations with amounts
      if (hasOrganizationsWithAmounts) {
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
          percentageShare: areaTotalPercentage.toFixed(8),
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

        // Calculate organization percentages for operations cause area
        const operationsOrgPayloads: { id: number; percentageShare: string }[] = [];
        operationsCauseArea.organizations.forEach((org) => {
          if (org.standardShare && org.standardShare > 0) {
            const orgAmount = (org.standardShare / 100) * breakdown.operationsAmount;
            const orgPercentage = (orgAmount / breakdown.totalAmount) * 100;
            operationsOrgPayloads.push({
              id: org.id,
              percentageShare: orgPercentage.toFixed(8),
            });
          }
        });

        distributionPayload.push({
          id: OPERATIONS_CAUSE_AREA_ID,
          name: operationsCauseArea.name,
          standardSplit: true,
          percentageShare: operationsPercentage.toFixed(8),
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
    yield put(nextPane());
  } catch (ex) {
    console.error("Error registering donation:", ex);
    yield put(setLoading(false));
    yield put(registerDonationAction.failed({ params: action.payload, error: ex as Error }));
  }
}
