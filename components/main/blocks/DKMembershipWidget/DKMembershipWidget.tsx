import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./DKMembershipWidget.module.scss";
import { cprChecksumTest } from "./_util";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { Dkmembershipwidget } from "../../../../studio/sanity.types";
import { MembershipCountrySelector } from "./CountrySelector";

// --- Helper Functions ---
// Basic CPR validation (can be expanded with checksum logic)
interface CprValidationResult {
  isValid: boolean;
  isSuspicious: boolean;
  message?: string;
}

const validateCpr = (cpr: string): CprValidationResult => {
  if (cprChecksumTest(cpr)) {
    return { isValid: true, isSuspicious: false };
  }

  const cleanedCpr = cpr.replace(/-/g, "");
  if (!/^\d{10}$/.test(cleanedCpr)) {
    return { isValid: false, isSuspicious: false, message: "CPR must be 10 digits." };
  }

  return { isValid: false, isSuspicious: true, message: "Suspicious CPR number." };
};

interface MembershipFormData {
  country: string;
  name: string;
  email: string;
  address: string;
  postcode: string;
  city: string;
  tin: string; // Tax Identification Number (CPR for Denmark)
  birthday: string; // YYYY-MM-DD, only if country is not Denmark
}

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_EFFEKT_API}/api/membership`;

type ConfigurationType = Required<Dkmembershipwidget>["configuration"];

export const DKMembershipWidget: React.FC<{ config?: ConfigurationType }> = ({ config }) => {
  const defaultConfig: ConfigurationType = {
    country_label: "Country",
    name_label: "Full name",
    email_label: "Email (for receipt)",
    address_label: "Address",
    postcode_label: "Postcode",
    city_label: "City",
    tin_label: "Tax ID",
    tin_denmark_label: "CPR (Tax ID for Denmark)",
    birthday_label: "Birthday (yyyy-mm-dd)",
    submit_button_text: "Submit Membership",
    cpr_suspicious_message: "Kontroller venligst at det er korrekt.",
    cpr_invalid_message: "Invalid CPR number. Please check.",
    field_required_message: "This field is required.",
    submitting_message: "Submitting...",
    membership_fee_text: "Become a member for 50 DKK",
  };

  const mergedTexts = { ...defaultConfig, ...config };

  const [formData, setFormData] = useState<MembershipFormData>({
    country: "Denmark",
    name: "",
    email: "",
    address: "",
    postcode: "",
    city: "",
    tin: "",
    birthday: "",
  });

  const [cprValidation, setCprValidation] = useState<CprValidationResult | null>(null);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof MembershipFormData, string> & { _general: string }>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const isDenmarkSelected = /^(denmark|danmark)$/i.test(formData.country.trim());
  const showBirthdayField = !isDenmarkSelected;

  useEffect(() => {
    // Clear TIN and Birthday if country changes to/from Denmark
    if (isDenmarkSelected) {
      setFormData((prev) => ({ ...prev, birthday: "" }));
    } else {
      setFormData((prev) => ({ ...prev, tin: "" }));
      setCprValidation(null);
    }
  }, [isDenmarkSelected]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof MembershipFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCprChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const digits = value.replace(/\D/g, "");

    let formattedCpr = "";
    if (isDenmarkSelected) {
      if (digits.length > 0) {
        formattedCpr = digits.substring(0, Math.min(6, digits.length));
      }
      if (digits.length > 6) {
        formattedCpr += "-" + digits.substring(6, Math.min(10, digits.length));
      }
    } else {
      formattedCpr = value;
    }

    setFormData((prev) => ({ ...prev, tin: formattedCpr }));

    const finalDigits = formattedCpr.replace(/-/g, "");
    if (finalDigits.length === 10) {
      const validationResult = validateCpr(formattedCpr);
      setCprValidation(validationResult);
    } else if (finalDigits.length > 0) {
      // Clear if not yet 10 digits but user is typing
      setCprValidation(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const payload: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      postcode: formData.postcode.trim(),
      city: formData.city.trim(),
      country: /^(denmark|danmark)$/i.test(formData.country.trim())
        ? "Denmark"
        : formData.country.trim(),
      tin: formData.tin.trim(),
      birthday: formData.birthday.trim(),
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.redirect) {
          // Keep the loading spinner while redirecting
          window.open(responseData.redirect, "_self");
        } else {
          console.log(
            "Membership submitted successfully, but no redirect URL provided.",
            responseData,
          );
          console.error("Unexpected response format:", responseData);
          setLoading(false);
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Submission failed with status: " + response.status }));
        console.error("Submission error:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Network or other error:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <MembershipCountrySelector
            country={formData.country}
            onChange={(country) => setFormData((prev) => ({ ...prev, country: country }))}
            countryLabel={mergedTexts.country_label}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={mergedTexts.name_label}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={mergedTexts.email_label}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={mergedTexts.address_label}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            placeholder={mergedTexts.postcode_label}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder={mergedTexts.city_label}
            required
          />
        </div>

        <div className={styles.formGroup}>
          {/**
           * If the country is Denmark, we use CPR (CPR number) as TIN.
           * We can set a pattern that is impossible to match if the
           * manual CPR validation variable is set to false, and a message
           * to inform the user that the CPR number is invalid
           */}
          <input
            type="text"
            id="tin"
            name="tin"
            value={formData.tin}
            onChange={handleCprChange}
            placeholder={isDenmarkSelected ? mergedTexts.tin_denmark_label : mergedTexts.tin_label}
            maxLength={isDenmarkSelected ? 12 : undefined}
            pattern={isDenmarkSelected ? "\\d{6}-\\d{4}" : undefined}
            title={isDenmarkSelected ? "Format: DDMMYY-SSSS" : undefined}
            required={true}
          />
          {cprValidation && cprValidation.isSuspicious && (
            <div className={styles.warningMessage}>{mergedTexts.cpr_suspicious_message}</div>
          )}
        </div>

        {showBirthdayField && (
          <div className={styles.formGroup}>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              placeholder="YYYY-MM-DD"
              maxLength={10}
              required={showBirthdayField}
              lang="no-NB"
            />
          </div>
        )}

        <EffektButton disabled={loading} type="submit" className={styles.submitButton}>
          {loading ? <Spinner className={styles.submitSpinner} /> : mergedTexts.membership_fee_text}
        </EffektButton>
      </form>
    </div>
  );
};
