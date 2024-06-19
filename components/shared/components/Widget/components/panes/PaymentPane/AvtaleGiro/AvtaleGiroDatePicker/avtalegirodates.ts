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
const processingDays = 10;

// Checks if the due date of a charge is at least three days ahead of today
export function hasTimeToProcess(dueDate: Date, todayDate: Date = new Date()): boolean {
  const dd = dueDate.getDate();
  const mm = dueDate.getMonth();
  const yyyy = dueDate.getFullYear();

  const futureDate = new Date(yyyy, mm, dd);
  const timeDifference = futureDate.getTime() - todayDate.getTime();
  const daysAhead = timeDifference / (1000 * 3600 * 24);

  if (daysAhead <= processingDays) return false;
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

export function formatChargeDay(chargeDay: number): string {
  if (chargeDay === 0) {
    return "Du vil trekkes den siste dagen hver måned";
  }
  return `Månedlig trekkdag blir den ${chargeDay}. hver måned`;
}

export function getEarliestPossibleChargeDate(): number {
  const today = new Date().getDate();
  const earliest = new Date();

  earliest.setDate(today + processingDays + 1);

  if (earliest.getDate() > 28) {
    // Return chargeday 0 if next charge date is after the 28th
    return 0;
  }

  return earliest.getDate();
}

export function isIrregularChargeDay(
  selectedChargeDay: number,
  todayDate: Date = new Date(),
): boolean {
  const chargeDateThisMonth = new Date(thisYear, thisMonth, selectedChargeDay);

  const chargeDateNextMonth = new Date(thisYear, thisMonth + 1, selectedChargeDay);

  if (selectedChargeDay === todayDate.getDate()) return false;

  if (hasTimeToProcess(chargeDateThisMonth)) {
    return false;
  }

  if (!hasTimeToProcess(chargeDateThisMonth) && selectedChargeDay > todayDate.getDate()) {
    return true;
  }

  if (!hasTimeToProcess(chargeDateNextMonth)) return true;

  return false;
}

export function getNextChargeDate(newChargeDay: number): Date {
  // Gets the last day of this month
  if (newChargeDay === 0) {
    newChargeDay = new Date(thisYear, thisMonth + 1, 0).getDate();
  }

  const newChargeDateThisMonth = new Date(thisYear, thisMonth, newChargeDay);
  const newChargeDateNextMonth = new Date(thisYear, thisMonth + 1, newChargeDay);
  const newChargeDateFurtherNextMonth = new Date(thisYear, thisMonth + 2, newChargeDay);

  if (hasTimeToProcess(newChargeDateThisMonth)) {
    return newChargeDateThisMonth;
  }

  if (hasTimeToProcess(newChargeDateNextMonth)) {
    return newChargeDateNextMonth;
  }

  return newChargeDateFurtherNextMonth;
}
