const months = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

export const dayMs = 86400000;
const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();

// Checks if the due date of a charge is at least three days ahead of today
export function isThreeDaysAfterToday(dueDate: Date, todayDate: Date = new Date()): boolean {
  const dd = dueDate.getDate();
  const mm = dueDate.getMonth();
  const yyyy = dueDate.getFullYear();

  const futureDate = new Date(yyyy, mm, dd);
  const timeDifference = futureDate.getTime() - todayDate.getTime();
  const daysAhead = timeDifference / (1000 * 3600 * 24);

  if (daysAhead <= 3) return false;
  return true;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("no-NB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateText(date: Date): string {
  return `${date.getDate()}. ${months[date.getMonth()]}`;
}

export function isIrregularChargeDay(
  selectedChargeDay: number,
  todayDate: Date = new Date(),
): boolean {
  const chargeDateThisMonth = new Date(thisYear, thisMonth, selectedChargeDay);

  const chargeDateNextMonth = new Date(thisYear, thisMonth + 1, selectedChargeDay);

  if (selectedChargeDay === todayDate.getDate()) return false;

  if (isThreeDaysAfterToday(chargeDateThisMonth)) {
    return false;
  }

  if (!isThreeDaysAfterToday(chargeDateThisMonth) && selectedChargeDay > todayDate.getDate()) {
    return true;
  }

  if (!isThreeDaysAfterToday(chargeDateNextMonth)) return true;

  return false;
}

export function getNextChargeDate(newChargeDay: number, initialCharge: boolean): Date {
  const todayDate = new Date();

  // Gets the last day of this month
  if (newChargeDay === 0) {
    newChargeDay = new Date(thisYear, thisMonth + 1, 0).getDate();
  }

  if (initialCharge) return todayDate;
  if (newChargeDay === new Date().getDate()) return todayDate;

  const newChargeDateThisMonth = new Date(thisYear, thisMonth, newChargeDay);
  const newChargeDateNextMonth = new Date(thisYear, thisMonth + 1, newChargeDay);
  const newChargeDateFurtherNextMonth = new Date(thisYear, thisMonth + 2, newChargeDay);

  if (isThreeDaysAfterToday(newChargeDateThisMonth)) {
    return newChargeDateThisMonth;
  }

  if (isThreeDaysAfterToday(newChargeDateNextMonth)) {
    return newChargeDateNextMonth;
  }

  return newChargeDateFurtherNextMonth;
}

export function showCheckBox(selectedChargeDay: number, todayDate: Date = new Date()): boolean {
  // Gets the last day of this month
  if (selectedChargeDay === 0) {
    selectedChargeDay = new Date(thisYear, thisMonth + 1, 0).getDate();
  }

  const chargeDateThisMonth = new Date(thisYear, thisMonth, selectedChargeDay);
  const chargeDateNextMonth = new Date(thisYear, thisMonth + 1, selectedChargeDay);

  if (selectedChargeDay === todayDate.getDate()) return false;

  if (isThreeDaysAfterToday(chargeDateThisMonth)) {
    return false;
  }

  if (!isThreeDaysAfterToday(chargeDateThisMonth) || !isThreeDaysAfterToday(chargeDateNextMonth)) {
    return true;
  }

  return false;
}
