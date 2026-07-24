import {
  Distribution,
  Donation,
  GiveWellGrant,
  ImpactCharity,
  ImpactEvaluation,
  META_OWNER,
} from "../../../../models";
import { aggregateImpact, aggregateOrgSumByYearAndMonth } from "./_util";

/**
 * These tests focus on the core behaviour of the impact calculation: money that
 * is routed via a GiveWell grant (smart distribution) must derive its outputs
 * from the grant's own cost-per-output, while direct/custom donations continue
 * to use the generic evaluation estimate.
 */

const GIVEWELL_TOP_CHARITIES_FUND_ID = 12;

const AMF: ImpactCharity = {
  id: 1,
  charity_name: "Against Malaria Foundation",
  abbreviation: "AMF",
};
const MC: ImpactCharity = { id: 10, charity_name: "Malaria Consortium", abbreviation: "MC" };

const buildDonation = (
  overrides: Partial<Donation> & Pick<Donation, "KID" | "sum" | "timestamp">,
): Donation => ({
  donor: "Test Donor",
  donorId: 1,
  email: "test@example.com",
  id: 1,
  paymentMethod: "bank",
  transactionCost: "0",
  metaOwnerId: META_OWNER.EFFEKT,
  ...overrides,
});

const buildDistribution = (
  kid: string,
  organizations: { id: number; name: string; percentageShare: string }[],
  causeAreaShare = "100",
): Distribution => ({
  kid,
  donorId: 1,
  taxUnitId: null,
  causeAreas: [
    {
      id: 1,
      name: "Global Health",
      standardSplit: false,
      percentageShare: causeAreaShare,
      organizations,
    },
  ],
});

const buildEvaluation = (
  charity: ImpactCharity,
  shortDescription: string,
  convertedCostPerOutput: number,
): ImpactEvaluation => ({
  id: charity.id,
  intervention: {
    long_description: `${shortDescription} long`,
    short_description: shortDescription,
    id: charity.id,
  },
  converted_cost_per_output: convertedCostPerOutput,
  currency: "NOK",
  language: "no",
  start_year: 2024,
  start_month: 1,
  cents_per_output: 0,
  charity,
});

// A grant where the grant's OWN cost-per-output deliberately differs from the
// evaluations below, so we can prove which source is used.
const buildGrant = (): GiveWellGrant => ({
  id: 1,
  language: "no",
  start_year: 2024,
  start_month: 0,
  allotment_set: [
    {
      id: 1,
      intervention: { long_description: "Bednets long", short_description: "Bednets", id: 1 },
      converted_sum: 0,
      currency: "NOK",
      converted_cost_per_output: 50, // grant cost for AMF
      exchange_rate_date: "2024-01-01",
      sum_in_cents: 6000, // 60% of the grant
      number_outputs_purchased: 0,
      charity: AMF,
    },
    {
      id: 2,
      intervention: {
        long_description: "Malaria treatments long",
        short_description: "Malaria treatments",
        id: 2,
      },
      converted_sum: 0,
      currency: "NOK",
      converted_cost_per_output: 200, // grant cost for MC
      exchange_rate_date: "2024-01-01",
      sum_in_cents: 4000, // 40% of the grant
      number_outputs_purchased: 0,
      charity: MC,
    },
  ],
});

const templateStrings = {
  org_grant_template_string: "{{org}} via fond",
  org_direct_template_string: "{{org}} direkte",
};

describe("aggregateOrgSumByYearAndMonth", () => {
  it("returns an empty aggregate when there are no grants", () => {
    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          {
            id: GIVEWELL_TOP_CHARITIES_FUND_ID,
            name: "GiveWell Top Charities Fund",
            percentageShare: "100",
          },
        ]),
      ],
    ]);

    expect(aggregateOrgSumByYearAndMonth([donation], distributions, null)).toEqual({});
  });

  it("splits smart distribution across allotments and derives outputs from the grant cost-per-output", () => {
    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          {
            id: GIVEWELL_TOP_CHARITIES_FUND_ID,
            name: "GiveWell Top Charities Fund",
            percentageShare: "100",
          },
        ]),
      ],
    ]);

    const aggregated = aggregateOrgSumByYearAndMonth([donation], distributions, [buildGrant()]);

    // AMF gets 60% of 1000 = 600 kr via the grant -> 600 / 50 = 12 outputs
    expect(aggregated["Against Malaria Foundation"].smart_distribution_sum).toBe(600);
    expect(aggregated["Against Malaria Foundation"].custom_sum).toBe(0);
    expect(aggregated["Against Malaria Foundation"].smart_distribution_outputs).toBeCloseTo(12);

    // MC gets 40% of 1000 = 400 kr via the grant -> 400 / 200 = 2 outputs
    expect(aggregated["Malaria Consortium"].smart_distribution_sum).toBe(400);
    expect(aggregated["Malaria Consortium"].smart_distribution_outputs).toBeCloseTo(2);
  });

  it("records direct donations as custom sums with no grant-derived outputs", () => {
    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          { id: AMF.id, name: "Against Malaria Foundation", percentageShare: "100" },
        ]),
      ],
    ]);

    const aggregated = aggregateOrgSumByYearAndMonth([donation], distributions, [buildGrant()]);

    expect(aggregated["Against Malaria Foundation"].custom_sum).toBe(1000);
    expect(aggregated["Against Malaria Foundation"].smart_distribution_sum).toBe(0);
    expect(aggregated["Against Malaria Foundation"].smart_distribution_outputs).toBe(0);
  });
});

