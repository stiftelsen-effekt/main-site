import { formatGiftCardPrice } from "./formatGiftCardPrice";

const normalize = (s: string) => s.replace(/\s/g, " ");

describe("formatGiftCardPrice", () => {
  it("formats with the site's locale and currency", () => {
    expect(normalize(formatGiftCardPrice(1500, "no", "NOK"))).toBe("1 500 kr");
    expect(normalize(formatGiftCardPrice(1500, "sv", "SEK"))).toBe("1 500 kr");
    expect(normalize(formatGiftCardPrice(1500, "dk", "DKK"))).toBe("1.500 kr.");
  });

  it("falls back to kr when the currency is missing or invalid", () => {
    expect(normalize(formatGiftCardPrice(1500, "no", undefined))).toBe("1 500 kr");
    expect(normalize(formatGiftCardPrice(1500, "no", "not-a-code"))).toBe("1 500 kr");
  });
});
