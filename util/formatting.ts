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

export const thousandize = (number: number | null) =>
  number !== null ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") : "-";

export const thousandizeString = (number: string | null) =>
  number !== null ? number.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "-";
