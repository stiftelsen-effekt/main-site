import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import {
  AutoGiroPaymentMethod,
  BankPaymentMethod,
  SwishPaymentMethod,
  VippsPaymentMethod,
  WidgetPane3ReferralsProps,
  WidgetProps,
} from "../../../types/WidgetProps";
import { ResultPane } from "./Bank/ResultPane";
import { SwishPane } from "./Swish/SwishPane";
import { VippsPane } from "./Vipps/VippsPane";
import { AutogiroPane } from "./AutoGiro/AutogiroPane";

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
    case PaymentMethod.SWISH: {
      const swishConfiguration = paymentMethods.find(
        (method): method is SwishPaymentMethod => method._id === "swish",
      );
      if (!swishConfiguration) {
        throw new Error("Missing configuration for Swish, but selected payment method is swish");
      }
      return <SwishPane config={swishConfiguration} referrals={referrals} />;
    }
    case PaymentMethod.AUTOGIRO: {
      const autoGiroConfiguration = paymentMethods.find(
        (method): method is AutoGiroPaymentMethod => method._id === "autogiro",
      );
      if (!autoGiroConfiguration) {
        throw new Error(
          "Missing configuration for Autogiro, but selected payment method is autogiro",
        );
      }
      return <AutogiroPane config={autoGiroConfiguration} referrals={referrals} />;
    }
    default: {
      throw new Error(`Unknown payment method: ${method}`);
    }
  }
};
