import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../RadioButton/RadioButtonGroup";
import { setDueDay } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
import { Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { InfoText } from "../PaymentPane.style";
import { DateText } from "../Vipps/VippsDatePicker/VippsDatePicker.style";
import { AvtaleGiroDatePicker } from "./AvtaleGiroDatePicker/AvtaleGiroDatePicker";
import {
  formatChargeDay,
  getEarliestPossibleChargeDate,
} from "./AvtaleGiroDatePicker/avtalegirodates";
import { PaymentInformation } from "./PaymentInformation";
import { RecurringBankDonationForm } from "./RecurringForm";
import { Referrals } from "../../../shared/Referrals/Referrals";
import {
  WidgetPane3BankRecurringProps,
  WidgetPane3BankSingleProps,
  WidgetPane3ReferralsProps,
} from "../../../../types/WidgetProps";

export const ResultPane: React.FC<{
  text: WidgetPane3BankRecurringProps & WidgetPane3BankSingleProps & WidgetPane3ReferralsProps;
}> = ({ text }) => {
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
        {donation.recurring === RecurringDonation.RECURRING && (
          <>
            <div>
              <PaneTitle>{text.pane3_bank_recurring_title}</PaneTitle>
              <div style={{ paddingTop: 20 }}>
                <RadioButtonGroup
                  options={[
                    { title: text.pane3_bank_recurring_selector_earliest_text, value: 0 },
                    { title: text.pane3_bank_recurring_selector_choose_date_text, value: 1 },
                  ]}
                  selected={chooseChargeDay}
                  onSelect={(option) => setChooseChargeDay(option)}
                />
              </div>
              <div style={{ paddingTop: 40 }}>
                {chooseChargeDay === 0 && (
                  <DateText>{formatChargeDay(getEarliestPossibleChargeDate())}</DateText>
                )}
                {chooseChargeDay === 1 && <AvtaleGiroDatePicker />}
              </div>
            </div>
            <div>
              <RecurringBankDonationForm
                donation={donation}
                buttonText={text.pane3_bank_recurring_button_text}
              />
            </div>
          </>
        )}

        {donation.recurring === RecurringDonation.NON_RECURRING && (
          <div>
            <PaneTitle>{text.pane3_bank_single_title}</PaneTitle>
            <PaymentInformation
              donation={donation}
              accountTitle={text.pane3_bank_single_kontonr_title}
              kidTitle={text.pane3_bank_single_kid_title}
            />
            <InfoText>{text.pane3_bank_single_explanatory_text}</InfoText>
          </div>
        )}

        {donation.recurring === RecurringDonation.NON_RECURRING &&
          donation.donor?.email !== "anon@gieffektivt.no" && (
            <InfoText>{`Vi har også sendt en mail til ${donation.donor?.email} med informasjon om din donasjon. Sjekk søppelpost-mappen om du ikke har mottatt eposten i løpet av noen minutter.`}</InfoText>
          )}

        {/* Always show referrals for anonymous donors (ID 1464) */}
        {(!hasAnswerredReferral || donorID == 1464) && (
          <Referrals
            text={{
              pane3_referrals_title: text.pane3_referrals_title,
            }}
          />
        )}
      </PaneContainer>
    </Pane>
  );
};
