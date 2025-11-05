import React from "react";
import { RadioButtonGroup } from "../../../../shared/components/RadioButton/RadioButtonGroup";
import { PaymentMethod } from "../../../../shared/components/Widget/types/Enums";

interface PaymentMethodSelectorProps {
  methods: Array<{
    _type: string;
    selector_text: string | null;
    single_button_text: string | null;
    recurring_button_text: string | null;
    button_text: string | null;
  }>;
  selected: "bank" | "vipps" | "quickpay_card" | "quickpay_mobilepay" | "dkbank";
  onSelect: (method: "bank" | "vipps" | "quickpay_card" | "quickpay_mobilepay" | "dkbank") => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selected,
  onSelect,
}) => {
  const options = methods.map((method) => {
    const methodType = method._type;
    let paymentMethodValue = PaymentMethod.BANK;
    let dataCy = `fundraiser-method-${methodType}`;

    if (methodType === "vipps") paymentMethodValue = PaymentMethod.VIPPS;
    else if (methodType === "bank") paymentMethodValue = PaymentMethod.BANK;
    else if (methodType === "quickpay_card") paymentMethodValue = PaymentMethod.QUICKPAY_CARD;
    else if (methodType === "quickpay_mobilepay")
      paymentMethodValue = PaymentMethod.QUICKPACK_MOBILEPAY;
    else if (methodType === "dkbank") paymentMethodValue = PaymentMethod.DKBANK;

    return {
      title: method.selector_text || methodType,
      value: paymentMethodValue,
      data_cy: dataCy,
    };
  });

  const getSelectedValue = (selected: string): PaymentMethod => {
    if (selected === "bank") return PaymentMethod.BANK;
    if (selected === "vipps") return PaymentMethod.VIPPS;
    if (selected === "quickpay_card") return PaymentMethod.QUICKPAY_CARD;
    if (selected === "quickpay_mobilepay") return PaymentMethod.QUICKPACK_MOBILEPAY;
    if (selected === "dkbank") return PaymentMethod.DKBANK;
    return PaymentMethod.VIPPS; // default
  };

  const getMethodKey = (
    value: PaymentMethod,
  ): "bank" | "vipps" | "quickpay_card" | "quickpay_mobilepay" | "dkbank" => {
    if (value === PaymentMethod.BANK) return "bank";
    if (value === PaymentMethod.VIPPS) return "vipps";
    if (value === PaymentMethod.QUICKPAY_CARD) return "quickpay_card";
    if (value === PaymentMethod.QUICKPACK_MOBILEPAY) return "quickpay_mobilepay";
    if (value === PaymentMethod.DKBANK) return "dkbank";
    return "vipps"; // default
  };

  const selectedValue = getSelectedValue(selected);

  return (
    <RadioButtonGroup
      options={options}
      selected={selectedValue}
      onSelect={(value) => {
        onSelect(getMethodKey(value));
      }}
    />
  );
};
