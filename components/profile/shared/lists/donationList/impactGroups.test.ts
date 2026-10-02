import { expect, test } from "@jest/globals";
import { DonationImpactEntry } from "../../../../../models";
import { groupDonationImpactByCauseArea } from "./impactGroups";

const causeAreas = [
  { id: 1, name: "Global sundhed" },
  { id: 2, name: "Dyrevelfærd" },
];

const organizations = [
  { name: "A-vitamin mod fejlernæring", causeAreaId: 1 },
  { name: "Good Food Institute", causeAreaId: 2 },
];

const globalHealthImpact: DonationImpactEntry = {
  unit: "A-vitamintilskud",
  count: 69.1,
  amount: 500,
  recipient: "Forventet: Helen Keller International",
  organization: "A-vitamin mod fejlernæring",
};

const animalWelfareImpact: DonationImpactEntry = {
  unit: "Food units",
  count: 300,
  amount: 300,
  recipient: "Forventet: Good Food Institute",
  organization: "Good Food Institute",
};

test("does not show a title for one cause area", () => {
  const groups = groupDonationImpactByCauseArea([animalWelfareImpact], organizations, [
    causeAreas[1],
  ]);

  expect(groups).toEqual([
    {
      causeArea: causeAreas[1],
      impact: [animalWelfareImpact],
      showTitle: false,
    },
  ]);
});

test("shows titles and groups impact when multiple cause areas are present", () => {
  const groups = groupDonationImpactByCauseArea(
    [animalWelfareImpact, globalHealthImpact],
    organizations,
    causeAreas,
  );

  expect(groups).toEqual([
    {
      causeArea: causeAreas[0],
      impact: [globalHealthImpact],
      showTitle: true,
    },
    {
      causeArea: causeAreas[1],
      impact: [animalWelfareImpact],
      showTitle: true,
    },
  ]);
});

test("combines impact distributed to the same organization", () => {
  const secondGlobalHealthImpact: DonationImpactEntry = {
    ...globalHealthImpact,
    amount: 100,
    count: 10,
  };
  const groups = groupDonationImpactByCauseArea(
    [globalHealthImpact, secondGlobalHealthImpact],
    organizations,
    causeAreas,
  );

  expect(groups[0].impact).toEqual([
    {
      ...globalHealthImpact,
      amount: 600,
      count: 79.1,
    },
  ]);
});

test("keeps different units for the same organization separate", () => {
  const children: DonationImpactEntry = {
    organization: "Evidence Action",
    recipient: "Evidence Action",
    unit: "Børn nået med ormekur eller jerntilskud",
    amount: 600,
    count: 30,
  };
  const water: DonationImpactEntry = {
    ...children,
    unit: "Personer med adgang til rent vand i ét år",
    amount: 400,
    count: 10,
  };
  const groups = groupDonationImpactByCauseArea(
    [children, water],
    [{ name: "Evidence Action", causeAreaId: 1 }],
    causeAreas,
  );

  expect(groups[0].impact).toEqual([children, water]);
});

test("keeps expected and completed transfers separate", () => {
  const completed: DonationImpactEntry = {
    ...globalHealthImpact,
    recipient: "Helen Keller International",
  };
  const groups = groupDonationImpactByCauseArea(
    [globalHealthImpact, completed],
    organizations,
    causeAreas,
  );

  expect(groups[0].impact).toEqual([globalHealthImpact, completed]);
});

test("includes inactive organizations in their cause area", () => {
  const custom: DonationImpactEntry = {
    organization: "Taimaka",
    recipient: "Taimaka",
    unit: "Børn behandlet for akut underernæring",
    amount: 100,
    count: 2,
  };
  const inactiveOrganizations = [{ name: "Taimaka", causeAreaId: 1, isActive: false }];
  const groups = groupDonationImpactByCauseArea([custom], inactiveOrganizations, causeAreas);

  expect(groups).toEqual([{ causeArea: causeAreas[0], impact: [custom], showTitle: false }]);
});

test("unknown organizations are excluded even when Andet is available", () => {
  const unknown: DonationImpactEntry = {
    ...globalHealthImpact,
    recipient: "Custom recipient",
    organization: "Custom recipient",
  };
  const allCauseAreas = [...causeAreas, { id: 5, name: "Andet" }];
  const groups = groupDonationImpactByCauseArea(
    [globalHealthImpact, unknown],
    organizations,
    allCauseAreas,
  );

  expect(groups).toEqual([
    { causeArea: causeAreas[0], impact: [globalHealthImpact], showTitle: false },
  ]);
  expect(groupDonationImpactByCauseArea([unknown], organizations, allCauseAreas)).toEqual([]);
});

test("skips a cause area when the backend sends no impact for it", () => {
  const groups = groupDonationImpactByCauseArea([animalWelfareImpact], organizations, causeAreas);

  expect(groups.map((group) => group.causeArea.name)).toEqual(["Dyrevelfærd"]);
  expect(groups[0].showTitle).toBe(false);
});
