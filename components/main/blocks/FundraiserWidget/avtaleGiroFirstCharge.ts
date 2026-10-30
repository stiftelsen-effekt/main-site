import { addWorkingDays } from "norwegian-workdays";

/**
 * Banking days from signing until the first due date we can still claim.
 *
 * Nets reports a new agreement in the next banking day's OCR file, which is when we activate it
 * (true for ~97% of agreements since 2025). The claims job picks it up on the following banking
 * day, and claims due dates that are 4 banking days ahead (getDueDates in effekt-backend). That is
 * 5 banking days; the sixth allows for agreements that take an extra day to activate, since a
 * missed claim pushes the first charge a whole month.
 */
export const AVTALEGIRO_FIRST_CHARGE_WORKING_DAYS = 6;

export interface AvtaleGiroFirstCharge {
  /** Monthly charge day stored on the agreement, 1-28 */
  dueDay: number;
  /** The first charge date, as an Oslo calendar day at local midnight */
  firstChargeDate: Date;
}

export const getFirstAvtaleGiroCharge = (now: Date = new Date()): AvtaleGiroFirstCharge => {
  const firstChargeDate = addWorkingDays(now, AVTALEGIRO_FIRST_CHARGE_WORKING_DAYS, {
    timeZone: "Europe/Oslo",
  });
  firstChargeDate.setDate(firstChargeDate.getDate() + 1);

  // Charge days stop at the 28th so every month has them, so move later dates to the 1st
  if (firstChargeDate.getDate() > 28) {
    firstChargeDate.setMonth(firstChargeDate.getMonth() + 1, 1);
  }

  return { dueDay: firstChargeDate.getDate(), firstChargeDate };
};
