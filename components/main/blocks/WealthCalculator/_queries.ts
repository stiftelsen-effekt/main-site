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
  // 2026 https://skat.dk/hjaelp/satser
  const PERSONFRADRAG = 54100;
  const AM_BIDRAG_PCT = 0.08;
  const MELLEMSKAT_PCT = 0.075;
  const MELLEMSKAT_THRESHOLD = 641200;
  const TOPSKAT_PCT = 0.075;
  const TOPSKAT_THRESHOLD = 777900;
  const TOPTOPSKAT_PCT = 0.05;
  const TOPTOPSKAT_THRESHOLD = 2592700;
  const KOMMUNE_SKAT_PCT = 0.251;
  const BUNDSKAT_PCT = 0.1201;
  const SKATTELOFT_PCT = 0.4457;

  const amBidrag = income * AM_BIDRAG_PCT;
  const taxable = Math.max(0, income - amBidrag - PERSONFRADRAG);
  const bundSkat = taxable * BUNDSKAT_PCT;
  const kommuneSkat = taxable * KOMMUNE_SKAT_PCT;
  const mellemSkat = Math.max(0, taxable - MELLEMSKAT_THRESHOLD) * MELLEMSKAT_PCT;
  const skatteLoft = Math.max(0, (income - amBidrag) * SKATTELOFT_PCT);
  const topSkat = Math.max(0, taxable - TOPSKAT_THRESHOLD) * TOPSKAT_PCT;
  const topTopSkat = Math.max(0, taxable - TOPTOPSKAT_THRESHOLD) * TOPTOPSKAT_PCT;

  const totalTax =
    amBidrag + Math.min(kommuneSkat + bundSkat + mellemSkat, skatteLoft) + topSkat + topTopSkat;

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
