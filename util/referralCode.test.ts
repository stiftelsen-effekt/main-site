import { describe, expect, it } from "@jest/globals";
import { firstQueryValue, getReferralCodeFromQuery } from "./referralCode";

describe("referral codes", () => {
  it("reads and trims the referral query parameter", () => {
    expect(getReferralCodeFromQuery({ referral: " Adfærd " })).toBe("Adfærd");
  });

  it("supports the referralCode alias and array query values", () => {
    expect(getReferralCodeFromQuery({ referralCode: ["campaign", "ignored"] })).toBe("campaign");
  });

  it("prefers referral and ignores blank values", () => {
    expect(getReferralCodeFromQuery({ referral: "first", referralCode: "second" })).toBe("first");
    expect(firstQueryValue("  ")).toBeUndefined();
  });
});
