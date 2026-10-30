import { useState } from "react";
import { PaymentMethod, RecurringDonation } from "../../../../shared/components/Widget/types/Enums";
import { API_URL } from "../../../../shared/components/Widget/config/api";
import {
  AVTALEGIRO_COMPANY_ACCOUNT_NO,
  AVTALEGIRO_COMPANY_NAME,
  AVTALEGIRO_FORM_URL,
  AVTALEGIRO_MIN_AMOUNT_LIMIT,
} from "../../../../shared/components/Widget/config/avtalegiro";
import { getFirstAvtaleGiroCharge } from "../avtaleGiroFirstCharge";
import { ANONYMOUS_DONOR } from "../../../../shared/components/Widget/config/anonymous-donor";
import { FormData } from "./useFundraiserForm";
import { paymentMethodMap } from "../../../../shared/components/Widget/components/panes/DonorPane/DonorPane";
import {
  getReferralCodeFromLocation,
  getStoredReferralCode,
} from "../../../../../util/referralCode";

interface UseRegisterDonationProps {
  fundraiserId: string;
  organizationInfo: {
    databaseIds: {
      causeAreaId: number;
      organizationId: number;
    };
  };
  paymentMethods: Array<{
    _id?: string;
    _type: string;
  }>;
  onSuccess: (kid: string) => void;
}

const postJson = (path: string, body: unknown) =>
  fetch(`${API_URL}${path}`, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    method: "POST",
  }).then((res) => res.json());

// The fundraiser widget has no charge day picker. Vipps charges the first donation straight
// away, so later charges are on today's day of the month, capped at the 28th so every month
// has the day
const todayAsChargeDay = () => Math.min(new Date().getDate(), 28);

const draftVippsAgreement = async (kid: string, amount: number) => {
  const data = await postJson("/vipps/agreement/draft", {
    KID: kid,
    amount,
    initialCharge: true,
    monthlyChargeDay: todayAsChargeDay(),
  });
  if (data.status !== 200) throw new Error(data.content);
  window.location.href = data.content.vippsConfirmationUrl;
};

const draftAvtaleGiro = async (kid: string, amount: number) => {
  const data = await postJson("/avtalegiro/draft", {
    KID: kid,
    amount,
    dueDay: getFirstAvtaleGiroCharge().dueDay,
  });
  if (data.status !== 200) throw new Error("Drafting AvtaleGiro failed");

  // Hand the donor over to Nets to sign the agreement in their bank
  const form = document.createElement("form");
  form.action = AVTALEGIRO_FORM_URL;
  form.method = "post";
  form.target = "_parent";
  const fields: Record<string, string> = {
    companyName: AVTALEGIRO_COMPANY_NAME,
    companyAccountNo: AVTALEGIRO_COMPANY_ACCOUNT_NO,
    kid,
    amountLimit: Math.max(amount, AVTALEGIRO_MIN_AMOUNT_LIMIT).toString(),
    returnUrl: `${API_URL}/avtalegiro/${kid}/redirect`,
    notificationDisabled: "false",
  };
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
};

export function useRegisterDonation({
  fundraiserId,
  organizationInfo,
  paymentMethods,
  onSuccess,
}: UseRegisterDonationProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [kid, setKid] = useState<string | null>(null);

  const registerDonation = (formData: FormData) => {
    setLoading(true);

    // Find the selected payment method from the configured payment methods
    const selectedPaymentMethod = paymentMethods.find(
      (method) => method._id === formData.paymentMethod || method._type === formData.paymentMethod,
    );

    // Use the payment method ID from Sanity configuration (_id preferred, fallback to _type, then formData.paymentMethod)
    const paymentMethodId =
      selectedPaymentMethod?._id || selectedPaymentMethod?._type || formData.paymentMethod;

    // Map the payment method ID to PaymentMethod enum using paymentMethodMap
    const selectedMethod = paymentMethodMap[paymentMethodId] || PaymentMethod.BANK;
    const isMonthly = formData.recurring === RecurringDonation.RECURRING;
    // Monthly bank donations in the Norwegian widget are set up as AvtaleGiro
    const method =
      isMonthly && selectedMethod === PaymentMethod.BANK
        ? PaymentMethod.AVTALEGIRO
        : selectedMethod;
    const referralCode = getReferralCodeFromLocation() ?? getStoredReferralCode();

    fetch(`${API_URL}/donations/register`, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        distributionCauseAreas: [
          {
            id: organizationInfo.databaseIds.causeAreaId,
            percentageShare: "100",
            standardSplit: false,
            amount: formData.amount,
            organizations: [
              {
                id: organizationInfo.databaseIds.organizationId,
                percentageShare: "100",
                amount: formData.amount,
              },
            ],
          },
        ],
        donor: !formData.email
          ? ANONYMOUS_DONOR
          : {
              name: formData.messageSenderName,
              email: formData.email,
              taxDeduction: formData.taxDeduction,
              ssn: formData.ssn,
              newsletter: formData.newsletter,
            },
        fundraiser: {
          id: fundraiserId,
          message: formData.message,
          messageSenderName: formData.messageSenderName ? formData.messageSenderName : null,
          showName: formData.messageSenderName ? formData.showName : false,
        },
        method: method,
        amount: formData.amount,
        recurring: formData.recurring,
        ...(referralCode ? { referralCode } : {}),
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status !== 200) {
          console.error("Error:", data.content);
          setLoading(false);
          return;
        }
        const receivedKid = data.content.KID;
        setKid(receivedKid);
        if (isMonthly && method === PaymentMethod.VIPPS) {
          await draftVippsAgreement(receivedKid, formData.amount!);
        } else if (method === PaymentMethod.AVTALEGIRO) {
          await draftAvtaleGiro(receivedKid, formData.amount!);
        } else if (data.content.paymentProviderUrl && data.content.paymentProviderUrl.length > 0) {
          window.open(data.content.paymentProviderUrl, "_self");
        } else {
          onSuccess(receivedKid);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return { registerDonation, loading, kid };
}
