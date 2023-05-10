/**
 * Gets the number of days in a month in a year
 * @param {number} month - The month to check number of days of, january = 1
 * @param {number} year - The year to check days of month
 * @returns {number} The number of days in given month in given year
 */
export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

/**
 * Checks if paymentdate is within 6 days from now
 * @param {Date} today - Todays date
 * @param {number} currentPaymentDate - The paymentDate registered on agreement
 * @returns {boolean} true if paymentdate is within 6 days from today, false if not
 */
export function checkPaymentDate(today: Date, currentPaymentDate: number) {
  let paymentDate;
  let daysMonth: number = daysInMonth(today.getMonth() + 1, today.getFullYear());
  let todaysDate = today.getDate();
  if (currentPaymentDate == 0) {
    paymentDate = daysMonth;
  } else {
    paymentDate = currentPaymentDate;
  }

  let daysBetween = paymentDate - todaysDate;
  if (daysBetween >= 0) {
    return daysBetween <= 6 ? true : false;
  } else {
    return daysMonth - todaysDate + paymentDate <= 6 ? true : false;
  }
}
