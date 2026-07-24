import { calculateOrganizationSharesWithinCauseArea } from "./donationCalculations";

describe("calculateOrganizationSharesWithinCauseArea", () => {
  const sumOfShares = (shares: { percentageShare: string }[]) =>
    shares.reduce((sum, share) => sum + parseFloat(share.percentageShare), 0);

  it("scales amounts to percentages of the cause area, not of the overall donation", () => {
    // These orgs make up only 10% of some larger overall donation total, but
    // within their own cause area they should be split 25/75
    const shares = calculateOrganizationSharesWithinCauseArea([
      { id: 1, amount: 25 },
      { id: 2, amount: 75 },
    ]);

    expect(shares.find((s) => s.id === 1)?.percentageShare).toBe("25.00000000");
    // Org 2 has the largest amount, so it absorbs the rounding remainder
    // (100 - sum of the others) rather than being independently rounded
    expect(shares.find((s) => s.id === 2)?.percentageShare).toBe("75");
  });

  it("always sums to exactly 100 even for repeating-decimal splits", () => {
    const cases = [
      [
        { id: 1, amount: 1 },
        { id: 2, amount: 2 },
      ],
      [
        { id: 1, amount: 1 },
        { id: 2, amount: 1 },
        { id: 3, amount: 1 },
      ],
      [
        { id: 1, amount: 7 },
        { id: 2, amount: 11 },
        { id: 3, amount: 13 },
        { id: 4, amount: 17 },
      ],
      [
        { id: 1, amount: 333.33 },
        { id: 2, amount: 333.33 },
        { id: 3, amount: 333.34 },
      ],
      Array.from({ length: 9 }, (_, i) => ({ id: i, amount: 100 })),
    ];

    for (const organizationAmounts of cases) {
      const shares = calculateOrganizationSharesWithinCauseArea(organizationAmounts);
      expect(sumOfShares(shares)).toBe(100);
    }
  });

  it("handles a single organization", () => {
    const shares = calculateOrganizationSharesWithinCauseArea([{ id: 1, amount: 42 }]);
    expect(shares).toEqual([{ id: 1, percentageShare: "100" }]);
  });

  it("returns an empty array when there are no positive amounts", () => {
    expect(calculateOrganizationSharesWithinCauseArea([])).toEqual([]);
    expect(
      calculateOrganizationSharesWithinCauseArea([
        { id: 1, amount: 0 },
        { id: 2, amount: 0 },
      ]),
    ).toEqual([]);
  });

  it("keeps every organization id present in the result", () => {
    const shares = calculateOrganizationSharesWithinCauseArea([
      { id: 12, amount: 10 },
      { id: 1, amount: 20 },
      { id: 10, amount: 10 },
    ]);

    expect(shares.map((s) => s.id).sort()).toEqual([1, 10, 12]);
  });
});
