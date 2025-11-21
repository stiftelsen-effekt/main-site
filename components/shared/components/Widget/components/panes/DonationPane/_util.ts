import { ErrorText } from "./DonationPane";

export const filterErrorTextsForCauseArea = (
  errorTexts: ErrorText[],
  causeAreaId: string,
): ErrorText[] => {
  return errorTexts.filter((errorText) => errorText.error.causeAreaId === causeAreaId);
};
