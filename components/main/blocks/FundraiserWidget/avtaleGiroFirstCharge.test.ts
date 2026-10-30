import { describe, expect, it } from "@jest/globals";
import { getFirstAvtaleGiroCharge } from "./avtaleGiroFirstCharge";

// Instants are given in UTC; the calendar day is read in Oslo
const charge = (isoInstant: string) => getFirstAvtaleGiroCharge(new Date(isoInstant));
const day = (year: number, month: number, date: number) => new Date(year, month - 1, date);

describe("first AvtaleGiro charge", () => {
  it("is the day after the sixth banking day after signing", () => {
    // Monday 5 Oct 2026: banking days Tue 6 to Tue 13 (6th), so Wednesday 14
    expect(charge("2026-10-05T10:00:00Z")).toEqual({
      dueDay: 14,
      firstChargeDate: day(2026, 10, 14),
    });
  });

  it("skips weekends", () => {
    // Friday 16 Oct 2026: Mon 19 ... Mon 26 (6th), so Tuesday 27
    expect(charge("2026-10-16T10:00:00Z").firstChargeDate).toEqual(day(2026, 10, 27));
  });

  it("can land on a weekend, which the claims job covers", () => {
    // Thursday 29 Oct 2026: Fri 30, Mon 2, Tue 3, Wed 4, Thu 5, Fri 6 Nov (6th), so Saturday 7
    expect(charge("2026-10-29T10:00:00Z").firstChargeDate).toEqual(day(2026, 11, 7));
  });

  it("skips the easter holidays", () => {
    // Tuesday 31 Mar 2026: Wed 1, Tue 7, Wed 8, Thu 9, Fri 10, Mon 13 Apr (6th), so Tuesday 14
    expect(charge("2026-03-31T10:00:00Z").firstChargeDate).toEqual(day(2026, 4, 14));
  });

  it("moves dates after the 28th to the 1st of the next month", () => {
    // Monday 19 Oct 2026: Tue 20 ... Tue 27 (6th), so Wednesday 28 stays
    expect(charge("2026-10-19T10:00:00Z").dueDay).toBe(28);
    // Tuesday 20 Oct 2026: Wed 21 ... Wed 28 (6th), so Thursday 29 becomes 1 November
    expect(charge("2026-10-20T10:00:00Z")).toEqual({
      dueDay: 1,
      firstChargeDate: day(2026, 11, 1),
    });
  });

  it("rolls over the year", () => {
    // Monday 21 Dec 2026: Tue 22, Wed 23, Thu 24, Mon 28, Tue 29, Wed 30 (6th), so Thursday 31
    expect(charge("2026-12-21T10:00:00Z").firstChargeDate).toEqual(day(2027, 1, 1));
  });

  it("uses the calendar day in Oslo", () => {
    // 23:30 UTC on Sunday 4 Oct is Monday 5 Oct in Oslo
    expect(charge("2026-10-04T23:30:00Z").firstChargeDate).toEqual(day(2026, 10, 14));
  });
});
