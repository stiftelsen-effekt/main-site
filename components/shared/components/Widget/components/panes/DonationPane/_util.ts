import { ErrorText } from "./DonationPane";

export const filterErrorTextsForCauseArea = (
  errorTexts: ErrorText[],
  causeAreaId: number,
): ErrorText[] => {
  return errorTexts.filter((errorText) => errorText.error.causeAreaId === causeAreaId);
};
