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
import AnimateHeight from "react-animate-height";
import { EffektButton } from "../../../../../EffektButton/EffektButton";
import { CompleteButton, CompleteButtonWrapper } from "./BankPane.style";
import { usePlausible } from "next-plausible";

export const BankPane: React.FC<{
  config: BankPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const plausible = usePlausible();
  const donation = useSelector((state: State) => state.donation);
  const [hasCompletedTransaction, setHasCompletedTransaction] = useState(false);

  let currency = "NOK";
  if (config.locale === "sv") {
    currency = "SEK";
  }

  useEffect(() => {
    if (hasCompletedTransaction && donation.sum && donation.kid) {
      plausible("CompletedDonation", {
        revenue: {
          currency: currency,
          amount: donation.sum,
        },
        props: {
          method: "bank",
          recurring: false,
          kid: donation.kid,
        },
      });
    }
  }, [hasCompletedTransaction]);

  return (
    <Pane>
      <PaneContainer>
        <div>
          <AnimateHeight height={hasCompletedTransaction ? 0 : "auto"}>
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

            <CompleteButtonWrapper>
              <CompleteButton
                onClick={() => {
                  setHasCompletedTransaction(true);
                }}
              >
                {config.button_text}
              </CompleteButton>
            </CompleteButtonWrapper>
          </AnimateHeight>
          <AnimateHeight height={hasCompletedTransaction ? "auto" : 0}>
            <PaneTitle>{config.completed_title}</PaneTitle>
            <InfoText>{config.completed_text}</InfoText>
          </AnimateHeight>
        </div>

        <Referrals
          text={{
            referrals_title: referrals.referrals_title,
            other_referral_input_placeholder: referrals.other_referral_input_placeholder,
          }}
        />
      </PaneContainer>
    </Pane>
  );
};
