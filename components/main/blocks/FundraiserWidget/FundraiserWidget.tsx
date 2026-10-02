import React, { useEffect, useMemo, useState } from "react";
import ReactAnimateHeight from "react-animate-height";
import styles from "./FundraiserWidget.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { FetchFundraiserResult } from "../../../../studio/sanity.types";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { validateWidgetConfig } from "./validateWidgetConfig";
import { useFundraiserForm, FormData } from "./hooks/useFundraiserForm";
import { usePaneTransition } from "./hooks/usePaneTransition";
import { useRegisterDonation } from "./hooks/useRegisterDonation";
import { OrganizationInfoPane } from "./panes/OrganizationInfoPane";
import { DonationDetailsPane } from "./panes/DonationDetailsPane";
import { PaymentMethodPane } from "./panes/PaymentMethodPane";
import { BankTransferPane } from "./panes/BankTransferPane";
import { FormattingLocale } from "../../../../util/formatting";
import { supportsDonationFrequency } from "./paymentMethodAvailability";
import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";

type WidgetConfig = NonNullable<
  NonNullable<FetchFundraiserResult["page"]>["fundraiser_widget_configuration"]
>;

interface DonationWidgetProps {
  widgetConfig: WidgetConfig | null;
  suggestedAmounts?: number[] | null;
  monthlyDonations?: {
    enabled?: boolean;
    single_donation_text?: string;
    monthly_donation_text?: string;
  } | null;
  fundraiserId: string;
  organizationInfo: {
    organizationPageSlug: string;
    textTemplate: string;
    organization: NonNullable<FetchFundraiserResult["page"]>["fundraiser_organization"];
    databaseIds: {
      causeAreaId: number;
      organizationId: number;
    };
  };
  locale: FormattingLocale;
  onComplete?: (formData: FormData) => void;
}

