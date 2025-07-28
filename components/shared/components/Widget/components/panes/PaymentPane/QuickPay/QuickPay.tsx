import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../store/state";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { Referrals } from "../../../shared/Referrals/Referrals";
import {
  QuickPayCardPaymentMethod,
  QuickPayMobilePayPaymentMethod,
  WidgetPane3ReferralsProps,
} from "../../../../types/WidgetProps";
import { usePlausible } from "next-plausible";
import { EffektButton } from "../../../../../EffektButton/EffektButton";

export const QuickPayPane: React.FC<{
  config: QuickPayCardPaymentMethod | QuickPayMobilePayPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const plausible = usePlausible();

  const donation = useSelector((state: State) => state.donation);
  const { paymentProviderURL, recurring } = donation;

  return (
    <Pane>
      <PaneContainer>
        <PaneTitle>QuickPay</PaneTitle>

        <EffektButton
          onClick={() => {
            if (paymentProviderURL) {
              window.location.href = paymentProviderURL;
            }
          }}
        >
          {recurring ? config.recurring_button_text : config.single_button_text}
        </EffektButton>

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
