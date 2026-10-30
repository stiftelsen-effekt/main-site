import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";
import { FormattingLocale } from "../../../../util/formatting";
import { PaymentMethodString } from "./hooks/useFundraiserForm";

const oneTimeMethods: PaymentMethodString[] = [
  "bank",
  "vipps",
  "quickpay_card",
  "quickpay_mobilepay",
  "dkbank",
];

const monthlyMethods: PaymentMethodString[] = [
  "vipps",
  "quickpay_card",
  "quickpay_mobilepay",
  "dkbank",
];

// Monthly bank donations are set up as AvtaleGiro, which only exists in Norway
const norwegianMonthlyMethods: PaymentMethodString[] = [...monthlyMethods, "bank"];

export const supportsDonationFrequency = (
  method: string,
  recurring: RecurringDonation,
  locale: FormattingLocale,
): method is PaymentMethodString => {
  if (recurring !== RecurringDonation.RECURRING) {
    return oneTimeMethods.includes(method as PaymentMethodString);
  }
  return (locale === "no-NB" ? norwegianMonthlyMethods : monthlyMethods).includes(
    method as PaymentMethodString,
  );
};
