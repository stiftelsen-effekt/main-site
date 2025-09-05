import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../store/state";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { DkBankPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { usePlausible } from "next-plausible";
import { EffektButton } from "../../../../../EffektButton/EffektButton";
import AnimateHeight from "react-animate-height";
import { PaymentInformation } from "../Bank/PaymentInformation";
import { InfoText } from "../PaymentPane.style";
import { ANONYMOUS_DONOR } from "../../../../config/anonymous-donor";
import { CompleteButton, CompleteButtonWrapper } from "../Bank/BankPane.style";

export const DKBankPane: React.FC<{
  config: DkBankPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const plausible = usePlausible();
  const donation = useSelector((state: State) => state.donation);
  const { paymentProviderURL, recurring } = donation;

  const [hasCompletedTransaction, setHasCompletedTransaction] = useState(false);
  let currency = "NOK";
  if (config.locale === "sv") {
    currency = "SEK";
  } else if (config.locale === "dk") {
    currency = "DKK";
  }

  useEffect(() => {
    if (hasCompletedTransaction && donation.sum && donation.kid) {
      plausible("StartedAgreement", {
        revenue: {
          currency: currency,
          amount: donation.sum,
        },
        props: {
          method: "dkbank",
          recurring: true,
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
                  if (config.completed_redirect && config.completed_redirect.slug) {
                    window.open(config.completed_redirect.slug, "_parent");
                  } else {
                    setHasCompletedTransaction(true);
                  }
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

        {!(referrals.show_referrals === false) && (
          <Referrals
            text={{
              referrals_title: referrals.referrals_title,
              other_referral_input_placeholder: referrals.other_referral_input_placeholder,
            }}
          />
        )}
      </PaneContainer>
    </Pane>
  );
};