describe("aggregateImpact", () => {
  const evaluations = [
    buildEvaluation(AMF, "Bednets", 100), // eval cost differs from grant (50)
    buildEvaluation(MC, "Malaria treatments", 100), // eval cost differs from grant (200)
  ];

  it("uses the grant cost-per-output (not the evaluation) for smart distribution outputs", () => {
    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          {
            id: GIVEWELL_TOP_CHARITIES_FUND_ID,
            name: "GiveWell Top Charities Fund",
            percentageShare: "100",
          },
        ]),
      ],
    ]);

    const aggregated = aggregateOrgSumByYearAndMonth([donation], distributions, [buildGrant()]);
    const impact = aggregateImpact(aggregated, evaluations, templateStrings);

    // Grant-derived: 600/50 = 12. Evaluation-derived would (incorrectly) be 600/100 = 6.
    expect(impact["bednets"].outputs).toBeCloseTo(12);
    expect(impact["bednets"].outputs).not.toBeCloseTo(6);

    // Grant-derived: 400/200 = 2. Evaluation-derived would (incorrectly) be 400/100 = 4.
    expect(impact["malaria treatments"].outputs).toBeCloseTo(2);
    expect(impact["malaria treatments"].outputs).not.toBeCloseTo(4);

    // Constituent kr amounts are attributed to the "via fond" label
    expect(impact["bednets"].constituents["Against Malaria Foundation via fond"]).toBe(600);
    expect(impact["malaria treatments"].constituents["Malaria Consortium via fond"]).toBe(400);
  });

  it("uses the evaluation cost-per-output for direct/custom donations", () => {
    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          { id: AMF.id, name: "Against Malaria Foundation", percentageShare: "100" },
        ]),
      ],
    ]);

    const aggregated = aggregateOrgSumByYearAndMonth([donation], distributions, [buildGrant()]);
    const impact = aggregateImpact(aggregated, evaluations, templateStrings);

    // Direct donation: 1000 / 100 (eval cost) = 10 outputs
    expect(impact["bednets"].outputs).toBeCloseTo(10);
    expect(impact["bednets"].constituents["Against Malaria Foundation direkte"]).toBe(1000);
  });

  it("blends grant-derived and evaluation-derived outputs when an org gets both", () => {
    // 50% direct to AMF, 50% to the GiveWell fund
    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          { id: AMF.id, name: "Against Malaria Foundation", percentageShare: "50" },
          {
            id: GIVEWELL_TOP_CHARITIES_FUND_ID,
            name: "GiveWell Top Charities Fund",
            percentageShare: "50",
          },
        ]),
      ],
    ]);

    const aggregated = aggregateOrgSumByYearAndMonth([donation], distributions, [buildGrant()]);
    const impact = aggregateImpact(aggregated, evaluations, templateStrings);

    // AMF direct: 500 kr / 100 (eval) = 5 outputs
    // AMF via grant: 60% of 500 = 300 kr / 50 (grant) = 6 outputs
    // Total = 11
    expect(impact["bednets"].outputs).toBeCloseTo(11);
    expect(impact["bednets"].constituents["Against Malaria Foundation direkte"]).toBe(500);
    expect(impact["bednets"].constituents["Against Malaria Foundation via fond"]).toBe(300);

    // MC via grant only: 40% of 500 = 200 kr / 200 (grant) = 1 output
    expect(impact["malaria treatments"].outputs).toBeCloseTo(1);
    expect(impact["malaria treatments"].constituents["Malaria Consortium via fond"]).toBe(200);
  });

  it("still reports smart distribution outputs even when the evaluation is stale relative to the grant", () => {
    // The grant is from 2024/2025 but the only evaluation available is old; the
    // smart distribution outputs must not depend on it.
    const staleEvaluations = [
      { ...buildEvaluation(AMF, "Bednets", 100), start_year: 2020, start_month: 1 },
      { ...buildEvaluation(MC, "Malaria treatments", 100), start_year: 2020, start_month: 1 },
    ];

    const donation = buildDonation({ KID: "1", sum: "1000", timestamp: "2025-01-15" });
    const distributions = new Map<string, Distribution>([
      [
        "1",
        buildDistribution("1", [
          {
            id: GIVEWELL_TOP_CHARITIES_FUND_ID,
            name: "GiveWell Top Charities Fund",
            percentageShare: "100",
          },
        ]),
      ],
    ]);

    const aggregated = aggregateOrgSumByYearAndMonth([donation], distributions, [buildGrant()]);
    const impact = aggregateImpact(aggregated, staleEvaluations, templateStrings);

    expect(impact["bednets"].outputs).toBeCloseTo(12);
    expect(impact["malaria treatments"].outputs).toBeCloseTo(2);
  });
});
