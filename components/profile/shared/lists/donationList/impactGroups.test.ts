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

test("skips a cause area when the backend sends no impact for it", () => {
  const groups = groupDonationImpactByCauseArea([animalWelfareImpact], organizations, causeAreas);

  expect(groups.map((group) => group.causeArea.name)).toEqual(["Dyrevelfærd"]);
  expect(groups[0].showTitle).toBe(false);
});
