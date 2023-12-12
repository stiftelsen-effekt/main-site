import { getNorwegianTaxEstimate, getSwedishTaxEstimate } from "./_queries";
import { taxTable } from "./taxTable";

export const calculateWealthPercentile = (data: { x: number; y: number }[], income: number) => {
  const dataSum = data.reduce((acc, curr) => acc + curr.y, 0);
  const dailyIncome = income / 365 / 10.5;
  const bucketsSumUpToLineInput = data
    .filter((d) => d.x <= dailyIncome)
    .reduce((acc, curr) => acc + curr.y, 0);

  const bucketAfterLineInputIndex = data.findIndex((d) => d.x > dailyIncome);

  let linearInterpolationAdd = 0;
  if (bucketAfterLineInputIndex > -1) {
    const positionBetweenBuckets =
      (dailyIncome - data[bucketAfterLineInputIndex - 1].x) /
      (data[bucketAfterLineInputIndex].x - data[bucketAfterLineInputIndex - 1].x);

    linearInterpolationAdd = data[bucketAfterLineInputIndex].y * positionBetweenBuckets;
  }

  const totalSum = bucketsSumUpToLineInput + linearInterpolationAdd;

  let lineInputWealthPercentile = (1 - totalSum / dataSum) * 100;
  // Round to 2 decimals
  lineInputWealthPercentile = Math.round(lineInputWealthPercentile * 10) / 10;

  return lineInputWealthPercentile;
};

export const equvivalizeIncome = (
  income: number,
  numberOfChildren: number,
  numberOfAdults: number,
) => {
  // Using OECD-modified scale for equvivalize income
  // https://en.wikipedia.org/wiki/Equivalisation
  const equvivalizedIncome = income / (1 + 0.3 * numberOfChildren + 0.5 * (numberOfAdults - 1));
  return equvivalizedIncome;
};

export const getEstimatedPostTaxIncome = async (income: number, jurisdiction: TaxJurisdiction) => {
  // Round income to nearest 1000
  let tax = 0;
  switch (jurisdiction) {
    case TaxJurisdiction.SE:
      tax = await getSwedishTaxEstimate(income);
      break;
    case TaxJurisdiction.NO:
      tax = await getNorwegianTaxEstimate(income);
      break;
    default:
      return income;
  }

  return income - tax;
};

export enum TaxJurisdiction {
  NO = "Norway",
  SE = "Sweden",
}
