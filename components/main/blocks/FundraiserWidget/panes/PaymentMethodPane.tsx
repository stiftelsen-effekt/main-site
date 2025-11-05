import React from "react";
import { EffektCheckbox } from "../../../../shared/components/EffektCheckbox/EffektCheckbox";
import { LinkComponent } from "../../Links/Links";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";
import { Spinner } from "../../../../shared/components/Spinner/Spinner";
import { PaymentMethodSelector } from "../components/PaymentMethodSelector";
import { FormData } from "../hooks/useFundraiserForm";
import styles from "../FundraiserWidget.module.scss";
import Link from "next/link";

interface PaymentMethodPaneProps {
  formData: Pick<
    FormData,
    "taxDeduction" | "newsletter" | "email" | "ssn" | "paymentMethod" | "privacyPolicyAccepted"
  >;
  onChange: (field: keyof FormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  config: {
    tax_deduction?: {
      label: string;
      tooltip_text: string;
      ssn_label: string;
    } | null;
    newsletter?: {
      label: string;
    } | null;
    email_label: string;
    privacy_policy: {
      text: string;
      require_checkbox?: boolean;
      required_error_text?: string;
    };
    payment_methods: Array<{
      _type: string;
      selector_text: string | null;
      single_button_text: string | null;
      recurring_button_text: string | null;
      button_text: string | null;
    }>;
  };
  privacyPolicyUrl: NavLink;
  className?: string;
  visible?: boolean;
  privacyPolicyError?: boolean;
}

export const PaymentMethodPane = React.forwardRef<HTMLDivElement, PaymentMethodPaneProps>(
  (
    {
      formData,
      onChange,
      onSubmit,
      loading,
      config,
      privacyPolicyUrl,
      className,
      visible,
      privacyPolicyError,
    },
    ref,
  ) => {
    const getButtonText = () => {
      const method = config.payment_methods.find((m) => {
        const paymentMethodType = formData.paymentMethod;
        if (paymentMethodType === "bank") return m._type === "bank";
        if (paymentMethodType === "vipps") return m._type === "vipps";
        if (paymentMethodType === "quickpay_card") return m._type === "quickpay_card";
        if (paymentMethodType === "quickpay_mobilepay") return m._type === "quickpay_mobilepay";
        if (paymentMethodType === "dkbank") return m._type === "dkbank";
        return false;
      });

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
            onSubmit();
          }}
        >
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

          {(formData.taxDeduction || formData.newsletter) && (
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
          )}
          {formData.taxDeduction && config.tax_deduction && (
            <div className={styles["donation-widget__input-group"]}>
              <input
                id="ssn"
                name="ssn"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.ssn}
                onChange={(e) => onChange("ssn", e.target.value)}
                required={formData.taxDeduction}
                placeholder={config.tax_deduction.ssn_label}
                autoComplete="off"
                data-cy="fundraiser-ssn-input"
              />
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            {config.privacy_policy.require_checkbox ? (
              <>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
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
                  <Link
                    href={`/${privacyPolicyUrl.slug}`}
                    target="_blank"
                    style={{
                      marginLeft: "7px",
                      marginTop: "5px",
                    }}
                  >
                    {` ${privacyPolicyUrl.title} ↗`}
                  </Link>
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
                <Link href={`/${privacyPolicyUrl.slug}`} target="_blank">
                  {` ${privacyPolicyUrl.title} ↗`}
                </Link>
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
