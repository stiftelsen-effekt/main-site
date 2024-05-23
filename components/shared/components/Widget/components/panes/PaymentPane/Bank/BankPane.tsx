import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDueDay } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { InfoText } from "../PaymentPane.style";
import { getEarliestPossibleChargeDate } from "../AvtaleGiro/AvtaleGiroDatePicker/avtalegirodates";
import { PaymentInformation } from "./PaymentInformation";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { BankPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { ANONYMOUS_DONOR } from "../../../../config/anonymous-donor";
import { ActionBar } from "../../DonationPane/DonationPane.style";
import { EffektButton } from "../../../../../EffektButton/EffektButton";
import AnimateHeight from "react-animate-height";
import { NextButton } from "../../../shared/Buttons/NavigationButtons";
import { usePlausible } from "next-plausible";

export const BankPane: React.FC<{
  config: BankPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const [completed, setCompleted] = useState(false);
  const donation = useSelector((state: State) => state.donation);
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const donorID = useSelector((state: State) => state.donation.donor?.donorID);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);
  const plausible = usePlausible();
  const dispatch = useDispatch();

  useEffect(() => {
    if (chooseChargeDay === 0) {
      dispatch(setDueDay(getEarliestPossibleChargeDate()));
    }
  }, [chooseChargeDay]);

  return (
    <Pane>
      <PaneContainer>
        <div>
          <AnimateHeight height={completed ? 0 : "auto"} animateOpacity={true}>
            <PaneTitle>{config.title}</PaneTitle>
            <PaymentInformation
              donation={donation}
              accountTitle={config.kontonr_title}
              kidTitle={config.kid_title}
              accountNr={config.kontonr}
            />
            <InfoText>{config.explanatory_text}</InfoText>

            {donation.donor?.email !== ANONYMOUS_DONOR.email && donation.donor?.email && (
              <InfoText>
                {config.explanatory_text_email_template.replaceAll("{email}", donation.donor.email)}
              </InfoText>
            )}

            <ActionBar>
              <NextButton
                onClick={() => {
                  setCompleted(true);
                  plausible("CompleteDonation", {
                    revenue: {
                      currency: "NOK",
                      amount: donation.sum || 0,
                    },
                  });
                }}
              >
                {config.bank_transfer_setup_button_text}
              </NextButton>
            </ActionBar>
          </AnimateHeight>
          <AnimateHeight height={completed ? "auto" : 0} animateOpacity={true}>
            <PaneTitle>{config.completed_title}</PaneTitle>
            <InfoText>{config.bank_transfer_completed_info_text}</InfoText>
          </AnimateHeight>
        </div>
        {/* Always show referrals for anonymous donors (ID 1464) */}
        {(!hasAnswerredReferral || donorID == 1464) && (
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