export const FundraiserWidget: React.FC<DonationWidgetProps> = ({
  widgetConfig,
  suggestedAmounts,
  monthlyDonations,
  fundraiserId,
  organizationInfo,
  locale,
  onComplete = () => {},
}) => {
  const { formData, updateField } = useFundraiserForm(
    widgetConfig?.payment_methods?.map((method) => method._type) || [],
    widgetConfig?.tax_deduction_enabled ? widgetConfig?.tax_deduction?.minimum_amount : undefined,
  );
  const {
    step,
    paneRefs,
    currentHeight,
    getPaneClassName,
    isPaneVisible,
    goToNextStep,
    goToPreviousStep,
  } = usePaneTransition(4);
  const { loading, kid, registerDonation } = useRegisterDonation({
    fundraiserId,
    organizationInfo,
    paymentMethods: widgetConfig?.payment_methods || [],
    onSuccess: () => goToNextStep(),
  });
  const [privacyPolicyError, setPrivacyPolicyError] = useState(false);
  const availablePaymentMethods = useMemo(
    () =>
      widgetConfig?.payment_methods?.filter((method) =>
        supportsDonationFrequency(method._type, formData.recurring),
      ) || [],
    [formData.recurring, widgetConfig?.payment_methods],
  );

  useEffect(() => {
    if (
      availablePaymentMethods.length > 0 &&
      !availablePaymentMethods.some((method) => method._type === formData.paymentMethod)
    ) {
      updateField("paymentMethod", availablePaymentMethods[0]._type);
    }
  }, [availablePaymentMethods, formData.paymentMethod, updateField]);

  const validation = validateWidgetConfig(widgetConfig, organizationInfo.organization);
  if (!validation.valid) {
    return validation.error;
  }

  const config = validation.config;
  const hasMonthlyPaymentMethod = config.payment_methods!.some((method) =>
    supportsDonationFrequency(method._type, RecurringDonation.RECURRING),
  );
  const monthlyDonationConfig = monthlyDonations?.enabled
    ? {
        single_donation_text: monthlyDonations.single_donation_text,
        monthly_donation_text: monthlyDonations.monthly_donation_text,
      }
    : undefined;

  if (monthlyDonationConfig && !hasMonthlyPaymentMethod) {
    return "No configured payment method supports monthly donations in the fundraiser widget";
  }

  if (
    monthlyDonationConfig &&
    (!monthlyDonationConfig.single_donation_text || !monthlyDonationConfig.monthly_donation_text)
  ) {
    return "Missing monthly donation labels for fundraiser widget";
  }

  if (availablePaymentMethods.length === 0) {
    return "No payment method supports the selected donation frequency";
  }

  const normalizedSuggestedAmounts = Array.isArray(suggestedAmounts)
    ? suggestedAmounts.filter((amount) => typeof amount === "number" && amount > 0)
    : [];

  const handlePaymentMethodSubmit = () => {
    if (config.privacy_policy?.require_checkbox && !formData.privacyPolicyAccepted) {
      setPrivacyPolicyError(true);
      return;
    }
    setPrivacyPolicyError(false);
    registerDonation(formData);
  };

  return (
    <div className={styles["donation-widget"]} data-cy="fundraiser-widget">
      <button
        className={styles["donation-widget__back-button"]}
        onClick={goToPreviousStep}
        aria-label="Go back"
        data-cy="fundraiser-back-button"
        style={{
          transform: `translateX(${step === 0 ? "-0.5rem" : "0"})`,
          opacity: step === 0 ? 0 : 1,
        }}
      >
        ←
      </button>

      <ReactAnimateHeight
        duration={300}
        height={typeof currentHeight === "number" ? currentHeight : "auto"}
        className={styles["donation-widget__panes"]}
      >
        <div className={styles["donation-widget__inner"]}>
          <OrganizationInfoPane
            ref={paneRefs[0]}
            className={getPaneClassName(0)}
            visible={isPaneVisible(0)}
            organizationInfo={{
              name: organizationInfo.organization!.name!,
              logo: organizationInfo.organization!.logo as SanityImageObject,
              textTemplate: organizationInfo.textTemplate,
              organizationSlug: organizationInfo.organizationPageSlug,
            }}
            buttonText={config.header!}
            onNext={goToNextStep}
          />

          <DonationDetailsPane
            ref={paneRefs[1]}
            className={getPaneClassName(1)}
            visible={isPaneVisible(1)}
            formData={formData}
            onChange={updateField}
            onSubmit={goToNextStep}
            config={{
              suggested_amounts: normalizedSuggestedAmounts,
              currency_symbol: config.currency_symbol!,
              donation_amount_label: config.donation_amount_label!,
              name_label: config.name_label!,
              message_label: config.message_label!,
              show_name_label: config.show_name_label!,
              next_button_text: config.next_button_text!,
              monthly_donations: monthlyDonationConfig as
                | { single_donation_text: string; monthly_donation_text: string }
                | undefined,
            }}
            locale={locale}
          />

          <PaymentMethodPane
            ref={paneRefs[2]}
            className={getPaneClassName(2)}
            visible={isPaneVisible(2)}
            formData={formData}
            onChange={updateField}
            onSubmit={handlePaymentMethodSubmit}
            loading={loading}
            config={{
              tax_deduction:
                config.tax_deduction_enabled && config.tax_deduction
                  ? {
                      label: config.tax_deduction.label!,
                      tooltip_text: config.tax_deduction.tooltip_text!,
                      ssn_label: config.tax_deduction.ssn_label!,
                      ssn_invalid_error_text: config.tax_deduction.ssn_invalid_error_text!,
                      ssn_suspicious_error_text: config.tax_deduction.ssn_suspicious_error_text!,
                    }
                  : undefined,
              newsletter:
                config.newsletter_enabled && config.newsletter
                  ? {
                      label: config.newsletter.label!,
                    }
                  : undefined,
              email_label: config.email_label!,
              privacy_policy: {
                text: config.privacy_policy!.text!,
                require_checkbox: config.privacy_policy!.require_checkbox,
                required_error_text: config.privacy_policy!.required_error_text,
                privacy_policy_url: config.privacy_policy!.privacy_policy_url as NavLink,
              },
              payment_methods: availablePaymentMethods,
              allow_anonymous_donations: config.allow_anonymous_donations!,
            }}
            privacyPolicyError={privacyPolicyError}
            locale={locale}
          />

          <BankTransferPane
            ref={paneRefs[3]}
            className={getPaneClassName(3)}
            visible={isPaneVisible(3)}
            kid={kid}
            showBankInfo={formData.paymentMethod === "bank" || formData.paymentMethod === "dkbank"}
            bankDetails={
              config.bank_account_details
                ? {
                    account_number_prefix: config.bank_account_details.account_number_prefix!,
                    account_number: config.bank_account_details.account_number!,
                    kid_prefix: config.bank_account_details.kid_prefix!,
                    transfer_delay_text: config.bank_account_details.transfer_delay_text!,
                    account_owner_text: config.bank_account_details.account_owner_text!,
                    bank_transfer_info: config.bank_account_details.bank_transfer_info!,
                  }
                : undefined
            }
          />

          <div className={styles["donation-widget__bottom_shade"]}></div>
        </div>
      </ReactAnimateHeight>
    </div>
  );
};
