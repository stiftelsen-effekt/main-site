import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../RadioButton/RadioButtonGroup";
import { setDueDay } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { DateText } from "../Vipps/VippsDatePicker/VippsDatePicker.style";
import { AvtaleGiroDatePicker } from "./AvtaleGiroDatePicker/AvtaleGiroDatePicker";
import {
  formatChargeDay,
  getEarliestPossibleChargeDate,
} from "./AvtaleGiroDatePicker/avtalegirodates";
import { RecurringBankDonationForm } from "./RecurringForm";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { AvtaleGiroPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";

export const AvtaleGiroPane: React.FC<{
  config: AvtaleGiroPaymentMethod;
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
          <div style={{ paddingTop: 20 }}>
            <RadioButtonGroup
              options={[
                { title: config.selector_earliest_text, value: 0 },
                { title: config.selector_choose_date_text, value: 1 },
              ]}
              selected={chooseChargeDay}
              onSelect={(option) => setChooseChargeDay(option)}
            />
          </div>
          <div style={{ paddingTop: 40 }}>
            {chooseChargeDay === 0 && (
              <DateText>{formatChargeDay(getEarliestPossibleChargeDate())}</DateText>
            )}
            {chooseChargeDay === 1 && (
              <AvtaleGiroDatePicker configuration={config.date_selector_configuration} />
            )}
          </div>
        </div>
        <div>
          <RecurringBankDonationForm donation={donation} buttonText={config.button_text} />
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
