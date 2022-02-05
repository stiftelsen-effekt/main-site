import { DateTime } from 'luxon'

export const shortDate = (isoDate: string): string => {
  return DateTime.fromISO(isoDate).toFormat("dd.MM yyyy")
}

export const longDate = (isoDate: string): string => {
  return DateTime.fromISO(isoDate).toFormat("dd.MM yyyy hh:mm")
}