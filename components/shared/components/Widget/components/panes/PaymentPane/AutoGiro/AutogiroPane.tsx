import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../store/state";
import { AutoGiroPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { StyledPaneContent } from "./AutogiroPane.style";
import { RadioButtonGroup } from "../../../../../RadioButton/RadioButtonGroup";
import { RoundedBorder } from "../../../shared/Layout/Layout.style";
import { TextWrapper } from "../Bank/ResultPane.style";
import { PortableText } from "@portabletext/react";
import { thousandize } from "../../../../../../../../util/formatting";
import LinkButton from "../../../../../EffektButton/LinkButton";
import AnimateHeight from "react-animate-height";
import { DatePicker } from "../../../shared/DatePicker/DatePicker";

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

  const [selectedAutogiroSetup, setSelectedAutogiroSetup] = React.useState<
    AutoGiroOptions | undefined
  >();
  const [manualAutogiroSetupDate, setManualAutogiroSetupDate] = React.useState<number | undefined>(
    undefined,
  );

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
          <span>1506 29 95960</span>
        </TextWrapper>
      </RoundedBorder>
      <span>{config.manual_recurring_option_config.payment_numberexplanatory_text}</span>
      <PortableText value={config.manual_recurring_option_config.instruction_text} />
    </>
  );

  const manualAutogiroSetupContent = (
    <>
      <PortableText value={config.recurring_manual_option_config.explanation_text} />
      <RoundedBorder>
        <TextWrapper
          onClick={() => {
            if (manualAutogiroSetupDate) {
              setManualAutogiroSetupDate(undefined);
            } else {
              setManualAutogiroSetupDate(25);
            }
          }}
        >
          <span>
            Overføring den {manualAutogiroSetupDate ? manualAutogiroSetupDate : "25"}. hver måned
          </span>
          <span>▼</span>
        </TextWrapper>
        <AnimateHeight height={manualAutogiroSetupDate ? "auto" : 0}>
          <DatePicker onChange={setManualAutogiroSetupDate} selected={manualAutogiroSetupDate} />
        </AnimateHeight>
      </RoundedBorder>
    </>
  );

  const formAutogiroSetupContent = (
    <>
      <PortableText value={config.recurring_form_option_config.explanation_text} />
      <LinkButton
        url={config.recurring_form_option_config.button_link}
        title={config.recurring_form_option_config.button_text}
        target={"_blank"}
      ></LinkButton>
    </>
  );

  return (
    <Pane>
      <PaneContainer>
        <StyledPaneContent>
          <PaneTitle>{config.title}</PaneTitle>

          <RoundedBorder>
            <TextWrapper>
              <span>{config.manual_recurring_option_config.payment_number_label}</span>
              <span>{donation.kid}</span>
            </TextWrapper>
          </RoundedBorder>

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
            onSelect={setSelectedAutogiroSetup}
          />
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
