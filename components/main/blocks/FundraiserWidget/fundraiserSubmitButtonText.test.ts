import { expect, it } from "@jest/globals";
import { fundraiserSubmitButtonText } from "./fundraiserSubmitButtonText";
import { PaymentMethodString } from "./hooks/useFundraiserForm";
import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";

it.each<[PaymentMethodString, string]>([
  ["bank", "Gi med bank"],
  ["vipps", "Gi med Vipps"],
  ["quickpay_card", "Giv med kort"],
  ["quickpay_mobilepay", "Giv med MobilePay"],
  ["dkbank", "Giv med bank"],
])("uses a donation action for %s rather than its payment-step label", (method, text) => {
  expect(fundraiserSubmitButtonText(method)).toBe(text);
});

it("names AvtaleGiro for monthly bank donations", () => {
  expect(fundraiserSubmitButtonText("bank", RecurringDonation.RECURRING)).toBe("Gi med AvtaleGiro");
  expect(fundraiserSubmitButtonText("vipps", RecurringDonation.RECURRING)).toBe("Gi med Vipps");
});
