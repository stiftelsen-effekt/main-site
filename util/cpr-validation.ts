export interface CprValidationResult {
  isValid: boolean;
  isSuspicious: boolean;
  message?: string;
}

export const cprChecksumTest = (tin: string): boolean => {
  if (tin.length !== 11) {
    return false;
  }

  const cprRegex = /^(\d{2})(\d{2})(\d{2})-\d{4}$/;
  const match = tin.match(cprRegex);
  if (!match) {
    return false;
  }

  const day = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const year = Number.parseInt(match[3], 10);

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return false;
  }

  tin = tin.replace("-", "");
  const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(tin.charAt(i), 10) * weights[i];
  }

  return sum % 11 === 0;
};

export const validateCpr = (cpr: string): CprValidationResult => {
  if (cprChecksumTest(cpr)) {
    return { isValid: true, isSuspicious: false };
  }

  const cleanedCpr = cpr.replace(/-/g, "");
  if (!/^\d{10}$/.test(cleanedCpr)) {
    return { isValid: false, isSuspicious: false, message: "CPR must be 10 digits." };
  }

  return { isValid: false, isSuspicious: true, message: "Suspicious CPR number." };
};

export const formatCprInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  let formattedCpr = "";
  if (digits.length > 0) {
    formattedCpr = digits.substring(0, Math.min(6, digits.length));
  }
  if (digits.length > 6) {
    formattedCpr += "-" + digits.substring(6, Math.min(10, digits.length));
  }

  return formattedCpr;
};
