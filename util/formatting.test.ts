import { describe, expect, test } from "@jest/globals";
import { DateTime } from "luxon";
import { dateTimeNumeric, onlyDate } from "./formatting";

// These helpers replaced luxon in client code, so check they still match it.
// Both use the process time zone; run with e.g. TZ=America/Los_Angeles to
// check other zones.
const inputs = [
  "2024-01-05",
  "2024-03-31T01:30:00",
  "2024-03-31T23:59:59.999Z",
  "2024-10-27T02:30:00+02:00",
  "2025-12-31T23:30:00.000Z",
  "2025-06-15T12:00:00.000+05:30",
  "not a date",
];

describe("date formatting matches luxon", () => {
  test.each(inputs)("onlyDate(%s)", (input) => {
    expect(onlyDate(input)).toBe(DateTime.fromISO(input).toFormat("dd.MM"));
  });

  test.each(inputs)("dateTimeNumeric(%s)", (input) => {
    expect(dateTimeNumeric(input)).toBe(DateTime.fromISO(input).toFormat("dd.MM.yyyy HH:mm"));
  });
});
