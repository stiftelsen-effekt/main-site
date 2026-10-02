import { WealthCalculatorPeriodAdjustment } from "../../../shared/components/Graphs/Area/AreaGraph";
import { getDanishTaxEstimate, getNorwegianTaxEstimate, getSwedishTaxEstimate } from "./_queries";

export const calculateWealthPercentile = (
  data: { x: number; y: number }[],
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
  adjustedPPPConversionFactor: number,
) => {
  const dataSum = data.reduce((acc, curr) => acc + curr.y, 0);
  const dailyIncome = income / periodAdjustment / adjustedPPPConversionFactor;
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

/**
 * Client side cache of post tax income estimates, so toggling back and forth between inputs
 * (e.g. one and two adults) does not refetch estimates we already have.
 */
const postTaxIncomeCache = new Map<string, number>();

const getPostTaxIncomeCacheKey = (
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
  jurisdiction: TaxJurisdiction,
) => `${jurisdiction}:${periodAdjustment}:${income}`;

export const getCachedPostTaxIncome = (
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
  jurisdiction: TaxJurisdiction,
): number | undefined => {
  if (income <= 0) return 0;
  return postTaxIncomeCache.get(getPostTaxIncomeCacheKey(income, periodAdjustment, jurisdiction));
};

export const getEstimatedPostTaxIncome = async (
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
  jurisdiction: TaxJurisdiction,
) => {
  const cached = getCachedPostTaxIncome(income, periodAdjustment, jurisdiction);
  if (typeof cached !== "undefined") {
    return cached;
  }

  let tax = 0;
  switch (jurisdiction) {
    case TaxJurisdiction.SV:
      tax = await getSwedishTaxEstimate(income, periodAdjustment);
      break;
    case TaxJurisdiction.NO:
      tax = await getNorwegianTaxEstimate(income, periodAdjustment);
      break;
    case TaxJurisdiction.DK:
      tax = await getDanishTaxEstimate(income, periodAdjustment);
      break;
    default:
      return income;
  }

  const postTaxIncome = income - tax;
  postTaxIncomeCache.set(
    getPostTaxIncomeCacheKey(income, periodAdjustment, jurisdiction),
    postTaxIncome,
  );
  return postTaxIncome;
};

export enum TaxJurisdiction {
  NO = "Norway",
  SV = "Sweden",
  DK = "Denmark",
}
