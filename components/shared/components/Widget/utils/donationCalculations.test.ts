import {
  calculateDonationBreakdown,
  calculateOrganizationSharesWithinCauseArea,
  distributeSharesWithRemainder,
} from "./donationCalculations";

describe("calculateDonationBreakdown", () => {
  const causeAreas = [
    {
      id: 1,
      name: "Area 1",
      standardPercentageShare: 60,
      organizations: [{ id: 11, standardShare: 100 }],
    },
    {
      id: 2,
      name: "Area 2",
      standardPercentageShare: 40,
      organizations: [{ id: 22, standardShare: 100 }],
    },
    {
      id: 4,
      name: "Operations",
      standardPercentageShare: 0,
      organizations: [{ id: 44, standardShare: 100 }],
    },
  ] as any;

  it("applies an operations percentage to smart distribution", () => {
    const breakdown = calculateDonationBreakdown(
      {},
      {},
      {},
      {},
      {},
      causeAreas,
      "multiple",
      -1,
      true,
      5,
      [],
      4,
      1000,
    );

    expect(breakdown.totalAmount).toBe(1000);
    expect(breakdown.operationsAmount).toBe(50);
    expect(breakdown.causeAreaAmounts).toEqual({ 1: 570, 2: 380 });
  });

  it("combines smart distribution, specific areas, and operations", () => {
    const breakdown = calculateDonationBreakdown(
      { 1: 500 },
      {},
      { 1: 1, 2: 1, 4: 1 } as any,
      {},
      {},
      causeAreas,
      "multiple",
      undefined,
      true,
      5,
      [],
      4,
      500,
    );

    expect(breakdown.totalAmount).toBe(1000);
    expect(breakdown.operationsAmount).toBe(50);
    expect(breakdown.causeAreaAmounts[1]).toBe(760);
    expect(breakdown.causeAreaAmounts[2]).toBe(190);
  });
});

describe("distributeSharesWithRemainder", () => {
  const sumOfShares = (shares: { percentageShare: string }[]) =>
    shares.reduce((sum, share) => sum + parseFloat(share.percentageShare), 0);

  // Rounding each share independently to 8 decimals (as the widget used to do
  // for cause areas, before they went through this same remainder-absorbing
  // helper organization shares already used) can drift below or above 100 -
  // which is exactly what caused a production incident: the backend rejected
  // a donation with "Cause area share must sum to 100, but was 100.00000001".
  const naiveIndependentRounding = (amounts: { amount: number }[]) => {
    const total = amounts.reduce((sum, item) => sum + item.amount, 0);
    return amounts.map((item) => ((item.amount / total) * 100).toFixed(8));
  };

  it("sums to exactly 100 for splits where naive independent rounding drifts below 100", () => {
    const causeAreas = [
      { id: 1, amount: 1 },
      { id: 2, amount: 1 },
      { id: 3, amount: 1 },
    ];

    const naiveSum = naiveIndependentRounding(causeAreas).reduce(
      (sum, share) => sum + parseFloat(share),
      0,
    );
    expect(naiveSum).not.toBe(100); // demonstrates the bug this replaces

    expect(sumOfShares(distributeSharesWithRemainder(causeAreas))).toBe(100);
  });

  it("sums to exactly 100 for splits where naive independent rounding drifts above 100", () => {
    const causeAreas = Array.from({ length: 6 }, (_, i) => ({ id: i, amount: 1 }));

    const naiveSum = naiveIndependentRounding(causeAreas).reduce(
      (sum, share) => sum + parseFloat(share),
      0,
    );
    expect(naiveSum).not.toBe(100); // demonstrates the bug this replaces

    expect(sumOfShares(distributeSharesWithRemainder(causeAreas))).toBe(100);
  });

  it("preserves fields other than amount on each item", () => {
    const shares = distributeSharesWithRemainder([
      { id: 1, amount: 40, name: "Area A" },
      { id: 2, amount: 60, name: "Area B" },
    ]);

    expect(shares.find((s) => s.id === 1)?.name).toBe("Area A");
    expect(shares.find((s) => s.id === 2)?.name).toBe("Area B");
  });

  it("returns an empty array when the total is zero or negative", () => {
    expect(distributeSharesWithRemainder([])).toEqual([]);
    expect(distributeSharesWithRemainder([{ id: 1, amount: 0 }])).toEqual([]);
  });
});

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
    expect(shares).toEqual([{ id: 1, percentageShare: "100", amount: 42 }]);
  });

  it("includes the rounded kroner amount alongside the percentage share", () => {
    const shares = calculateOrganizationSharesWithinCauseArea([
      { id: 1, amount: 25.4 },
      { id: 2, amount: 74.6 },
    ]);
    expect(shares.find((s) => s.id === 1)?.amount).toBe(25);
    expect(shares.find((s) => s.id === 2)?.amount).toBe(75);
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
