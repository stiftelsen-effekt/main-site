import { RecurringDonation } from "../types/Enums";

interface PaymentMethodConfiguration {
  id:
    | "bank"
    | "vipps"
    | "swish"
    | "autogiro"
    | "avtalegiro"
    | "quickpay_card"
    | "quickpay_mobilepay";
  recurringOptions: RecurringDonation[];
}

export const bankConfiguration: PaymentMethodConfiguration = {
  id: "bank",
  recurringOptions: [RecurringDonation.NON_RECURRING],
};

export const vippsConfiguration: PaymentMethodConfiguration = {
  id: "vipps",
  recurringOptions: [RecurringDonation.RECURRING, RecurringDonation.NON_RECURRING],
};

export const swishConfiguration: PaymentMethodConfiguration = {
  id: "swish",
  recurringOptions: [RecurringDonation.NON_RECURRING],
};

export const autogiroConfiguration: PaymentMethodConfiguration = {
  id: "autogiro",
  recurringOptions: [RecurringDonation.RECURRING],
};

export const avtalegiroConfiguration: PaymentMethodConfiguration = {
  id: "avtalegiro",
  recurringOptions: [RecurringDonation.RECURRING],
};

export const quickpayCardConfiguration: PaymentMethodConfiguration = {
  id: "quickpay_card",
  recurringOptions: [RecurringDonation.RECURRING, RecurringDonation.NON_RECURRING],
};

export const quickpayMobilePayConfiguration: PaymentMethodConfiguration = {
  id: "quickpay_mobilepay",
  recurringOptions: [RecurringDonation.RECURRING, RecurringDonation.NON_RECURRING],
};

export const paymentMethodConfigurations = [
  bankConfiguration,
  vippsConfiguration,
  swishConfiguration,
  autogiroConfiguration,
  avtalegiroConfiguration,
  quickpayCardConfiguration,
  quickpayMobilePayConfiguration,
];
