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

export function* draftVippsAgreement(): SagaIterator<void> {
  try {
    yield put(setLoading(true));

    const donation = yield select((state: State) => state.donation);
    const causeAreas = yield select((state: State) => state.layout.causeAreas) || [];

    const { totalSumIncludingTip } = calculateDonationSum(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      causeAreas,
      donation.causeAreaDistributionType,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId || 0,
      donation.operationsAmountsByCauseArea,
    );

    const initialCharge: boolean = yield select(
      (state: State) => state.donation.vippsAgreement?.initialCharge,
    );
    const monthlyChargeDay: Date = yield select(
      (state: State) => state.donation.vippsAgreement?.monthlyChargeDay,
    );
    const data = {
      KID: donation.kid,
      sum: totalSumIncludingTip,
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

    const { totalSumIncludingTip } = calculateDonationSum(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      causeAreas,
      donation.causeAreaDistributionType,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId || 0,
      donation.operationsAmountsByCauseArea,
    );

    const data = {
      KID: donation.kid,
      sum: totalSumIncludingTip,
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

    const { totalSumIncludingTip } = calculateDonationSum(
      donation.causeAreaAmounts,
      donation.orgAmounts,
      causeAreas,
      donation.causeAreaDistributionType,
      donation.selectionType || "multiple",
      donation.selectedCauseAreaId || 0,
      donation.operationsAmountsByCauseArea,
    );

    const request: Response = yield call(fetch, `${API_URL}/donations/bank/pending`, {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data={"KID":"${donation.kid}", "sum":${totalSumIncludingTip}}`,
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
    } = donation;

    // --- Calculate initial sum based on user selections (pre-tip) ---
    // For smart distribution, ignore any existing operations amounts from previous selections
    const operationsAmounts =
      selectedCauseAreaId === -1 ? {} : donation.operationsAmountsByCauseArea;

    const { sum, tipAmount, totalSumIncludingTip, finalOrgAmounts } = calculateDonationSum(
      causeAreaAmounts,
      orgAmounts,
      allCauseAreas,
      causeAreaDistributionType,
      selectionType || "multiple",
      selectedCauseAreaId || 0,
      operationsAmounts,
      smartDistributionTotal,
    );

    let distributionPayload: {
      id: number;
      standardSplit: boolean;
      name: string;
      percentageShare: string;
      organizations: { id: number; percentageShare: string }[];
    }[] = [];

    // Use a Set to track which cause areas actually have donations after tip allocation
    const relevantCauseAreaIds = new Set<number>();
    Object.keys(finalOrgAmounts).forEach((orgIdStr) => {
      const orgId = parseInt(orgIdStr, 10);
      const orgAmount = finalOrgAmounts[orgId];
      if (orgAmount > 0) {
        const parentArea = allCauseAreas.find((ca) => ca.organizations.some((o) => o.id === orgId));
        if (parentArea) {
          relevantCauseAreaIds.add(parentArea.id);
        }
      }
    });

    // Iterate through all potential cause areas to build the payload
    allCauseAreas.forEach((area) => {
      // Only include areas that have a final amount allocated (original donation or tip)
      if (!relevantCauseAreaIds.has(area.id)) {
        return;
      }

      let areaOrgPayloads: { id: number; percentageShare: string }[] = [];
      let areaTotalPercentage = 0;

      area.organizations.forEach((org) => {
        const finalOrgAmount = finalOrgAmounts[org.id] || 0;

        if (finalOrgAmount > 0 && totalSumIncludingTip > 0) {
          // Calculate percentage based on the TOTAL sum including the tip
          const orgPercentage = (finalOrgAmount / totalSumIncludingTip) * 100;
          areaOrgPayloads.push({
            id: org.id,
            percentageShare: orgPercentage.toFixed(8), // Format percentage
          });
          areaTotalPercentage += orgPercentage;
        }
        // Handle case where total sum is 0 (shouldn't happen if tip > 0 or sum > 0)
        else if (finalOrgAmount > 0 && totalSumIncludingTip === 0) {
          areaOrgPayloads.push({ id: org.id, percentageShare: "0.00" });
        }
      });

      // Only add if there are organizations with amounts in this area
      if (areaOrgPayloads.length > 0) {
        // Determine the standardSplit flag
        let isStandardSplit = causeAreaDistributionType[area.id] === ShareType.STANDARD;

        // For smart distribution, all areas use standard split
        if (selectedCauseAreaId === -1) {
          isStandardSplit = true;
        }
        // For operations area, it should be true if tip was added
        else if (area.id === OPERATIONS_CAUSE_AREA_ID && tipAmount > 0) {
          isStandardSplit = true; // Ensure operations area is marked as standard if tip was added
        }

        distributionPayload.push({
          id: area.id,
          name: area.name,
          standardSplit: isStandardSplit,
          // Total percentage for this cause area relative to the total sum including tip
          percentageShare: areaTotalPercentage.toFixed(8),
          organizations: areaOrgPayloads,
        });
      }
    });

    // --- Prepare final data object for API ---
    const data: RegisterDonationObject & {
      distributionCauseAreas: any;
    } = {
      distributionCauseAreas: distributionPayload,
      donor: donor,
      method: method || PaymentMethod.BANK,
      amount: totalSumIncludingTip, // Send the total amount *including* the allocated tip
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

export const calculateDonationSum = (
  causeAreaAmounts: { [key: number]: number },
  orgAmounts: { [key: number]: number },
  allCauseAreas: CauseArea[],
  causeAreaDistributionType: { [key: number]: ShareType },
  selectionType: "single" | "multiple",
  selectedCauseAreaId: number,
  operationsAmountsByCauseArea?: { [key: number]: number },
  smartDistributionTotal?: number,
) => {
  // Handle smart distribution mode (selectedCauseAreaId === -1)
  if (selectedCauseAreaId === -1 && smartDistributionTotal) {
    // For smart distribution, calculate amounts based on standardPercentageShare
    const adjustedCauseAreaAmounts: { [key: number]: number } = {};
    const finalOrgAmounts: { [orgId: number]: number } = {};

    allCauseAreas.forEach((area) => {
      if (area.standardPercentageShare && area.standardPercentageShare > 0) {
        const areaAmount = Math.round(
          (area.standardPercentageShare / 100) * smartDistributionTotal,
        );
        adjustedCauseAreaAmounts[area.id] = areaAmount;

        // Distribute area amount among organizations based on their standard shares
        area.organizations.forEach((org) => {
          if (org.standardShare && org.standardShare > 0) {
            finalOrgAmounts[org.id] = Math.round((org.standardShare / 100) * areaAmount);
          }
        });
      }
    });

    // No tip for smart distribution
    return {
      sum: smartDistributionTotal,
      tipAmount: 0,
      totalSumIncludingTip: smartDistributionTotal,
      finalOrgAmounts,
    };
  }

  // Sum all per-cause-area operations amounts into the global operations cause area (ID 4)
  const totalOperationsAmount = operationsAmountsByCauseArea
    ? Object.values(operationsAmountsByCauseArea).reduce((sum, amount) => sum + (amount || 0), 0)
    : 0;

  // Merge operations amounts into causeAreaAmounts for calculation
  const adjustedCauseAreaAmounts: { [key: number]: number } = {
    ...causeAreaAmounts,
  };

  if (totalOperationsAmount > 0) {
    adjustedCauseAreaAmounts[4] = totalOperationsAmount;
  }

  let sum = 0;
  const finalOrgAmounts: { [orgId: number]: number } = {};

  allCauseAreas.forEach((area) => {
    // Skip if single selection and not the selected area, unless it's operations area with amounts
    if (
      selectionType === "single" &&
      area.id !== selectedCauseAreaId &&
      !(area.id === 4 && totalOperationsAmount > 0)
    ) {
      return;
    }

    const distributionType = causeAreaDistributionType[area.id];
    const currentAreaAmount = adjustedCauseAreaAmounts[area.id] || 0;

    if (distributionType === ShareType.STANDARD && currentAreaAmount > 0) {
      sum += currentAreaAmount;
      // Distribute standard split amount among orgs
      area.organizations.forEach((org) => {
        const orgShare = org.standardShare;
        if (orgShare && !isNaN(orgShare) && orgShare > 0) {
          const orgAmount = currentAreaAmount * (orgShare / 100);
          finalOrgAmounts[org.id] = (finalOrgAmounts[org.id] || 0) + orgAmount;
        }
      });
    } else if (distributionType === ShareType.CUSTOM) {
      let totalOrgAmountInArea = 0;
      area.organizations.forEach((org) => {
        const orgAmount = orgAmounts[org.id] || 0;
        if (orgAmount > 0) {
          finalOrgAmounts[org.id] = (finalOrgAmounts[org.id] || 0) + orgAmount;
          totalOrgAmountInArea += orgAmount;
        }
      });
      if (totalOrgAmountInArea > 0) {
        sum += totalOrgAmountInArea;
      }
    }
  });

  // --- Calculate final total sum and build payload ---
  const totalSumIncludingTip = sum; // No legacy tip calculation - tips are handled via operationsAmountsByCauseArea
  return {
    sum,
    tipAmount: 0, // No legacy tip calculation - tips are handled via operationsAmountsByCauseArea
    totalSumIncludingTip,
    finalOrgAmounts,
  };
};
