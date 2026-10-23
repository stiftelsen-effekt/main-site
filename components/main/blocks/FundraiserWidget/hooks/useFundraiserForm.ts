import { useState, useCallback } from "react";
import { RecurringDonation } from "../../../../shared/components/Widget/types/Enums";

export interface FormData {
  amount: number | null;
  message: string;
  messageSenderName: string;
  showName: boolean;
  email: string;
  ssn: string;
  taxDeduction: boolean;
  newsletter: boolean;
  paymentMethod: PaymentMethodString;
  privacyPolicyAccepted: boolean;
  recurring: RecurringDonation;
}

export type PaymentMethodString =
  "bank" | "vipps" | "quickpay_card" | "quickpay_mobilepay" | "dkbank";

export function useFundraiserForm(
  paymentMethods: PaymentMethodString[],
  taxDeductionMinAmount?: number,
) {
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    message: "",
    messageSenderName: "",
    showName: false,
    email: "",
    ssn: "",
    taxDeduction: false,
    newsletter: false,
    paymentMethod: paymentMethods[0],
    privacyPolicyAccepted: false,
    recurring: RecurringDonation.NON_RECURRING,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        // Auto-enable tax deduction for amounts >= configured minimum (only if tax deduction is enabled)
        if (
          field === "amount" &&
          value !== prev.amount &&
          typeof taxDeductionMinAmount === "number"
        ) {
          next.taxDeduction = !!next.amount && next.amount >= taxDeductionMinAmount;
        }
        return next;
      });
    },
    [taxDeductionMinAmount],
  );

  return {
    formData,
    setFormData,
    handleInputChange,
    updateField,
  };
}
