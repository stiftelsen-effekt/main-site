import { RecurringDonation } from "../types/Enums";

interface PaymentMethodConfiguration {
  id: "bank" | "vipps" | "swish" | "autogiro";
  recurringOptions: RecurringDonation[];
}

export const bankConfiguration: PaymentMethodConfiguration = {
  id: "bank",
  recurringOptions: [RecurringDonation.RECURRING, RecurringDonation.NON_RECURRING],
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

export const paymentMethodConfigurations = [
  bankConfiguration,
  vippsConfiguration,
  swishConfiguration,
  autogiroConfiguration,
];
