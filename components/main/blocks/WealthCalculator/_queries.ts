import { DateTime } from "luxon";
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
