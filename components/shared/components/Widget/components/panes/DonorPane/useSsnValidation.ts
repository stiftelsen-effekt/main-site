import { useState, useCallback } from "react";
import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import Organisationsnummer from "organisationsnummer";
import Personnummer from "personnummer";
import { validateTin, formatTinInput } from "../../../../../../../util/tin-validation";

type Locale = "en" | "no" | "sv" | "et" | "dk";

interface UseSsnValidationParams {
  locale: Locale;
  taxDeductionChecked: boolean;
}

interface UseSsnValidationResult {
  validateSsn: (value: string, isAnonymous: boolean) => boolean;
  handleSsnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cprSuspicious: boolean;
}

export function useSsnValidation({
  locale,
  taxDeductionChecked,
}: UseSsnValidationParams): UseSsnValidationResult {
  const [cprSuspicious, setCprSuspicious] = useState(false);

  const validateSsnValue = useCallback(
    (value: string, isAnonymous: boolean): boolean => {
      if (isAnonymous || !taxDeductionChecked) return true;

      const trimmed = value.toString().trim();

      if (locale === "no") {
        return validateSsnNo(trimmed);
      }

      if (locale === "sv") {
        return validateSsnSe(trimmed);
      }

      if (locale === "dk") {
        const validationResult = validateTin(trimmed, { allowCvr: true });
        if (validationResult.type === "CPR") {
          if (validationResult.isSuspicious) {
            setCprSuspicious(true);
            return true;
          } else if (validationResult.isValid && !validationResult.isSuspicious) {
            setCprSuspicious(false);
          }
        } else {
          setCprSuspicious(false);
        }
        return validationResult.isValid;
      }

      return true;
    },
    [locale, taxDeductionChecked],
  );

  const handleSsnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (locale === "dk" && taxDeductionChecked) {
        const formattedValue = formatTinInput(value, { allowCvr: true });
        e.target.value = formattedValue;
      }
    },
    [locale, taxDeductionChecked],
  );

  return {
    validateSsn: validateSsnValue,
    handleSsnChange,
    cprSuspicious,
  };
}

function validateSsnNo(ssn: string): boolean {
  return (ssn.length === 9 && validateOrg(ssn)) || (ssn.length === 11 && validateSsn(ssn));
}

function validateSsnSe(ssn: string): boolean {
  return Personnummer.valid(ssn) || Organisationsnummer.valid(ssn);
}
