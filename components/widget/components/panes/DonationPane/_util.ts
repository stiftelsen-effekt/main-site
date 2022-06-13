import { PaymentMethod, RecurringDonation } from "../../../types/Enums";
import { Donation } from "../../../store/state";

export const displayClaimWarning = (donation: Donation): boolean => {
  if (
    donation.method !== PaymentMethod.BANK ||
    donation.recurring !== RecurringDonation.RECURRING
  )
    return false;

  const timeStamp = new Date();
  const today = timeStamp.getDate();
  const daysInMonth = new Date(
    timeStamp.getFullYear(),
    timeStamp.getMonth(),
    0
  ).getDate();

  if (donation.dueDay) {
    if (today + 5 <= 28) {
      if (donation.dueDay - today < 0) return false;
      if (donation.dueDay - today < 5) return true;
      return false;
    }
    if (donation.dueDay > today) return true;
    if (donation.dueDay < today + 5 - daysInMonth) return true;
    return false;
  }
  return false;
};
