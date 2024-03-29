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
  FORM_AUTOGIRO_SETUP,
}

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
    let date = manualAutogiroSetupDate ?? DateTime.now().plus({ days: 6 }).day;
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
          <span>{thousandize(donation.sum || 0)} kr</span>
        </TextWrapper>
      </RoundedBorder>
      <RoundedBorder>
        <TextWrapper>
          <span>{config.manual_recurring_option_config.account_number_label}</span>
          <span>9960-4219888700</span>
        </TextWrapper>
      </RoundedBorder>
      <span>{config.manual_recurring_option_config.payment_numberexplanatory_text}</span>
      <PortableText value={config.manual_recurring_option_config.instruction_text} />
      <EffektButton
        onClick={() => {
          plausible("CompleteDonation");
          setHasSubmitted(true);
        }}
        style={{ fontSize: 18, marginTop: 10, padding: 14 }}
      >
        {config.manual_recurring_option_config.complete_button_text}
      </EffektButton>
    </>
  );

  const manualAutogiroSetupContent = (
    <>
      <PortableText value={config.recurring_manual_option_config.explanation_text} />
      <RoundedBorder>
        <TextWrapper
          onClick={() => {
            if (typeof manualAutogiroSetupDate !== "undefined") {
              setManualAutogiroSetupDate(undefined);
            } else {
              setManualAutogiroSetupDate(DateTime.now().plus({ days: 6 }).day);
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <span>
            {typeof manualAutogiroSetupDate === "undefined"
              ? config.recurring_manual_option_config.date_selector_config.payment_date_format_template.replace(
                  "{{date}}",
                  DateTime.now().plus({ days: 6 }).day.toString(),
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
              rotate: typeof manualAutogiroSetupDate === "undefined" ? "180deg" : "0deg",
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
          plausible("CompleteDonation");
          setHasSubmitted(true);
        }}
        style={{ fontSize: 18, marginTop: 10, padding: 14 }}
      >
        {config.recurring_manual_option_config.complete_button_text}
      </EffektButton>
    </>
  );

  const formAutogiroSetupContent = (
    <>
      <PortableText value={config.recurring_form_option_config.explanation_text} />
      <EffektButton
        onClick={() => {
          plausible("AutogiroBankGirotFormOpened");
          window.open(config.recurring_form_option_config.button_link, "_blank");
          setHasSubmitted(true);
        }}
        style={{ fontSize: 18, marginTop: 10, padding: 14 }}
      >
        {config.recurring_form_option_config.button_text}
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
                <span>{config.manual_recurring_option_config.payment_number_label}</span>
                <span>{donation.kid}</span>
              </TextWrapper>
            </RoundedBorder>
            <i>Välj ett av nedan alternativ:</i>
            <br />
            <br />
            <RadioButtonGroup
              options={[
                {
                  title: config.manual_recurring_option_config.title,
                  value: AutoGiroOptions.MANUAL_TRANSACTION,
                  content: manualTransactionContent,
                },
                {
                  title: config.recurring_manual_option_config.title,
                  value: AutoGiroOptions.MANUAL_AUTOGIRO_SETUP,
                  content: manualAutogiroSetupContent,
                },
                {
                  title: config.recurring_form_option_config.title,
                  value: AutoGiroOptions.FORM_AUTOGIRO_SETUP,
                  content: formAutogiroSetupContent,
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
            <PortableText value={config.completed_text} />
          </AnimateHeight>
        </StyledPaneContent>
        {/* Always show referrals for anonymous donors (ID 1464) */}
        {(!hasAnswerredReferral || donation.donor.donorID == 1464) && (
          <Referrals
            text={{
              pane3_referrals_title: referrals.pane3_referrals_title,
            }}
          />
        )}
      </PaneContainer>
    </Pane>
  );
};
