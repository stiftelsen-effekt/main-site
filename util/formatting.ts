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
