import { describe, expect, it } from "@jest/globals";
import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";
import { supportsDonationFrequency } from "./paymentMethodAvailability";

describe("fundraiser payment method availability", () => {
  it("supports one-time payments for existing fundraiser methods", () => {
    expect(supportsDonationFrequency("bank", RecurringDonation.NON_RECURRING, "no-NB")).toBe(true);
    expect(supportsDonationFrequency("vipps", RecurringDonation.NON_RECURRING, "no-NB")).toBe(true);
  });

  it("only offers directly supported monthly methods", () => {
    expect(supportsDonationFrequency("quickpay_card", RecurringDonation.RECURRING, "da-DK")).toBe(
      true,
    );
    expect(
      supportsDonationFrequency("quickpay_mobilepay", RecurringDonation.RECURRING, "da-DK"),
    ).toBe(true);
    expect(supportsDonationFrequency("dkbank", RecurringDonation.RECURRING, "da-DK")).toBe(true);
    expect(supportsDonationFrequency("bank", RecurringDonation.RECURRING, "da-DK")).toBe(false);
  });

  it("offers Vipps agreements and AvtaleGiro for monthly donations in Norway", () => {
    expect(supportsDonationFrequency("vipps", RecurringDonation.RECURRING, "no-NB")).toBe(true);
    expect(supportsDonationFrequency("bank", RecurringDonation.RECURRING, "no-NB")).toBe(true);
  });

  it("does not offer monthly bank transfers outside Norway", () => {
    expect(supportsDonationFrequency("bank", RecurringDonation.RECURRING, "sv-SE")).toBe(false);
  });
});
