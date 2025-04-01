import React, { useState, useRef, useEffect } from "react";
import ReactAnimateHeight from "react-animate-height";
import styles from "./FundraiserWidget.module.scss";
import { useMultipleElementHeights } from "../../../../hooks/useElementHeight";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { FundraiserOrganizationInfo } from "../FundraiserOrganizationInfo/FundraiserOrganizationInfo";
import AnimateHeight from "react-animate-height";
import { EffektCheckbox } from "../../../shared/components/EffektCheckbox/EffektCheckbox";
import { RadioButtonGroup } from "../../../shared/components/RadioButton/RadioButtonGroup";
import { PaymentMethod } from "../../../shared/components/Widget/types/Enums";
import Link from "next/link";
import { API_URL } from "../../../shared/components/Widget/config/api";
import { ANONYMOUS_DONOR } from "../../../shared/components/Widget/config/anonymous-donor";
import { FetchFundraiserResult } from "../../../../studio/sanity.types";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import CharacterCountCircle from "../../../shared/components/CharacterCountCircle/CharacterCountCircle";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { LinkComponent, LinkType } from "../Links/Links";
import { thousandize } from "../../../../util/formatting";
import { NumericFormat } from "react-number-format";
import { values } from "cypress/types/lodash";

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
  payWithBankLabel: string;
  payWithVippsLabel: string;
  nextButtonText: string;
  bankButtonText: string;
  transferCompletedText: string;
  bankTransferInfo: string;
  accountNumberPrefix: string;
  accountNumber: string;
  kidPrefix: string;
  transferDelayText: string;
  accountOwnerText: string;
}

interface FormData {
  amount: string;
  name: string;
  message: string;
  messageSenderName: string;
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
  fundraiserId: number;
  organizationInfo: {
    organizationPageSlug: string;
    textTemplate: string;
    organization: NonNullable<FetchFundraiserResult["page"]>["fundraiser_organization"];
    databaseIds: {
      causeAreaId: number;
      organizationId: number;
    };
  };
  matchingConfig?: FundraiserWidgetMatchingConfig;
  privacyPolicyUrl: NavLink;
  suggestedSums?: number[];
  onSetAmount?: (amount: number) => void;
}

interface TransitionState {
  activePane: number;
  enteringPane: number | null;
  exitingPane: number | null;
  direction: "forward" | "backward";
}

export type FundraiserWidgetMatchingConfig = {
  maxMatching?: number;
  factor: number;
};

