import React, { useState, useEffect } from "react";
import { EffektCheckbox } from "../../../../shared/components/EffektCheckbox/EffektCheckbox";
import { LinkComponent } from "../../Links/Links";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";
import { Spinner } from "../../../../shared/components/Spinner/Spinner";
import { PaymentMethodSelector } from "../components/PaymentMethodSelector";
import { FormData } from "../hooks/useFundraiserForm";
import styles from "../FundraiserWidget.module.scss";
import Link from "next/link";
import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import Organisationsnummer from "organisationsnummer";
import Personnummer from "personnummer";
import { validateTin, formatTinInput } from "../../../../../util/tin-validation";
import { FormattingLocale } from "../../../../../util/formatting";

interface PaymentMethodPaneProps {
  formData: Pick<
    FormData,
    "taxDeduction" | "newsletter" | "email" | "ssn" | "paymentMethod" | "privacyPolicyAccepted"
  >;
  onChange: (field: keyof FormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  config: {
    allow_anonymous_donations: boolean;
    tax_deduction?: {
      label: string;
      tooltip_text: string;
      ssn_label: string;
      ssn_invalid_error_text: string;
      ssn_suspicious_error_text: string;
    } | null;
    newsletter?: {
      label: string;
    } | null;
    email_label: string;
    privacy_policy: {
      text: string;
      require_checkbox?: boolean;
      required_error_text?: string;
      privacy_policy_url?: NavLink;
    };
    payment_methods: Array<{
      _type: string;
      selector_text: string | null;
      single_button_text: string | null;
      recurring_button_text: string | null;
      button_text: string | null;
    }>;
  };
  className?: string;
  visible?: boolean;
  privacyPolicyError?: boolean;
  locale: FormattingLocale;
}

const validateSsnNo = (ssn: string): boolean => {
  return (ssn.length === 9 && validateOrg(ssn)) || (ssn.length === 11 && validateSsn(ssn));
};

const validateSsnSe = (ssn: string): boolean => {
  return Personnummer.valid(ssn) || Organisationsnummer.valid(ssn);
};

export const PaymentMethodPane = React.forwardRef<HTMLDivElement, PaymentMethodPaneProps>(
  (
    {
      formData,
      onChange,
      onSubmit,
      loading,
      config,
      className,
      visible,
      privacyPolicyError,
      locale,
    },
    ref,
  ) => {
    const [ssnError, setSsnError] = useState<string | null>(null);
    const [cprSuspicious, setCprSuspicious] = useState(false);

    // Clear errors when tax deduction is unchecked
    useEffect(() => {
      if (!formData.taxDeduction) {
        setSsnError(null);
        setCprSuspicious(false);
      }
    }, [formData.taxDeduction]);

    const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      // Format CPR input for Danish locale
      let valueToUse = value;
      console.log("locale", locale);
      if (locale === "da-DK" && formData.taxDeduction) {
        const formattedValue = formatTinInput(value, { allowCvr: true });
        e.target.value = formattedValue;
        valueToUse = formattedValue;
        onChange("ssn", formattedValue);
      } else {
        onChange("ssn", value);
      }

      // Validate SSN based on locale
      const trimmed = valueToUse.trim();
      if (!formData.taxDeduction || trimmed === "") {
        setSsnError(null);
        setCprSuspicious(false);
        return;
      }

      let isValid = true;
      if (locale === "no-NB") {
        isValid = validateSsnNo(trimmed);
      } else if (locale === "sv-SE") {
        isValid = validateSsnSe(trimmed);
      } else if (locale === "da-DK") {
        const validationResult = validateTin(trimmed, { allowCvr: true });
        if (validationResult.type === "CPR") {
          if (validationResult.isSuspicious) {
            setCprSuspicious(true);
            isValid = true; // Allow suspicious CPR but show warning
          } else if (validationResult.isValid && !validationResult.isSuspicious) {
            setCprSuspicious(false);
          }
        } else {
          setCprSuspicious(false);
        }
        isValid = validationResult.isValid;
      }

      setSsnError(isValid ? null : config.tax_deduction?.ssn_invalid_error_text || null);
    };

    const validateSsnOnBlur = () => {
      const trimmed = formData.ssn.trim();
      if (!formData.taxDeduction || trimmed === "") {
        setSsnError(null);
        setCprSuspicious(false);
        return;
      }

      let isValid = true;
      if (locale === "no-NB") {
        isValid = validateSsnNo(trimmed);
      } else if (locale === "sv-SE") {
        isValid = validateSsnSe(trimmed);
      } else if (locale === "da-DK") {
        const validationResult = validateTin(trimmed, { allowCvr: true });
        if (validationResult.type === "CPR") {
          if (validationResult.isSuspicious) {
            setCprSuspicious(true);
            isValid = true;
          } else if (validationResult.isValid && !validationResult.isSuspicious) {
            setCprSuspicious(false);
          }
        } else {
          setCprSuspicious(false);
        }
        isValid = validationResult.isValid;
      }

      setSsnError(isValid ? null : config.tax_deduction?.ssn_invalid_error_text || null);
    };
    const getButtonText = () => {
      return formData.paymentMethod === "bank"
        ? "Gi med bank"
        : formData.paymentMethod === "vipps"
        ? "Gi med Vipps"
        : formData.paymentMethod === "quickpay_card"
        ? "Giv med kort"
        : formData.paymentMethod === "quickpay_mobilepay"
        ? "Giv med MobilePay"
        : formData.paymentMethod === "dkbank"
        ? "Giv med bank"
        : "Gi";
    };

    const emailInput = (
      <div className={styles["donation-widget__input-group"]}>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required={formData.taxDeduction || formData.newsletter}
          placeholder={config.email_label}
          data-cy="fundraiser-email-input"
        />
      </div>
    );

    return (
      <div
        ref={ref}
        className={className}
        style={{ display: visible ? "block" : "none" }}
        data-cy="fundraiser-pane-payment"
      >
        <form
          className={styles["donation-widget__form"]}
          data-cy="fundraiser-payment-form"
          onSubmit={(e) => {
            e.preventDefault();
            // Validate SSN before submission if tax deduction is enabled
            if (formData.taxDeduction && formData.ssn.trim()) {
              const trimmed = formData.ssn.trim();
              let isValid = true;
              if (locale === "no-NB") {
                isValid = validateSsnNo(trimmed);
              } else if (locale === "sv-SE") {
                isValid = validateSsnSe(trimmed);
              } else if (locale === "da-DK") {
                const validationResult = validateTin(trimmed, { allowCvr: true });
                isValid = validationResult.isValid;
              }
              if (!isValid) {
                setSsnError(config.tax_deduction?.ssn_invalid_error_text || null);
                return;
              }
            }
            onSubmit();
          }}
        >
          {!config.allow_anonymous_donations && emailInput}

          {config.tax_deduction && (
            <div className={styles["donation-widget__checkbox-group"]}>
              <EffektCheckbox
                checked={formData.taxDeduction}
                onChange={(checked) => {
                  onChange("taxDeduction", checked);
                }}
                dataCy="fundraiser-tax-deduction"
              >
                {config.tax_deduction.label}
              </EffektCheckbox>
              <span className={styles["donation-widget__checkbox-group__popup-trigger"]}>?</span>{" "}
              <div className={styles["donation-widget__checkbox-group__popup"]}>
                {config.tax_deduction.tooltip_text}
              </div>
            </div>
          )}

          {config.newsletter && (
            <div className={styles["donation-widget__checkbox-group"]}>
              <EffektCheckbox
                checked={formData.newsletter}
                onChange={(checked) => {
                  onChange("newsletter", checked);
                }}
                dataCy="fundraiser-newsletter"
              >
                {config.newsletter.label}
              </EffektCheckbox>
            </div>
          )}

          {(formData.taxDeduction || formData.newsletter) &&
            config.allow_anonymous_donations &&
            emailInput}
          {formData.taxDeduction && config.tax_deduction && (
            <div className={styles["donation-widget__input-group"]}>
              <input
                id="ssn"
                name="ssn"
                type="text"
                inputMode="numeric"
                pattern={locale === "da-DK" ? undefined : "[0-9]*"}
                value={formData.ssn}
                onChange={handleSsnChange}
                onBlur={validateSsnOnBlur}
                required={formData.taxDeduction}
                placeholder={config.tax_deduction.ssn_label}
                autoComplete="off"
                data-cy="fundraiser-ssn-input"
              />
              {ssnError && (
                <div
                  style={{
                    color: "var(--primary)",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {ssnError}
                </div>
              )}
              {cprSuspicious && locale === "da-DK" && (
                <div
                  style={{
                    color: "var(--primary)",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {config.tax_deduction?.ssn_suspicious_error_text}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            {config.privacy_policy.require_checkbox ? (
              <>
                <div className={styles["donation-widget__privacy-checkbox-group"]}>
                  <div className={styles["donation-widget__checkbox-group"]}>
                    <EffektCheckbox
                      checked={formData.privacyPolicyAccepted}
                      onChange={(checked) => {
                        onChange("privacyPolicyAccepted", checked);
                      }}
                      dataCy="fundraiser-privacy-checkbox"
                    >
                      {`${config.privacy_policy.text}`}
                    </EffektCheckbox>
                  </div>
                  {config.privacy_policy.privacy_policy_url && (
                    <Link
                      href={`/${config.privacy_policy.privacy_policy_url.slug}`}
                      target="_blank"
                    >
                      {` ${config.privacy_policy.privacy_policy_url.title} ↗`}
                    </Link>
                  )}
                </div>
                {privacyPolicyError && (
                  <div
                    style={{
                      color: "var(--primary)",
                      fontSize: "14px",
                      marginTop: "5px",
                    }}
                  >
                    {config.privacy_policy.required_error_text}
                  </div>
                )}
              </>
            ) : (
              <div className={styles["donation-widget__privacy-link"]}>
                <span>{config.privacy_policy.text}</span>
                {config.privacy_policy.privacy_policy_url && (
                  <Link href={`/${config.privacy_policy.privacy_policy_url.slug}`} target="_blank">
                    {` ${config.privacy_policy.privacy_policy_url.title} ↗`}
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className={styles["donation-widget__payment-options"]}>
            <PaymentMethodSelector
              methods={config.payment_methods}
              selected={formData.paymentMethod}
              onSelect={(method) => onChange("paymentMethod", method)}
            />
          </div>

          <button
            type="submit"
            className={styles["donation-widget__button"]}
            data-cy="fundraiser-submit-button"
          >
            {loading ? <Spinner className={styles["donation-widget__spinner"]} /> : getButtonText()}
          </button>
        </form>
      </div>
    );
  },
);

PaymentMethodPane.displayName = "PaymentMethodPane";
