export interface CprValidationResult {
  isValid: boolean;
  isSuspicious: boolean;
  message?: string;
}

export interface TinValidationResult extends CprValidationResult {
  type?: "CPR" | "CVR";
}

const getCprDateParts = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 6) return null;
  const dd = parseInt(digits.slice(0, 2), 10);
  const mm = parseInt(digits.slice(2, 4), 10);
  const yy = parseInt(digits.slice(4, 6), 10);
  return { dd, mm, yy };
};

const isPlausibleCprDate = (value: string): boolean => {
  const parts = getCprDateParts(value);
  if (!parts) return false;
  const { dd, mm } = parts;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  return true;
};

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

  const digits = tin.replace("-", "");
  const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(digits.charAt(i), 10) * weights[i];
  }

  return sum % 11 === 0;
};

export const validateCpr = (cpr: string): CprValidationResult => {
  const digitsOnly = cpr.replace(/-/g, "");
  if (!/^\d{10}$/.test(digitsOnly)) {
    return { isValid: false, isSuspicious: false, message: "CPR must be 10 digits." };
  }

  if (!isPlausibleCprDate(digitsOnly)) {
    return { isValid: false, isSuspicious: false, message: "CPR date is invalid." };
  }

  const normalized = `${digitsOnly.slice(0, 6)}-${digitsOnly.slice(6, 10)}`;
  if (cprChecksumTest(normalized)) {
    return { isValid: true, isSuspicious: false };
  }

  return { isValid: true, isSuspicious: true, message: "Suspicious CPR number." };
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

const CVR_MOD11_WEIGHTS = [2, 7, 6, 5, 4, 3, 2] as const;

export const cvrChecksumTest = (input: string): boolean => {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  if (!/^\d{8}$/.test(digits)) return false;

  const serial = digits
    .slice(0, 7)
    .split("")
    .map((d) => parseInt(d, 10));
  const expectedCheck = parseInt(digits[7], 10);

  const weightedSum = serial.reduce((acc, digit, idx) => acc + digit * CVR_MOD11_WEIGHTS[idx], 0);
  const mod = weightedSum % 11;
  const actualCheck = mod === 0 ? 0 : 11 - mod;

  return actualCheck === expectedCheck;
};

export const validateCvr = (cvr: string): TinValidationResult => {
  const digits = cvr.replace(/\D/g, "");
  if (!/^\d{8}$/.test(digits)) {
    return { isValid: false, isSuspicious: false, message: "CVR must be 8 digits." };
  }
  if (cvrChecksumTest(cvr)) {
    return { isValid: true, isSuspicious: false, type: "CVR" };
  }
  return { isValid: false, isSuspicious: true, message: "Suspicious CVR number.", type: "CVR" };
};

export type TinOptions = {
  allowCvr?: boolean;
};

export const validateTin = (input: string, opts: TinOptions = {}): TinValidationResult => {
  const { allowCvr = false } = opts;
  const digits = input.replace(/\D/g, "");

  if (digits.length >= 10) {
    const cpred = `${digits.slice(0, 6)}-${digits.slice(6, 10)}`;
    const res = validateCpr(cpred);
    return { ...res, type: "CPR" };
  }

  if (allowCvr && digits.length === 8) {
    return validateCvr(digits);
  }

  if (allowCvr) {
    return {
      isValid: false,
      isSuspicious: false,
      message: "Enter 10 digits for CPR or 8 digits for CVR.",
    };
  } else {
    return {
      isValid: false,
      isSuspicious: false,
      message: "CPR must be 10 digits.",
    };
  }
};

export const formatTinInput = (value: string, opts: TinOptions = {}): string => {
  const { allowCvr = false } = opts;
  const digits = value.replace(/\D/g, "");

  if (!allowCvr) {
    return formatCprInput(value);
  }

  if (digits.length >= 10) {
    const first = digits.substring(0, 6);
    const last = digits.substring(6, 10);
    return `${first}-${last}`;
  }

  return digits;
};

export const finalizeTinFormat = (value: string, opts: TinOptions = {}): string => {
  const { allowCvr = false } = opts;
  const digits = value.replace(/\D/g, "");

  if (digits.length >= 10) {
    return `${digits.slice(0, 6)}-${digits.slice(6, 10)}`;
  }
  if (allowCvr && digits.length === 8) {
    return digits;
  }
  return digits;
};
