import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../store/state";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { InfoText } from "../PaymentPane.style";
import { PaymentInformation } from "./PaymentInformation";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { BankPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { ANONYMOUS_DONOR } from "../../../../config/anonymous-donor";
import AnimateHeight from "react-animate-height";
import { CompleteButton, CompleteButtonWrapper } from "./BankPane.style";
import { usePlausible } from "next-plausible";
import { calculateDonationBreakdown } from "../../../../utils/donationCalculations";

export const BankPane: React.FC<{
  config: BankPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const plausible = usePlausible();
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];
  const [hasCompletedTransaction, setHasCompletedTransaction] = useState(false);

  const breakdown = calculateDonationBreakdown(
    donation.causeAreaAmounts ?? {},
    donation.orgAmounts ?? {},
    donation.causeAreaDistributionType ?? {},
    donation.operationsPercentageModeByCauseArea ?? {},
    donation.operationsPercentageByCauseArea ?? {},
    causeAreas,
    donation.selectionType ?? "single",
    donation.selectedCauseAreaId ?? 1,
    donation.globalOperationsEnabled ?? false,
    donation.globalOperationsPercentage ?? 0,
    donation.operationsConfig?.excludedCauseAreaIds ?? [],
    donation.smartDistributionTotal,
  );
  const totalSumIncludingTip = breakdown.totalAmount;

  let currency = "NOK";
  if (config.locale === "sv") {
    currency = "SEK";
  }

  useEffect(() => {
    if (hasCompletedTransaction && totalSumIncludingTip && donation.kid) {
      plausible("CompletedDonation", {
        revenue: {
          currency: currency,
          amount: totalSumIncludingTip,
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
