import { expect, jest, test } from "@jest/globals";

import { aggregateOrgSumByYearAndMonth } from "../../../components/profile/donations/DonationsDistributionTable/_util";
import { Distribution, Donation, GiveWellGrant } from "../../../models";

const donations: Donation[] = [
  {
    KID: "1234",
    donor: "Test donor",
    donorId: 99,
    email: "some@email.com",
    id: 123,
    paymentMethod: "Bank",
    sum: "1200",
    timestamp: "2020-01-01T00:00:00.000Z",
    transactionCost: "2",
    metaOwnerId: 3,
  },
  {
    KID: "1235",
    donor: "Test donor",
    donorId: 99,
    email: "some@email.com",
    id: 124,
    paymentMethod: "Vipps",
    sum: "800",
    timestamp: "2021-01-01T00:00:00.000Z",
    transactionCost: "15",
    metaOwnerId: 3,
  },
];

const donationWithFullGrant: Donation = {
  KID: "1236",
  donor: "Test donor",
  donorId: 99,
  email: "some@email.com",
  id: 125,
  paymentMethod: "Bank",
  sum: "1200",
  timestamp: "2020-01-01T00:00:00.000Z",
  transactionCost: "2",
  metaOwnerId: 3,
};

const donationWithPartialGrant: Donation = {
  KID: "1237",
  donor: "Test donor",
  donorId: 99,
  email: "some@email.com",
  id: 125,
  paymentMethod: "Bank",
  sum: "10000",
  timestamp: "2020-01-01T00:00:00.000Z",
  transactionCost: "2",
  metaOwnerId: 3,
};

const distributions = new Map<string, Distribution>();
distributions.set("1234", {
  kid: "1234",
  standardDistribution: false,
  taxUnit: null,
  shares: [
    {
      id: 1,
      name: "Against Malaria Foundation",
      share: "35.00",
    },
    {
      id: 2,
      name: "New Incentives",
      share: "65.00",
    },
  ],
});

distributions.set("1235", {
  kid: "1235",
  standardDistribution: false,
  taxUnit: null,
  shares: [
    {
      id: 2,
      name: "New Incentives",
      share: "90.00",
    },
    {
      id: 3,
      name: "Drift av Gi Effektivt",
      share: "10.00",
    },
  ],
});

distributions.set("1236", {
  kid: "1236",
  standardDistribution: false,
  taxUnit: null,
  shares: [
    {
      id: 12,
      name: "GiveWell",
      share: "100.00",
    },
  ],
});

distributions.set("1237", {
  kid: "1237",
  standardDistribution: false,
  taxUnit: null,
  shares: [
    {
      id: 12,
      name: "GiveWell",
      share: "50.00",
    },
    {
      id: 2,
      name: "New Incentives",
      share: "50.00",
    },
  ],
});

const grants: GiveWellGrant[] = [
  {
    id: 6,
    allotment_set: [
      {
        id: 9,
        intervention: {
          long_description:
            "Spebarn vaksinert som ikke ville blitt vaksinert hadde det ikke vært for dette tiltaket",
          short_description: "Vaksinasjoner",
          id: 5,
        },
        converted_sum: 80353754.46960668,
        currency: "NOK",
        converted_cost_per_output: 989.3833046395622,
        exchange_rate_date: "2019-12-01",
        sum_in_cents: 940000000,
        number_outputs_purchased: 81216,
        charity: { id: 4, charity_name: "New Incentives", abbreviation: "NI" },
      },
      {
        id: 10,
        intervention: {
          long_description: "Myggnett impregnert med insektmiddel levert til husholdninger",
          short_description: "Myggnett",
          id: 2,
        },
        converted_sum: 19495710.00238379,
        currency: "NOK",
        converted_cost_per_output: 41.715527373298734,
        exchange_rate_date: "2019-12-01",
        sum_in_cents: 228066100,
        number_outputs_purchased: 467349,
        charity: { id: 1, charity_name: "Against Malaria Foundation", abbreviation: "AMF" },
      },
      {
        id: 11,
        intervention: {
          long_description: "Barn behandlet med en full kur med malariamedisin",
          short_description: "Malariabehandling",
          id: 1,
        },
        converted_sum: 19495710.00238379,
        currency: "NOK",
        converted_cost_per_output: 58.98300008889874,
        exchange_rate_date: "2019-12-01",
        sum_in_cents: 228066100,
        number_outputs_purchased: 330531,
        charity: { id: 10, charity_name: "Malaria Consortium", abbreviation: "MC" },
      },
    ],
    language: "no",
    start_year: 2019,
    start_month: 12,
  },
];

describe("Donations organizaitons aggregation", () => {
  it("Should aggregate donations by organization and share", () => {
    const aggregated = aggregateOrgSumByYearAndMonth(donations, distributions, []);

    expect(aggregated["New Incentives"].sum).toBe(1500);
    expect(aggregated["Against Malaria Foundation"].sum).toBe(420);
    expect(aggregated["Drift av Gi Effektivt"].sum).toBe(80);
  });

  it("Sum of aggregated donations should equal sum of donations", () => {
    const aggregated = aggregateOrgSumByYearAndMonth(donations, distributions, []);

    const aggregatedSum = Object.values(aggregated).reduce((acc, org) => acc + org.sum, 0);
    const donationsSum = donations.reduce((acc, donation) => acc + parseInt(donation.sum), 0);

    expect(aggregatedSum).toBe(donationsSum);
  });

  it("Should aggregate donations by organization and share with grants", () => {
    const aggregated = aggregateOrgSumByYearAndMonth(
      [...donations, donationWithFullGrant],
      distributions,
      grants,
    );

    expect(aggregated["New Incentives"].sum).toBe(2308);
    expect(aggregated["Against Malaria Foundation"].sum).toBe(616);
    expect(aggregated["Drift av Gi Effektivt"].sum).toBe(80);
    expect(aggregated["Malaria Consortium"].sum).toBe(196);
    expect("GiveWell" in aggregated).toBe(false);
  });

  it("Should record which parts of the sum are from smart distribution and which are directly distributed", () => {
    const aggregated = aggregateOrgSumByYearAndMonth(
      [...donations, donationWithFullGrant],
      distributions,
      grants,
    );

    expect(aggregated["New Incentives"].smart_distribution_sum).toBe(808);
    expect(aggregated["Against Malaria Foundation"].smart_distribution_sum).toBe(196);
    expect(aggregated["Malaria Consortium"].smart_distribution_sum).toBe(196);
    expect(aggregated["Drift av Gi Effektivt"].smart_distribution_sum).toBe(0);

    expect(aggregated["New Incentives"].custom_sum).toBe(1500);
    expect(aggregated["Against Malaria Foundation"].custom_sum).toBe(420);
    expect(aggregated["Drift av Gi Effektivt"].custom_sum).toBe(80);

    expect("GiveWell" in aggregated).toBe(false);
  });

  it("Should handle donations with distributions that are partially grants and partially directly distributed", () => {
    const aggregated = aggregateOrgSumByYearAndMonth(
      [...donations, donationWithPartialGrant],
      distributions,
      grants,
    );

    expect(aggregated["New Incentives"].sum).toBe(9866);
    expect(aggregated["Against Malaria Foundation"].sum).toBe(1237);
    expect(aggregated["Drift av Gi Effektivt"].sum).toBe(80);
    expect(aggregated["Malaria Consortium"].sum).toBe(817);
    expect("GiveWell" in aggregated).toBe(false);
  });
});
