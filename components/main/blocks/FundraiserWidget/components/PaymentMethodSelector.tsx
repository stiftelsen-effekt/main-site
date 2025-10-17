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
  selected: "bank" | "vipps";
  onSelect: (method: "bank" | "vipps") => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selected,
  onSelect,
}) => {
  const options = methods.map((method) => {
    const methodType = method._type;
    let paymentMethodValue = PaymentMethod.BANK;

    if (methodType === "vipps") paymentMethodValue = PaymentMethod.VIPPS;
    else if (methodType === "bank") paymentMethodValue = PaymentMethod.BANK;
    else if (methodType === "quickpay_card") paymentMethodValue = PaymentMethod.QUICKPAY_CARD;
    else if (methodType === "quickpay_mobilepay")
      paymentMethodValue = PaymentMethod.QUICKPACK_MOBILEPAY;

    return {
      title: method.selector_text || methodType,
      value: paymentMethodValue,
    };
  });

  const selectedValue = selected === "bank" ? PaymentMethod.BANK : PaymentMethod.VIPPS;

  return (
    <RadioButtonGroup
      options={options}
      selected={selectedValue}
      onSelect={(value) => {
        let methodKey: "bank" | "vipps" = "vipps";
        if (value === PaymentMethod.BANK) methodKey = "bank";
        onSelect(methodKey);
      }}
    />
  );
};
