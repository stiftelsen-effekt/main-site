import React, { useState, useRef, useEffect } from "react";
import ReactAnimateHeight from "react-animate-height";
import styles from "./FundraiserWidget.module.scss";
import { useElementHeight } from "../../../../hooks/useElementHeight";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { FundraiserOrganizationInfo } from "../FundraiserOrganizationInfo/FundraiserOrganizationInfo";
import AnimateHeight from "react-animate-height";

// Types for the component props
interface TextsProps {
  header: string;
  donationAmountLabel: string;
  nameLabel: string;
  messageLabel: string;
  showNameLabel: string;
  emailLabel: string;
  ssnLabel: string;
  anonymousDonationLabel: string;
  taxDeductionLabel: string;
  newsletterLabel: string;
  privacyPolicyText: string;
  privacyPolicyUrl: string;
  payWithBankLabel: string;
  payWithVippsLabel: string;
  nextButtonText: string;
  bankButtonText: string;
  transferCompletedText: string;
  bankTransferInfo: string;
  accountNumberPrefix: string;
  accountNumber: string;
  kidPrefix: string;
  kidNumber: string;
  transferDelayText: string;
  accountOwnerText: string;
}

interface FormData {
  amount: string;
  name: string;
  message: string;
  showName: boolean;
  email: string;
  ssn: string;
  anonymous: boolean;
  taxDeduction: boolean;
  newsletter: boolean;
  paymentMethod: "bank" | "vipps";
}

interface DonationWidgetProps {
  texts?: Partial<TextsProps>;
  onComplete?: (formData: FormData) => void;
  organizationInfo: {
    name: string;
    logo: SanityImageObject;
    textTemplate: string;
    organizationSlug: string;
  };
}

interface TransitionState {
  activePane: number;
  enteringPane: number | null;
  exitingPane: number | null;
  direction: "forward" | "backward";
}

