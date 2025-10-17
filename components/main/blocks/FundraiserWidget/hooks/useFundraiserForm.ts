import { useState, useEffect } from "react";

export interface FormData {
  amount: number | null;
  message: string;
  messageSenderName: string;
  showName: boolean;
  email: string;
  ssn: string;
  taxDeduction: boolean;
  newsletter: boolean;
  paymentMethod: "bank" | "vipps";
  privacyPolicyAccepted: boolean;
}

export function useFundraiserForm(taxDeductionMinAmount?: number) {
  const [formData, setFormData] = useState<FormData>({
    amount: null,
    message: "",
    messageSenderName: "",
    showName: false,
    email: "",
    ssn: "",
    taxDeduction: false,
    newsletter: false,
    paymentMethod: "vipps",
    privacyPolicyAccepted: false,
  });

  // Auto-enable tax deduction for amounts >= configured minimum (only if tax deduction is enabled)
  useEffect(() => {
    if (taxDeductionMinAmount !== undefined) {
      if (formData.amount && formData.amount >= taxDeductionMinAmount) {
        setFormData((prev) => ({ ...prev, taxDeduction: true }));
      } else {
        setFormData((prev) => ({ ...prev, taxDeduction: false }));
      }
    }
  }, [formData.amount, taxDeductionMinAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    updateField,
  };
}
