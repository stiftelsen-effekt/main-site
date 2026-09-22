import { describe, expect, it } from "@jest/globals";
import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";
import { supportsDonationFrequency } from "./paymentMethodAvailability";

describe("fundraiser payment method availability", () => {
  it("supports one-time payments for existing fundraiser methods", () => {
    expect(supportsDonationFrequency("bank", RecurringDonation.NON_RECURRING)).toBe(true);
    expect(supportsDonationFrequency("vipps", RecurringDonation.NON_RECURRING)).toBe(true);
  });

  it("only offers directly supported monthly methods", () => {
    expect(supportsDonationFrequency("quickpay_card", RecurringDonation.RECURRING)).toBe(true);
    expect(supportsDonationFrequency("quickpay_mobilepay", RecurringDonation.RECURRING)).toBe(true);
    expect(supportsDonationFrequency("dkbank", RecurringDonation.RECURRING)).toBe(true);
    expect(supportsDonationFrequency("bank", RecurringDonation.RECURRING)).toBe(false);
    expect(supportsDonationFrequency("vipps", RecurringDonation.RECURRING)).toBe(false);
  });
});
