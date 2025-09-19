import React, { useState, useEffect, ChangeEvent, FormEvent, ReactNode } from "react";
import styles from "./DKMembershipWidget.module.scss";
import { validateCpr, formatCprInput, CprValidationResult } from "../../../../util/tin-validation";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { Dkmembershipwidget } from "../../../../studio/sanity.types";
import { MembershipCountrySelector } from "./CountrySelector";
import styled from "styled-components";
import {
  NotificationWrapper,
  NotificationContent,
  NotificationIcon,
  NotificationMessage,
  NotificationCloseButton,
} from "../../../shared/components/Widget/components/shared/ApiErrorNotification/ApiErrorNotification.style";
import { X, AlertCircle } from "react-feather";
import AnimateHeight from "react-animate-height";

// --- Helper Functions ---

const MembershipNotificationWrapper = styled(NotificationWrapper)`
  width: 100%;
  max-width: 36rem;
  margin: 0 auto 1.5rem;
`;

const MembershipNotificationContent = styled(NotificationContent)`
  background: var(--secondary);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 12px;
  padding: 18px 24px;
  gap: 16px;
  align-items: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
`;

const MembershipNotificationIcon = styled(NotificationIcon)`
  color: var(--primary);
  padding: 0;
  margin-top: 2px;

  svg {
    stroke-width: 1.5;
  }
`;

const MembershipNotificationMessage = styled(NotificationMessage)`
  margin-top: 0;
  font-family: "ESKlarheitGrotesk", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: pre-line;

  a {
    color: var(--primary);
    text-decoration: underline;
  }
`;

const MembershipNotificationCloseButton = styled(NotificationCloseButton)`
  color: var(--primary);
  padding: 4px;
  border-radius: 999px;

  &:hover,
  &:focus-visible {
    background: rgba(0, 0, 0, 0.06);
  }
`;

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
  const defaultConfig: ConfigurationType & { failed_submission_message: string } = {
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
    failed_submission_message:
      "Der skete en uventet fejl. Prøv igen, og kontakt os på info@giveffektivt.dk, hvis problemet fortsætter.",
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
  const [apiError, setApiError] = useState<string | null>(null);

  const renderErrorMessage = (): ReactNode => {
    return (
      <React.Fragment key={`api-error-text`}>
        {defaultConfig.failed_submission_message}
      </React.Fragment>
    );
  };

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
    if (apiError) {
      setApiError(null);
    }
  };

  const handleCprChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    let formattedCpr = "";
    if (isDenmarkSelected) {
      formattedCpr = formatCprInput(value);
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
        setApiError(mergedTexts.failed_submission_message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Network or other error:", error);
      setApiError(mergedTexts.failed_submission_message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      <AnimateHeight height={apiError ? "auto" : 0} duration={300} animateOpacity>
        <MembershipNotificationWrapper data-cy="api-error-notification">
          <MembershipNotificationContent role="alert" aria-live="assertive">
            <MembershipNotificationIcon aria-hidden="true">
              <AlertCircle size={24} />
            </MembershipNotificationIcon>
            <MembershipNotificationMessage>{apiError}</MembershipNotificationMessage>
            <MembershipNotificationCloseButton
              type="button"
              onClick={() => setApiError(null)}
              aria-label="Luk fejlbesked"
            >
              <X size={24} />
            </MembershipNotificationCloseButton>
          </MembershipNotificationContent>
        </MembershipNotificationWrapper>
      </AnimateHeight>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <MembershipCountrySelector
            country={formData.country}
            onChange={(country) => setFormData((prev) => ({ ...prev, country: country }))}
            countryLabel={mergedTexts.country_label}
            data-cy="country-selector"
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
            data-cy="name-input"
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
            data-cy="email-input"
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
            data-cy="address-input"
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
            data-cy="postcode-input"
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
            data-cy="city-input"
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
            pattern={
              isDenmarkSelected
                ? cprValidation && cprValidation.isValid === false
                  ? "a^" // impossible pattern to fail validation for invalid CPR
                  : "\\d{6}-\\d{4}"
                : undefined
            }
            title={
              isDenmarkSelected
                ? cprValidation && cprValidation.isValid === false
                  ? mergedTexts.cpr_invalid_message
                  : "Format: DDMMYY-SSSS"
                : undefined
            }
            data-cy="tin-input"
            required={true}
          />
          {cprValidation && cprValidation.isValid === false && (
            <div data-cy="cpr-invalid-message" className={styles.warningMessage}>
              {mergedTexts.cpr_invalid_message}
            </div>
          )}
          {cprValidation && cprValidation.isSuspicious && (
            <div data-cy="cpr-suspicious-message" className={styles.warningMessage}>
              {mergedTexts.cpr_suspicious_message}
            </div>
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
              data-cy="birthday-input"
              lang="no-NB"
            />
          </div>
        )}

        <EffektButton
          disabled={loading}
          type="submit"
          className={styles.submitButton}
          data-cy="submit-button"
        >
          {loading ? (
            <Spinner className={styles.submitSpinner} data-cy="submit-spinner" />
          ) : (
            mergedTexts.membership_fee_text
          )}
        </EffektButton>
      </form>
    </div>
  );
};
