import { DateTime } from "luxon";

export const onlyDate = (date: string) => {
  return DateTime.fromISO(date).toFormat("dd.MM");
};

export const shortDate = (isoDate: string): string => {
  return DateTime.fromISO(isoDate).toFormat("dd.MM yyyy");
};

export const longDate = (isoDate: string): string => {
  return DateTime.fromISO(isoDate).toFormat("dd.MM yyyy hh:mm");
};

export const thousandize = (number: number | null, locale: string = "no-NB") => {
  if (number === null) return "-";

  const formatter = new Intl.NumberFormat(locale, {
    useGrouping: true,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const formatted = formatter.format(number);

  // Replace regular spaces with non-breaking spaces if they're used as thousand separators
  return formatted.replace(/ /g, "\u00A0");
};

export const thousandizeString = (number: string | null) =>
  number !== null ? number.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "-";

/**
 * Converts main_locale (no, sv, dk) to full locale string for number formatting (no-NB, sv-SE, da-DK)
 */
export const getFormattingLocale = (mainLocale: string | null | undefined): FormattingLocale => {
  if (!mainLocale) return "no-NB";

  const localeMap: Record<string, FormattingLocale> = {
    no: "no-NB",
    sv: "sv-SE",
    dk: "da-DK",
    en: "en-US",
    et: "et-EE",
  };

  return localeMap[mainLocale] || "no-NB";
};

export type FormattingLocale = "no-NB" | "sv-SE" | "da-DK" | "en-US" | "et-EE";

/**
 * Gets the thousand separator character for a given locale
 */
export const getThousandSeparator = (locale: string): string => {
  const formatter = new Intl.NumberFormat(locale, {
    useGrouping: true,
  });

  // Format a number with grouping to extract the separator
  const parts = formatter.formatToParts(1234567);
  const groupPart = parts.find((part) => part.type === "group");

  return groupPart?.value || " ";
};

/**
 * Gets the decimal separator character for a given locale
 */
export const getDecimalSeparator = (locale: string): string => {
  const formatter = new Intl.NumberFormat(locale, {
    useGrouping: true,
    minimumFractionDigits: 1,
  });

  // Format a number with decimals to extract the separator
  const parts = formatter.formatToParts(1.23);
  const decimalPart = parts.find((part) => part.type === "decimal");

  return decimalPart?.value || ".";
};
