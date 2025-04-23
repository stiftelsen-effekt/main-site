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
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../../store/donation/types";

export const AvtaleGiroPane: React.FC<{
  config: AvtaleGiroPaymentMethod;
  referrals: WidgetPane3ReferralsProps;
}> = ({ config, referrals }) => {
  const donation = useSelector((state: State) => state.donation);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);
  const dispatch = useDispatch<Dispatch<DonationActionTypes>>();

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
