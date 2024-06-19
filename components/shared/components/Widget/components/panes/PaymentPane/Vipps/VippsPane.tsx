import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../RadioButton/RadioButtonGroup";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { draftAgreementAction, setVippsAgreement } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
import { SubmitButton } from "../../../shared/Buttons/NavigationButtons";
import { ErrorField } from "../../../shared/Error/ErrorField";
import { CenterDiv, Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { VippsDatePicker } from "./VippsDatePicker/VippsDatePicker";
import { VippsButtonWrapper } from "./VippsPane.style";
import { VippsPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { usePlausible } from "next-plausible";

export const VippsPane: React.FC<{
  referrals: WidgetPane3ReferralsProps;
  config: VippsPaymentMethod;
}> = ({ referrals, config }) => {
  const dispatch = useDispatch();
  const donationState = useSelector((state: State) => state.donation);
  const { paymentProviderURL, recurring, vippsAgreement } = donationState;
  const [draftError, setDraftError] = useState(false);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);
  const donorID = useSelector((state: State) => state.donation.donor?.donorID);
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const plausible = usePlausible();

  return (
    <Pane>
      <PaneContainer>
        {recurring === RecurringDonation.RECURRING && (
          <>
            <div>
              <PaneTitle>{config.recurring_title}</PaneTitle>
              <div style={{ paddingTop: 20, marginBottom: 30 }}>
                <RadioButtonGroup
                  options={[
                    { title: config.recurring_selector_earliest_text, value: 0 },
                    { title: config.recurring_selector_choose_date_text, value: 1 },
                  ]}
                  selected={chooseChargeDay}
                  onSelect={(option: number) => {
                    setChooseChargeDay(option);
                    if (vippsAgreement) {
                      dispatch(
                        setVippsAgreement({
                          ...vippsAgreement,
                          initialCharge: option === 0,
                        }),
                      );
                    }
                  }}
                />
              </div>
              {chooseChargeDay === 1 && (
                <VippsDatePicker config={config.recurring_selector_date_picker_configuration} />
              )}
              {draftError && <ErrorField text="Det har skjedd en feil, vennligst prøv på nytt" />}
            </div>
            <CenterDiv>
              <div data-cy="vipps-recurring-button" style={{ marginBottom: 30 }}>
                <SubmitButton
                  onClick={async () => {
                    if (recurring === RecurringDonation.RECURRING) {
                      plausible("DraftVippsRecurringAgreement");
                      dispatch(draftAgreementAction.started(undefined));
                    }
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  {config.recurring_button_text}
                </SubmitButton>
              </div>
            </CenterDiv>
          </>
        )}
        {recurring === RecurringDonation.NON_RECURRING && (
          <>
            <div>
              <PaneTitle>{config.single_title}</PaneTitle>
            </div>
            <CenterDiv>
              <VippsButtonWrapper data-cy="vipps-single-button">
                <SubmitButton
                  onClick={async () => {
                    plausible("InitiateSingleVippsPayment");
                    if (recurring === RecurringDonation.NON_RECURRING && paymentProviderURL) {
                      window.location.href = paymentProviderURL;
                    }
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  {config.single_button_text}
                </SubmitButton>
              </VippsButtonWrapper>
            </CenterDiv>
          </>
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
