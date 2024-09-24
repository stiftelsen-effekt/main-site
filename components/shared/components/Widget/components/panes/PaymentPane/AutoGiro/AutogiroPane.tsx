import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../store/state";
import { AutoGiroPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { StyledPaneContent } from "./AutogiroPane.style";
import { RadioButtonGroup } from "../../../../../RadioButton/RadioButtonGroup";
import { RoundedBorder } from "../../../shared/Layout/Layout.style";
import { TextWrapper } from "../Bank/BankPane.style";
import { PortableText } from "@portabletext/react";
import { thousandize } from "../../../../../../../../util/formatting";
import LinkButton from "../../../../../EffektButton/LinkButton";
import AnimateHeight from "react-animate-height";
import { DatePicker } from "../../../shared/DatePicker/DatePicker";
import { API_URL } from "../../../../config/api";
import { DateTime } from "luxon";
import { usePlausible } from "next-plausible";
import { EffektButton } from "../../../../../EffektButton/EffektButton";

enum AutoGiroOptions {
  MANUAL_TRANSACTION,
  MANUAL_AUTOGIRO_SETUP,
}

const DEFAULT_DATE = 28;

export const AutogiroPane: React.FC<{
  referrals: WidgetPane3ReferralsProps;
  config: AutoGiroPaymentMethod;
}> = ({ referrals, config }) => {
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const donation = useSelector((state: State) => state.donation);
  const plausible = usePlausible();

  const [selectedAutogiroSetup, setSelectedAutogiroSetup] = React.useState<
    AutoGiroOptions | undefined
  >();
  const [manualAutogiroSetupDate, setManualAutogiroSetupDate] = React.useState<number>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    let date = manualAutogiroSetupDate ?? DEFAULT_DATE;
    fetch(`${API_URL}/autogiro/${donation.kid}/drafted/paymentdate`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        paymentDate: date,
      }),
    });
  }, [manualAutogiroSetupDate]);

  const manualTransactionContent = (
    <>
      <RoundedBorder>
        <TextWrapper>
          <span>{config.manual_recurring_option_config.sum_label}</span>
          <span data-cy="autogiro-manual-sum">{thousandize(donation.sum || 0)} kr</span>
        </TextWrapper>
      </RoundedBorder>
      <span>{config.manual_recurring_option_config.payer_numberexplanatory_text}</span>
      <PortableText value={config.manual_recurring_option_config.instruction_text} />
      <EffektButton
        onClick={() => {
          setHasSubmitted(true);
          if (donation.sum) {
            plausible("StartedAgreement", {
              revenue: {
                currency: "SEK",
                amount: donation.sum,
              },
              props: {
                method: "Autogiro",
                recurring: true,
                kid: donation.kid,
              },
            });
          }
        }}
        style={{ fontSize: 18, marginTop: 10, padding: 14 }}
        data-cy="autogiro-manual-transaction-setup-complete-button"
      >
        {config.manual_recurring_option_config.complete_button_text}
      </EffektButton>
    </>
  );

  const manualAutogiroSetupContent = (
    <>
      <PortableText value={config.recurring_manual_option_config.explanation_text} />
      <RoundedBorder data-cy="autogiro-manual-setup-date-selector-wrapper">
        <TextWrapper
          onClick={() => {
            if (typeof manualAutogiroSetupDate !== "undefined") {
              setManualAutogiroSetupDate(undefined);
            } else {
              setManualAutogiroSetupDate(DEFAULT_DATE);
            }
          }}
          style={{ cursor: "pointer" }}
          data-cy="autogiro-manual-setup-date-selector-button"
        >
          <span>
            {typeof manualAutogiroSetupDate === "undefined"
              ? config.recurring_manual_option_config.date_selector_config.payment_date_format_template.replace(
                  "{{date}}",
                  DEFAULT_DATE.toString(),
                )
              : manualAutogiroSetupDate === 0
              ? config.recurring_manual_option_config.date_selector_config
                  .payment_date_last_day_of_month_template
              : config.recurring_manual_option_config.date_selector_config.payment_date_format_template.replace(
                  "{{date}}",
                  manualAutogiroSetupDate.toString(),
                )}
          </span>
          <span
            style={{
              transition: "all 200ms",
              rotate: typeof manualAutogiroSetupDate === "undefined" ? "0deg" : "180deg",
            }}
          >
            ↓
          </span>
        </TextWrapper>
        <AnimateHeight height={typeof manualAutogiroSetupDate === "undefined" ? 0 : "auto"}>
          <DatePicker
            onChange={setManualAutogiroSetupDate}
            selected={manualAutogiroSetupDate}
            configuration={config.recurring_manual_option_config.date_selector_config}
          />
        </AnimateHeight>
      </RoundedBorder>

      <EffektButton
        onClick={() => {
          setHasSubmitted(true);
          if (donation.sum) {
            plausible("StartedAgreement", {
              revenue: {
                currency: "SEK",
                amount: donation.sum,
              },
              props: {
                method: "Autogiro",
                recurring: true,
                kid: donation.kid,
              },
            });
          }
        }}
        style={{ fontSize: 18, marginTop: 10, padding: 14 }}
        data-cy="autogiro-manual-setup-complete-button"
      >
        {config.recurring_manual_option_config.complete_button_text}
      </EffektButton>
    </>
  );

  return (
    <Pane>
      <PaneContainer>
        <StyledPaneContent>
          <PaneTitle>{config.title}</PaneTitle>

          <AnimateHeight height={hasSubmitted ? 0 : "auto"} animateOpacity={true}>
            <RoundedBorder>
              <TextWrapper>
                <span>{config.payer_number_label}</span>
                <span data-cy="autogiro-kid">{donation.kid}</span>
              </TextWrapper>
            </RoundedBorder>
            <RoundedBorder>
              <TextWrapper>
                <span>{config.account_number_label}</span>
                <span data-cy="autogiro-manual-bank-account">{config.account_number}</span>
              </TextWrapper>
            </RoundedBorder>
            <i>Välj ett av nedan alternativ:</i>
            <br />
            <br />
            <RadioButtonGroup
              options={[
                {
                  title: config.recurring_manual_option_config.title,
                  value: AutoGiroOptions.MANUAL_AUTOGIRO_SETUP,
                  content: manualAutogiroSetupContent,
                  data_cy: "autogiro-radio-manual-autogiro-setup",
                },
                {
                  title: config.manual_recurring_option_config.title,
                  value: AutoGiroOptions.MANUAL_TRANSACTION,
                  content: manualTransactionContent,
                  data_cy: "autogiro-radio-manual-transaction",
                },
              ]}
              selected={selectedAutogiroSetup}
              onSelect={(selected) => {
                plausible("AutogiroMethodeSelected" + selected);
                setSelectedAutogiroSetup(selected);
              }}
            />
          </AnimateHeight>

          <AnimateHeight height={hasSubmitted ? "auto" : 0} animateOpacity={true}>
            <div data-cy="autogiro-completed-text">
              <PortableText value={config.completed_text} />
            </div>
          </AnimateHeight>
        </StyledPaneContent>

        <Referrals
          text={{
            pane3_referrals_title: referrals.pane3_referrals_title,
          }}
        />
      </PaneContainer>
    </Pane>
  );
};
