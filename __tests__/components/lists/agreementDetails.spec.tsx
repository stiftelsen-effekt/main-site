import {
  checkPaymentDate,
  daysInMonth,
} from "../../../components/lists/agreementList/agreementDetails";

describe("Check that daysInMonth() works", () => {
  it("if daysInMonth will return 28 when date is february 2022", () => {
    expect(daysInMonth(2, 2022)).toEqual(28);
  });

  it("if daysInMonth will return 31 when date is january 2022", () => {
    expect(daysInMonth(1, 2022)).toEqual(31);
  });

  it("if daysInMonth will return 30 when date is april 2022", () => {
    expect(daysInMonth(4, 2022)).toEqual(30);
  });

  it("if daysInMonth will return 31 when date is august 2022", () => {
    expect(daysInMonth(8, 2022)).toEqual(31);
  });

  it("if daysInMonth will return 29 when date is february 2024", () => {
    expect(daysInMonth(2, 2024)).toEqual(29);
  });
});

describe("Check that checkPaymentDate() works", () => {
  it("if checkPaymentDate will return true when date = 28.04.22 and paymentDate = 2", () => {
    let today = new Date();
    today.setFullYear(2022, 3, 28);
    let currentPaymentDate = 2;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return true when date = 28.02.22 and paymentDate = 6", () => {
    let today = new Date();
    today.setFullYear(2022, 1, 28);
    let currentPaymentDate = 6;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return true when date = 31.12.22 and paymentDate = 3", () => {
    let today = new Date();
    today.setFullYear(2022, 11, 31);
    let currentPaymentDate = 3;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return true when date = 07.03.22 and paymentDate = 8", () => {
    let today = new Date();
    today.setFullYear(2022, 2, 7);
    let currentPaymentDate = 8;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return false when date = 07.03.22 and paymentDate = 6", () => {
    let today = new Date();
    today.setFullYear(2022, 2, 7);
    let currentPaymentDate = 6;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(false);
  });

  it("if checkPaymentDate will return false when date = 07.03.22 and paymentDate = 14", () => {
    let today = new Date();
    today.setFullYear(2022, 2, 7);
    let currentPaymentDate = 14;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(false);
  });

  it("if checkPaymentDate will return true when date = 28.02.24 and paymentDate = 4", () => {
    let today = new Date();
    today.setFullYear(2024, 1, 28);
    let currentPaymentDate = 4;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return false when date = 28.02.24 and paymentDate = 6", () => {
    let today = new Date();
    today.setFullYear(2024, 1, 28);
    let currentPaymentDate = 6;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(false);
  });
});
