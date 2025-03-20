import { WealthCalculatorPeriodAdjustment } from "../../../shared/components/Graphs/Area/AreaGraph";

export const getNorwegianTaxEstimate = async (
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
) => {
  if (income < 0) {
    return 0;
  }
  if (Number.isNaN(income)) {
    return 0;
  }
  if (income === 0) {
    return 0;
  }
  if (!Number.isFinite(income)) {
    return 0;
  }

  const adjustedIncome =
    periodAdjustment === WealthCalculatorPeriodAdjustment.MONTHLY ? income * 12 : income;

  try {
    const response = await fetch(`/api/tax?locale=NO`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ income: adjustedIncome }),
    });

    const tax = await response.json();

    if (periodAdjustment === WealthCalculatorPeriodAdjustment.MONTHLY) {
      return tax / 12;
    }

    return tax;
  } catch (error) {
    throw new Error("Could not find tax amount for NO");
  }
};

export const getSwedishTaxEstimate = async (
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
) => {
  if (income < 0) {
    return 0;
  }
  if (Number.isNaN(income)) {
    return 0;
  }
  if (income === 0) {
    return 0;
  }
  if (!Number.isFinite(income)) {
    return 0;
  }

  const adjustedIncome =
    periodAdjustment === WealthCalculatorPeriodAdjustment.MONTHLY ? income * 12 : income;

  try {
    const response = await fetch("/api/tax?locale=SV", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ income: adjustedIncome }),
    });

    const tax = await response.json();

    if (periodAdjustment === WealthCalculatorPeriodAdjustment.MONTHLY) {
      return tax / 12;
    }

    return tax;
  } catch (error) {
    throw new Error("Could not find tax amount for SV");
  }
};

/**
 * Calculate Danish tax estimate
 * Assumes no church tax and no other deductions
 */
export const getDanishTaxEstimate = async (
  income: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
) => {
  // Constants for 2024
  const BASE_TAX_RATE = 0.1201; // 12.01% bundskat
  const TOP_TAX_RATE = 0.15; // 15% topskat
  const PERSONAL_DEDUCTION = 51600; // Personfradrag 51,600 kr.
  const TOP_TAX_THRESHOLD = 611800; // Topskatgrænse 611,800 kr.
  const EMPLOYMENT_DEDUCTION_RATE = 0.123; // 12.30% beskæftigelsesfradrag
  const MAX_EMPLOYMENT_DEDUCTION = 55600; // Max 55,600 kr. beskæftigelsesfradrag
  const municipalTaxRate = 27; // høj kommuneskat

  // Convert municipal tax rate from percentage to decimal
  const municipalTaxRateDecimal = municipalTaxRate / 100;

  // Calculate employment deduction (beskæftigelsesfradrag)
  const employmentDeduction = Math.min(
    income * EMPLOYMENT_DEDUCTION_RATE,
    MAX_EMPLOYMENT_DEDUCTION,
  );

  // Calculate taxable income after personal deduction
  const taxableBaseIncome = Math.max(0, income - PERSONAL_DEDUCTION - employmentDeduction);

  // Calculate base tax components
  const baseTax = taxableBaseIncome * BASE_TAX_RATE;
  const municipalityTax = taxableBaseIncome * municipalTaxRateDecimal;

  // Calculate top tax if applicable
  let topTaxAmount = 0;
  if (income > TOP_TAX_THRESHOLD) {
    const topTaxableIncome = income - TOP_TAX_THRESHOLD;
    topTaxAmount = topTaxableIncome * TOP_TAX_RATE;
  }

  const totalTax = baseTax + municipalityTax + topTaxAmount;

  if (periodAdjustment === WealthCalculatorPeriodAdjustment.MONTHLY) {
    return totalTax / 12;
  }
  return totalTax;
};

export type AdjustedPPPFactorResult = {
  adjustedPPPfactor: number;
  cumulativeInflation: number;
  pppFactor: number;
};

export const getNorwegianAdjustedPPPconversionFactor =
  async (): Promise<AdjustedPPPFactorResult> => {
    const cumulativeInflation = await getNorwegianInflation2017();
    const pppFactor = await getPPPfactor2017("NOR");

    const adjustedPPPfactor = pppFactor * (1 + cumulativeInflation);

    return {
      adjustedPPPfactor,
      cumulativeInflation,
      pppFactor,
    };
  };

export const getSwedishAdjustedPPPconversionFactor = async (): Promise<AdjustedPPPFactorResult> => {
  const cumulativeInflation = await getSwedishInflation2017();
  const pppFactor = await getPPPfactor2017("SV");

  const adjustedPPPfactor = pppFactor * (1 + cumulativeInflation);

  return {
    adjustedPPPfactor,
    cumulativeInflation,
    pppFactor,
  };
};

export const getDanishAdjustedPPPconversionFactor = async (): Promise<AdjustedPPPFactorResult> => {
  const cumulativeInflation = await getDanishInflation2017();
  const pppFactor = await getPPPfactor2017("DK");

  const adjustedPPPfactor = pppFactor * (1 + cumulativeInflation);

  return {
    adjustedPPPfactor,
    cumulativeInflation,
    pppFactor,
  };
};

const getPPPfactor2017 = async (countryCode: string) => {
  /* API is broken, so we use a temporary value */
  /*
  const pppFactor = await fetch(
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/PA.NUS.PPP?date=2017:2017&format=json`,
  );

  const json = await pppFactor.json();

  return json[1][0].value;
  */
  if (countryCode === "NOR") {
    return 9.7;
  } else if (countryCode === "SV") {
    return 8.9;
  } else if (countryCode === "DK") {
    return 6.8;
  } else {
    throw new Error("Invalid country code");
  }
};

const getNorwegianInflation2017 = async () => {
  try {
    const res = await fetch(`/api/inflation?locale=NO`);
    const inflation = await res.json();

    return inflation;
  } catch (error) {
    throw new Error("Could not find inflation rate for NOK");
  }
};

const getSwedishInflation2017 = async () => {
  try {
    const res = await fetch(`/api/inflation?locale=SV`);
    const inflation = await res.json();

    return inflation;
  } catch (error) {
    throw new Error("Could not find inflation rate for SEK");
  }
};

const getDanishInflation2017 = async () => {
  try {
    const res = await fetch(`/api/inflation?locale=DK`);
    const inflation = await res.json();

    return inflation;
  } catch (error) {
    throw new Error("Could not find inflation rate for DKK");
  }
};
