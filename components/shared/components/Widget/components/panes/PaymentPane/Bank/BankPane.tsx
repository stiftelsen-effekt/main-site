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

export const BankPane: React.FC<{
  config: BankPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const donation = useSelector((state: State) => state.donation);
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const donorID = useSelector((state: State) => state.donation.donor?.donorID);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);
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
          <PaneTitle>{config.title}</PaneTitle>
          <PaymentInformation
            donation={donation}
            accountTitle={config.kontonr_title}
            kidTitle={config.kid_title}
            accountNr={config.kontonr}
          />
          <InfoText>{config.explanatory_text}</InfoText>
        </div>

        {donation.donor?.email !== ANONYMOUS_DONOR.email && (
          <InfoText>{`Vi har også sendt denne informasjonen til ${donation.donor?.email}. Sjekk søppelpost om du ikke har mottatt den etter 5 minutter.`}</InfoText>
        )}

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
