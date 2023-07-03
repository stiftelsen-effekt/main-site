import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import {
  BankPaymentMethod,
  VippsPaymentMethod,
  WidgetPane3ReferralsProps,
  WidgetProps,
} from "../../../types/WidgetProps";
import { ResultPane } from "./Bank/ResultPane";
import { VippsPane } from "./Vipps/VippsPane";

export const PaymentPane: React.FC<{
  referrals: WidgetPane3ReferralsProps;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
}> = ({ referrals, paymentMethods }) => {
  const method = useSelector((state: State) => state.donation.method);

  switch (method) {
    case PaymentMethod.BANK: {
      const bankConfiguration = paymentMethods.find(
        (method): method is BankPaymentMethod => method._id === "bank",
      );
      if (!bankConfiguration) {
        throw new Error("Missing configuration for bank, but selected payment method is bank");
      }
      return <ResultPane config={bankConfiguration} referrals={referrals} />;
    }
    case PaymentMethod.VIPPS: {
      const vippsConfiguration = paymentMethods.find(
        (method): method is VippsPaymentMethod => method._id === "vipps",
      );
      if (!vippsConfiguration) {
        throw new Error("Missing configuration for Vipps, but selected payment method is vipps");
      }
      return <VippsPane config={vippsConfiguration} referrals={referrals} />;
    }
    default: {
      throw new Error(`Unknown payment method: ${method}`);
    }
  }
};
