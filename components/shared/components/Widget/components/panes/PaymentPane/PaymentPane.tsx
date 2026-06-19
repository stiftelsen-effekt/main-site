import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import {
  AutoGiroPaymentMethod,
  AvtaleGiroPaymentMethod,
  BankPaymentMethod,
  SwishPaymentMethod,
  VippsPaymentMethod,
  WidgetPane3ReferralsProps,
  WidgetProps,
} from "../../../types/WidgetProps";
import { SwishPane } from "./Swish/SwishPane";
import { VippsPane } from "./Vipps/VippsPane";
import { AutogiroPane } from "./AutoGiro/AutogiroPane";
import { AvtaleGiroPane } from "./AvtaleGiro/AvtaleGiroPane";
import { BankPane } from "./Bank/BankPane";
import { QuickPayPane } from "./QuickPay/QuickPay";
import { DKBankPane } from "./DKBank/DKBank";

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
      return <BankPane config={bankConfiguration} referrals={referrals} />;
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
    case PaymentMethod.AVTALEGIRO: {
      const avtaleGiroConfiguration = paymentMethods.find(
        (method): method is AvtaleGiroPaymentMethod => method._id === "avtalegiro",
      );
      if (!avtaleGiroConfiguration) {
        throw new Error(
          "Missing configuration for AvtaleGiro, but selected payment method is avtalegiro",
        );
      }
      return <AvtaleGiroPane config={avtaleGiroConfiguration} referrals={referrals} />;
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
    case PaymentMethod.QUICKPACK_MOBILEPAY: {
      const quickpayConfiguration = paymentMethods.find(
        (method) => method._id === "quickpay_mobilepay",
      );
      if (!quickpayConfiguration) {
        throw new Error(
          "Missing configuration for QuickPay, but selected payment method is quickpay",
        );
      }
      return <QuickPayPane config={quickpayConfiguration} referrals={referrals} />;
    }
    case PaymentMethod.QUICKPAY_CARD: {
      const quickpayConfiguration = paymentMethods.find((method) => method._id === "quickpay_card");
      if (!quickpayConfiguration) {
        throw new Error(
          "Missing configuration for QuickPay, but selected payment method is quickpay",
        );
      }
      return <QuickPayPane config={quickpayConfiguration} referrals={referrals} />;
    }
    case PaymentMethod.DKBANK: {
      const dkbankConfiguration = paymentMethods.find((method) => method._id === "dkbank");
      if (!dkbankConfiguration) {
        throw new Error("Missing configuration for DK Bank, but selected payment method is dkbank");
      }
      return <DKBankPane config={dkbankConfiguration} referrals={referrals} />;
    }
    default: {
      throw new Error(`Unknown payment method: ${method}`);
    }
  }
};