const DonationWidget: React.FC<DonationWidgetProps> = ({
  texts = {},
  fundraiserId,
  organizationInfo,
  privacyPolicyUrl,
  suggestedSums = [100, 250, 800],
  matchingConfig,
  onSetAmount,
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
    payWithBankLabel: "Gi med bank",
    payWithVippsLabel: "Gi med Vipps",
    nextButtonText: "Neste",
    bankButtonText: "Gi med bank",
    transferCompletedText: "Jeg har satt opp en overføring",
    bankTransferInfo: "Du kan nå overføre til innsamlingen",
    accountNumberPrefix: "Kontonr:",
    accountNumber: "1506 29 95960",
    kidPrefix: "KID:",
    transferDelayText: "Det kan ta opp til 3 dager før donasjoner gjennom bank prosesseres.",
    accountOwnerText:
      "Merk: Kontoen eies av Effektiv Altruisme Norge som samarbeider om driften av Gi Effektivt.",
  };

  // Merge default texts with provided texts
  const mergedTexts = { ...defaultTexts, ...texts };

  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [kid, setKid] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    name: "",
    message: "",
    messageSenderName: "",
    showName: false,
    email: "",
    ssn: "",
    anonymous: false,
    taxDeduction: false,
    newsletter: false,
    paymentMethod: "vipps",
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

  useEffect(() => {
    onSetAmount && onSetAmount(parseInt(formData.amount));
  }, [formData.amount, onSetAmount]);

  const paneHeights = useMultipleElementHeights(paneRefs as React.RefObject<HTMLDivElement>[]);

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
    if (step === 0) return; // Prevent going back from the first step
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

  const registerDonation = () => {
    setLoading(true);
    fetch(`${API_URL}/donations/register`, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        distributionCauseAreas: [
          {
            id: organizationInfo.databaseIds.causeAreaId,
            percentageShare: "100",
            standardSplit: false,
            organizations: [
              {
                id: organizationInfo.databaseIds.organizationId,
                percentageShare: "100",
              },
            ],
          },
        ],
        donor: formData.anonymous
          ? ANONYMOUS_DONOR
          : {
              name: formData.name,
              email: formData.email,
              taxDeduction: formData.taxDeduction,
              ssn: formData.ssn,
              newsletter: formData.newsletter,
            },
        fundraiser: {
          id: fundraiserId,
          message: formData.message,
          messageSenderName: formData.message.length !== 0 ? formData.messageSenderName : null,
          showName: formData.message.length !== 0 ? formData.showName : false,
        },
        method: formData.paymentMethod === "bank" ? PaymentMethod.BANK : PaymentMethod.VIPPS,
        amount: formData.amount,
        recurring: 0,
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setKid(data.content.KID);
        if (data.content.paymentProviderUrl && data.content.paymentProviderUrl.length > 0) {
          window.open(data.content.paymentProviderUrl, "_self");
        } else {
          goToNextStep();
          setLoading(false);
        }
      });
  };

  // Determine current height based on active pane
  const currentHeight = paneHeights[paneTransition.activePane] || "auto";

  // Parse templated text by replacing tokens with values from formData
  const parseTemplate = (template: string): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      if (key === "accountNumber") return mergedTexts.accountNumber;
      return match;
    });
  };

  if (!organizationInfo.organization) {
    return "Missing organization info";
  }
  if (!organizationInfo.organization.logo) {
    return "Missing organization logo";
  }
  if (!organizationInfo.organization.name) {
    return "Missing organization name";
  }

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
        <div className={styles["donation-widget__inner"]}>
          {/* Pane 1: Initial Donation Form */}
          <div
            ref={paneRefs[0]}
            className={getPaneClassName(0)}
            style={{ display: isPaneVisible(0) ? "block" : "none" }}
          >
            <FundraiserOrganizationInfo
              name={organizationInfo.organization.name}
              logo={organizationInfo.organization.logo as SanityImageObject}
              textTemplate={organizationInfo.textTemplate}
              organizationSlug={organizationInfo.organizationPageSlug}
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
                {/* Suggested sums buttons */}
                <div className={styles["donation-widget__input-group__suggested-sums"]}>
                  {suggestedSums.map((sum) => (
                    <button
                      key={sum}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, amount: sum.toString() });
                      }}
                      className={[
                        styles["donation-widget__input-group__suggested-sums__button"],
                        formData.amount === sum.toString()
                          ? styles["donation-widget__input-group__suggested-sums__button--active"]
                          : "",
                      ].join(" ")}
                    >
                      {thousandize(sum)} kr
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles["donation-widget__input-group"]}>
                <NumericFormat
                  id="amount"
                  name="amount"
                  type="tel"
                  thousandSeparator=" "
                  value={formData.amount}
                  onValueChange={(values) => setFormData({ ...formData, amount: values.value })}
                  placeholder={mergedTexts.donationAmountLabel}
                  required
                  min={1}
                  step={1}
                />
                <span className={styles["donation-widget__input-group__suffix"]}>kr</span>
              </div>
              {matchingConfig && (
                <div className={styles["donation-widget__matching-info__container"]}>
                  <AnimateHeight
                    height={
                      formData.amount.length > 0 &&
                      matchingConfig &&
                      Math.floor((parseInt(formData.amount) || 0) * matchingConfig.factor) > 0
                        ? "auto"
                        : 0
                    }
                  >
                    <div className={styles["donation-widget__matching-info"]}>
                      <span>{`+ ${thousandize(
                        Math.min(
                          Math.floor((parseInt(formData.amount) || 0) * matchingConfig.factor),
                          matchingConfig.maxMatching || Number.MAX_SAFE_INTEGER,
                        ),
                      )} kr fra Peter i matching`}</span>
                    </div>
                  </AnimateHeight>
                </div>
              )}

              <div className={styles["donation-widget__input-group"]}>
                <div className={styles["donation-widget__message-header"]}>
                  <label htmlFor="message">Valgfri melding</label>
                  {/* Conditionally render the counter */}
                  {formData.message.length > 0 && (
                    <CharacterCountCircle count={formData.message.length} max={250} />
                  )}
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  placeholder={mergedTexts.messageLabel}
                  onChange={handleInputChange}
                  maxLength={250}
                />
              </div>

              {formData.message.length > 0 && (
                <>
                  <div className={styles["donation-widget__input-group"]}>
                    <input
                      id="messageSenderName"
                      name="messageSenderName"
                      type="text"
                      value={formData.messageSenderName}
                      onChange={handleInputChange}
                      placeholder={mergedTexts.nameLabel}
                      required={formData.showName}
                      maxLength={45}
                    />
                  </div>

                  <div className={styles["donation-widget__checkbox-group"]}>
                    <EffektCheckbox
                      checked={formData.showName}
                      onChange={(checked) => {
                        setFormData({ ...formData, showName: checked });
                      }}
                    >
                      {mergedTexts.showNameLabel}
                    </EffektCheckbox>
                  </div>
                </>
              )}

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
                registerDonation();
              }}
            >
              <div className={styles["donation-widget__checkbox-group"]} style={{ zIndex: 2 }}>
                <EffektCheckbox
                  checked={formData.anonymous}
                  onChange={(checked) => {
                    setFormData({ ...formData, anonymous: checked, email: "", ssn: "" });
                  }}
                >
                  {mergedTexts.anonymousDonationLabel}{" "}
                </EffektCheckbox>
                <span className={styles["donation-widget__checkbox-group__popup-trigger"]}>?</span>{" "}
                <div className={styles["donation-widget__checkbox-group__popup"]}>
                  Donerer du anonymt knyttes ikke donasjonen til din epost. Dette betyr at du ikke
                  vil motta kvittering eller informasjon om donasjonen.
                </div>
              </div>

              {!formData.anonymous && (
                <>
                  {formData.message.length === 0 && (
                    <div className={styles["donation-widget__input-group"]}>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!formData.anonymous}
                        placeholder={mergedTexts.nameLabel}
                      />
                    </div>
                  )}

                  <div className={styles["donation-widget__input-group"]}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required={!formData.anonymous}
                      placeholder={mergedTexts.emailLabel}
                    />
                  </div>

                  <div className={styles["donation-widget__checkbox-group"]}>
                    <EffektCheckbox
                      checked={formData.taxDeduction}
                      onChange={(checked) => {
                        setFormData({ ...formData, taxDeduction: checked });
                      }}
                    >
                      {mergedTexts.taxDeductionLabel}
                    </EffektCheckbox>
                  </div>

                  <AnimateHeight duration={100} height={formData.taxDeduction ? "auto" : 0}>
                    <div className={styles["donation-widget__input-group"]}>
                      <input
                        id="ssn"
                        name="ssn"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.ssn}
                        onChange={handleInputChange}
                        required={formData.taxDeduction}
                        placeholder={mergedTexts.ssnLabel}
                      />
                    </div>
                  </AnimateHeight>

                  <div className={styles["donation-widget__checkbox-group"]}>
                    <EffektCheckbox
                      checked={formData.newsletter}
                      onChange={(checked) => {
                        setFormData({ ...formData, newsletter: checked });
                      }}
                    >
                      {mergedTexts.newsletterLabel}
                    </EffektCheckbox>
                  </div>
                </>
              )}

              <div className={styles["donation-widget__privacy-link"]}>
                <LinkComponent link={privacyPolicyUrl} newtab>
                  {mergedTexts.privacyPolicyText + " ↗"}
                </LinkComponent>
              </div>
              <div className={styles["donation-widget__payment-options"]}>
                <RadioButtonGroup
                  options={[
                    { title: mergedTexts.payWithVippsLabel, value: PaymentMethod.VIPPS },
                    { title: mergedTexts.payWithBankLabel, value: PaymentMethod.BANK },
                  ]}
                  selected={
                    formData.paymentMethod === "bank" ? PaymentMethod.BANK : PaymentMethod.VIPPS
                  }
                  onSelect={(value) => {
                    setFormData({
                      ...formData,
                      paymentMethod: value === PaymentMethod.BANK ? "bank" : "vipps",
                    });
                  }}
                ></RadioButtonGroup>
              </div>

              <button type="submit" className={styles["donation-widget__button"]}>
                {loading ? (
                  <Spinner className={styles["donation-widget__spinner"]} />
                ) : formData.paymentMethod === "bank" ? (
                  mergedTexts.bankButtonText
                ) : (
                  mergedTexts.payWithVippsLabel
                )}
              </button>
            </form>
          </div>

          {/* Pane 4: Bank Transfer Information */}
          <div
            ref={paneRefs[3]}
            className={getPaneClassName(3)}
            style={{ display: isPaneVisible(3) ? "block" : "none" }}
          >
            {formData.paymentMethod === "bank" && (
              <div className={styles["donation-widget__form"]}>
                <p>{parseTemplate(mergedTexts.bankTransferInfo)}</p>

                <div className={styles["donation-widget__account-info"]}>
                  <p>
                    <strong>{mergedTexts.accountNumberPrefix}</strong> {mergedTexts.accountNumber}
                  </p>
                  <p>
                    <strong>{mergedTexts.kidPrefix}</strong> {kid}
                  </p>
                </div>

                <p>{parseTemplate(mergedTexts.transferDelayText)}</p>
                <p style={{ paddingBottom: "2rem" }}>
                  {parseTemplate(mergedTexts.accountOwnerText)}
                </p>
              </div>
            )}
          </div>

          <div className={styles["donation-widget__bottom_shade"]}></div>
        </div>
      </ReactAnimateHeight>
    </div>
  );
};

export default DonationWidget;
