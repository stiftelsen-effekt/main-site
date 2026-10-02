import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";
import { PaymentMethodString } from "./hooks/useFundraiserForm";

const oneTimeMethods: PaymentMethodString[] = [
  "bank",
  "vipps",
  "quickpay_card",
  "quickpay_mobilepay",
  "dkbank",
];

const monthlyMethods: PaymentMethodString[] = ["quickpay_card", "quickpay_mobilepay", "dkbank"];

export const supportsDonationFrequency = (
  method: string,
  recurring: RecurringDonation,
): method is PaymentMethodString =>
  (recurring === RecurringDonation.RECURRING ? monthlyMethods : oneTimeMethods).includes(
    method as PaymentMethodString,
  );
