import { useState } from "react";
import { PaymentMethod } from "../../../../shared/components/Widget/types/Enums";
import { API_URL } from "../../../../shared/components/Widget/config/api";
import { ANONYMOUS_DONOR } from "../../../../shared/components/Widget/config/anonymous-donor";
import { FormData } from "./useFundraiserForm";
import { FetchFundraiserResult } from "../../../../../studio/sanity.types";
import { paymentMethodMap } from "../../../../shared/components/Widget/components/panes/DonorPane/DonorPane";

interface UseRegisterDonationProps {
  fundraiserId: string;
  organizationInfo: {
    databaseIds: {
      causeAreaId: string;
      organizationId: string;
    };
  };
  paymentMethods: Array<{
    _id?: string;
    _type: string;
  }>;
  onSuccess: (kid: string) => void;
}

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
    const method = paymentMethodMap[paymentMethodId] || PaymentMethod.BANK;

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
            organizations: [
              {
                id: organizationInfo.databaseIds.organizationId,
                percentageShare: "100",
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
          messageSenderName: formData.message.length !== 0 ? formData.messageSenderName : null,
          showName: formData.message.length !== 0 ? formData.showName : false,
        },
        method: method,
        amount: formData.amount,
        recurring: 0,
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.error("Error:", data.content);
          setLoading(false);
          return;
        }
        const receivedKid = data.content.KID;
        setKid(receivedKid);
        if (data.content.paymentProviderUrl && data.content.paymentProviderUrl.length > 0) {
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