const DonationWidget: React.FC<DonationWidgetProps> = ({
  texts = {},
  organizationInfo,
  onComplete = () => {},
}) => {
  // Default texts with fallbacks
  const defaultTexts: TextsProps = {
    header: "Gi til innsamling",
    donationAmountLabel: "Sum",
    nameLabel: "Navn",
    messageLabel: "Melding",
    showNameLabel: "Vis navnet mitt på siden",
    emailLabel: "E-post",
    ssnLabel: "Fødsels- eller organisasjonsnummer",
    anonymousDonationLabel: "Doner anonymt",
    taxDeductionLabel: "Jeg ønsker skattefradrag",
    newsletterLabel: "Jeg ønsker å melde meg på nyhetsbrevet",
    privacyPolicyText: "Her finner du vår personvernserklæring",
    privacyPolicyUrl: "#",
    payWithBankLabel: "Gi med bank",
    payWithVippsLabel: "Gi med Vipps",
    nextButtonText: "Neste",
    bankButtonText: "Gi med bank",
    transferCompletedText: "Jeg har satt opp en overføring",
    bankTransferInfo: "Du kan nå overføre til innsamlingen",
    accountNumberPrefix: "Kontonr:",
    accountNumber: "1506 29 95960",
    kidPrefix: "KID:",
    kidNumber: "34944223",
    transferDelayText: "Det kan ta opp til X dager før donasjoner gjennom bank dukker opp.",
    accountOwnerText:
      "Merk: Kontoen eies av Effektiv Altruisme Norge som samarbeider om driften av Gi Effektivt.",
  };

  // Merge default texts with provided texts
  const mergedTexts = { ...defaultTexts, ...texts };

  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    name: "",
    message: "",
    showName: false,
    email: "",
    ssn: "",
    anonymous: false,
    taxDeduction: false,
    newsletter: false,
    paymentMethod: "bank",
  });

  const [paneTransition, setPaneTransition] = useState<TransitionState>({
    activePane: 0,
    enteringPane: null,
    exitingPane: null,
    direction: "forward",
  });

  const paneRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const paneHeights = paneRefs.map((ref) => useElementHeight(ref));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const goToNextStep = (): void => {
    // Start transition animation - keep both panes visible
    setPaneTransition({
      activePane: step,
      enteringPane: step + 1,
      exitingPane: step,
      direction: "forward",
    });

    // After animation fully completes, clean up the transition state
    setTimeout(() => {
      setStep(step + 1);
      setPaneTransition({
        activePane: step + 1,
        enteringPane: null,
        exitingPane: null,
        direction: "forward",
      });
    }, 50);
  };

  const goToPreviousStep = (): void => {
    // Start transition animation
    setPaneTransition({
      activePane: step,
      enteringPane: step - 1,
      exitingPane: step,
      direction: "backward",
    });

    // After animation completes, update the active pane
    setTimeout(() => {
      setStep(step - 1);
      setPaneTransition({
        activePane: step - 1,
        enteringPane: null,
        exitingPane: null,
        direction: "backward",
      });
    }, 50);
  };

  const getPaneClassName = (paneIndex: number): string => {
    // Base class for the pane
    const baseClass = styles["donation-widget__pane"];

    // Determine the state of this pane (entering, exiting, active)
    let stateClass = "";

    if (paneTransition.enteringPane === paneIndex) {
      stateClass = styles[`donation-widget__pane--entering-${paneTransition.direction}`];
    } else if (paneTransition.exitingPane === paneIndex) {
      stateClass = styles[`donation-widget__pane--exiting-${paneTransition.direction}`];
    } else if (step === paneIndex) {
      stateClass = styles["donation-widget__pane--active"];
    }

    return `${baseClass} ${stateClass}`;
  };

  const isPaneVisible = (paneIndex: number): boolean => {
    return (
      step === paneIndex ||
      paneTransition.enteringPane === paneIndex ||
      paneTransition.exitingPane === paneIndex
    );
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (formData.paymentMethod === "vipps") {
      // For Vipps, complete immediately
      onComplete(formData);
    } else {
      // For bank, show the final pane
      goToNextStep();
    }
  };

  const handleTransferConfirmation = (): void => {
    onComplete(formData);
  };

  // Determine current height based on active pane
  const currentHeight = paneHeights[paneTransition.activePane] || "auto";

  // Parse templated text by replacing tokens with values from formData
  const parseTemplate = (template: string): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      if (key === "accountNumber") return mergedTexts.accountNumber;
      if (key === "KID") return mergedTexts.kidNumber;
      return match;
    });
  };

  return (
    <div className={styles["donation-widget"]}>
      <button
        className={styles["donation-widget__back-button"]}
        onClick={goToPreviousStep}
        aria-label="Go back"
        style={{
          transform: `translateX(${step === 0 ? "-0.5rem" : "0"})`,
          opacity: step === 0 ? 0 : 1,
        }}
      >
        ←
      </button>

      <ReactAnimateHeight
        duration={300}
        height={currentHeight}
        className={styles["donation-widget__panes"]}
      >
        {/* Pane 1: Initial Donation Form */}
        <div
          ref={paneRefs[0]}
          className={getPaneClassName(0)}
          style={{ display: isPaneVisible(0) ? "block" : "none" }}
        >
          <FundraiserOrganizationInfo
            name={organizationInfo.name}
            logo={organizationInfo.logo}
            textTemplate={organizationInfo.textTemplate}
            organizationSlug={organizationInfo.organizationSlug}
          ></FundraiserOrganizationInfo>
          <button
            type="submit"
            className={styles["donation-widget__button"]}
            onClick={goToNextStep}
          >
            {mergedTexts.header}
          </button>
        </div>

        {/* Pane 2: Additional Information */}
        <div
          ref={paneRefs[1]}
          className={getPaneClassName(1)}
          style={{ display: isPaneVisible(1) ? "block" : "none" }}
        >
          <form
            className={styles["donation-widget__form"]}
            onSubmit={(e) => {
              e.preventDefault();
              goToNextStep();
            }}
          >
            <div className={styles["donation-widget__input-group"]}>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder={mergedTexts.donationAmountLabel}
                required
              />
            </div>

            <div className={styles["donation-widget__input-group"]}>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={mergedTexts.nameLabel}
                required={!formData.anonymous}
              />
            </div>

            <div className={styles["donation-widget__input-group"]}>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                placeholder={mergedTexts.messageLabel}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles["donation-widget__checkbox-group"]}>
              <input
                id="showName"
                name="showName"
                type="checkbox"
                checked={formData.showName}
                onChange={handleInputChange}
              />
              <label htmlFor="showName">{mergedTexts.showNameLabel}</label>
            </div>

            <button type="submit" className={styles["donation-widget__button"]}>
              {mergedTexts.nextButtonText}
            </button>
          </form>
        </div>

        {/* Pane 3: Payment Method Selection */}
        <div
          ref={paneRefs[2]}
          className={getPaneClassName(2)}
          style={{ display: isPaneVisible(2) ? "block" : "none" }}
        >
          <form
            className={styles["donation-widget__form"]}
            onSubmit={(e) => {
              e.preventDefault();
              goToNextStep();
            }}
          >
            <div className={styles["donation-widget__checkbox-group"]}>
              <input
                id="anonymous"
                name="anonymous"
                type="checkbox"
                checked={formData.anonymous}
                onChange={handleInputChange}
              />
              <label htmlFor="anonymous">{mergedTexts.anonymousDonationLabel}</label>
            </div>

            <div className={styles["donation-widget__input-group"]}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required={formData.taxDeduction || formData.newsletter}
                placeholder={mergedTexts.emailLabel}
              />
            </div>

            <div className={styles["donation-widget__checkbox-group"]}>
              <input
                id="taxDeduction"
                name="taxDeduction"
                type="checkbox"
                checked={formData.taxDeduction}
                onChange={handleInputChange}
              />
              <label htmlFor="taxDeduction">{mergedTexts.taxDeductionLabel}</label>
            </div>

            <AnimateHeight
              duration={100}
              height={formData.taxDeduction || formData.newsletter ? "auto" : 0}
            >
              <div className={styles["donation-widget__input-group"]}>
                <input
                  id="ssn"
                  name="ssn"
                  type="ssn"
                  value={formData.ssn}
                  onChange={handleInputChange}
                  required={formData.taxDeduction || formData.newsletter}
                  placeholder={mergedTexts.ssnLabel}
                />
              </div>
            </AnimateHeight>

            <div className={styles["donation-widget__checkbox-group"]}>
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <label htmlFor="newsletter">{mergedTexts.newsletterLabel}</label>
            </div>

            <div className={styles["donation-widget__privacy-link"]}>
              <a href={mergedTexts.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                {mergedTexts.privacyPolicyText} ↗
              </a>
            </div>
            <div className={styles["donation-widget__payment-options"]}>
              <div className={styles["donation-widget__payment-option"]}>
                <input
                  id="bankPayment"
                  name="paymentMethod"
                  type="radio"
                  value="bank"
                  checked={formData.paymentMethod === "bank"}
                  onChange={handleInputChange}
                />
                <label htmlFor="bankPayment">{mergedTexts.payWithBankLabel}</label>
              </div>

              <div className={styles["donation-widget__payment-option"]}>
                <input
                  id="vippsPayment"
                  name="paymentMethod"
                  type="radio"
                  value="vipps"
                  checked={formData.paymentMethod === "vipps"}
                  onChange={handleInputChange}
                />
                <label htmlFor="vippsPayment">{mergedTexts.payWithVippsLabel}</label>
              </div>
            </div>

            <button type="submit" className={styles["donation-widget__button"]}>
              {formData.paymentMethod === "bank"
                ? mergedTexts.bankButtonText
                : mergedTexts.payWithVippsLabel}
            </button>
          </form>
        </div>

        {/* Pane 4: Bank Transfer Information */}
        <div
          ref={paneRefs[3]}
          className={getPaneClassName(3)}
          style={{ display: isPaneVisible(3) ? "block" : "none" }}
        >
          <div className={styles["donation-widget__form"]}>
            <p>{parseTemplate(mergedTexts.bankTransferInfo)}</p>

            <div className={styles["donation-widget__account-info"]}>
              <p>
                <strong>{mergedTexts.accountNumberPrefix}</strong> {mergedTexts.accountNumber}
              </p>
              <p>
                <strong>{mergedTexts.kidPrefix}</strong> {mergedTexts.kidNumber}
              </p>
            </div>

            <p>{parseTemplate(mergedTexts.transferDelayText)}</p>
            <p>{parseTemplate(mergedTexts.accountOwnerText)}</p>

            <button
              className={styles["donation-widget__button"]}
              onClick={handleTransferConfirmation}
            >
              {mergedTexts.transferCompletedText}
            </button>
          </div>
        </div>
      </ReactAnimateHeight>
    </div>
  );
};

export default DonationWidget;
