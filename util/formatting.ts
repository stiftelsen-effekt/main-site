/**
 * Parses an ISO 8601 string the way luxon's DateTime.fromISO does for the
 * formats we get from the API: date-only and offset-less values are local
 * time, values with Z or an offset are converted to local time. Kept free of
 * luxon so it does not end up in the client bundle.
 */
const parseISOLocal = (isoDate: string): Date =>
  new Date(/^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate}T00:00` : isoDate);

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Same output as luxon's toFormat for an invalid date */
const INVALID_DATE = "Invalid DateTime";

/** Formats an ISO date as "dd.MM" in local time */
export const onlyDate = (date: string) => {
  const d = parseISOLocal(date);
  if (isNaN(d.getTime())) return INVALID_DATE;
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}`;
};

/** Formats an ISO date as "dd.MM.yyyy HH:mm" in local time */
export const dateTimeNumeric = (isoDate: string) => {
  const d = parseISOLocal(isoDate);
  if (isNaN(d.getTime())) return INVALID_DATE;
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
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
