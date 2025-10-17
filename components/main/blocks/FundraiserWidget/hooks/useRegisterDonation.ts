import { useState } from "react";
import { PaymentMethod } from "../../../../shared/components/Widget/types/Enums";
import { API_URL } from "../../../../shared/components/Widget/config/api";
import { ANONYMOUS_DONOR } from "../../../../shared/components/Widget/config/anonymous-donor";
import { FormData } from "./useFundraiserForm";
import { FetchFundraiserResult } from "../../../../../studio/sanity.types";

interface UseRegisterDonationProps {
  fundraiserId: number;
  organizationInfo: {
    databaseIds: {
      causeAreaId: number;
      organizationId: number;
    };
  };
  onSuccess: (kid: string) => void;
}

export function useRegisterDonation({
  fundraiserId,
  organizationInfo,
  onSuccess,
}: UseRegisterDonationProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [kid, setKid] = useState<string | null>(null);

  const registerDonation = (formData: FormData) => {
    setLoading(true);

    const isAnonymous = !formData.newsletter && !formData.taxDeduction;

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
        donor: isAnonymous
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
        method: formData.paymentMethod === "bank" ? PaymentMethod.BANK : PaymentMethod.VIPPS,
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
