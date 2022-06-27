import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EffektButton, EffektButtonType } from "../../../../../elements/effektbutton";
import { RadioButtonGroup } from "../../../../../elements/radiobuttongroup";
import { WidgetContext } from "../../../../../main/layout";
import { draftAgreementAction, setVippsAgreement } from "../../../../store/donation/actions";
import { submitReferralAction } from "../../../../store/referrals/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
import { SubmitButton } from "../../../shared/Buttons/NavigationButtons";
import { ErrorField } from "../../../shared/Error/ErrorField";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { CenterDiv, Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { ReferralsWrapper, ReferralButtonsWrapper, ReferralTextInput } from "../Bank/ReferralPane.style";
import { VippsDatePicker } from "./VippsDatePicker/VippsDatePicker";
import { VippsButtonWrapper } from "./VippsPane.style";

export const VippsPane: React.FC = () => {
  const dispatch = useDispatch();
  const donationState = useSelector((state: State) => state.donation);
  const { paymentProviderURL, recurring, vippsAgreement } = donationState;
  const [draftError, setDraftError] = useState(false);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);
  const donorID = useSelector((state: State) => state.donation.donor?.donorID); 
  const referrals = useSelector((state: State) => state.referrals.referrals);
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);
  const [selectedReferral, setSelectedReferral] = useState(0);
  const [otherInput, setOtherInput] = useState("");

  return (
    <Pane>
      <PaneContainer>
        {recurring === RecurringDonation.RECURRING && (
          <>
            <div>
              <PaneTitle>Opprett Vipps avtale</PaneTitle>
              <div style={{ paddingTop: 20, marginBottom: 30 }}>
                <RadioButtonGroup
                  options={[
                    { title: "Begynn i dag", value: 0 },
                    { title: "Velg annen trekkdag", value: 1 },
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
              {chooseChargeDay === 1 && <VippsDatePicker />}
              {draftError && <ErrorField text="Det har skjedd en feil, vennligst prøv på nytt" />}
            </div>
            <CenterDiv>
              <div data-cy="vipps-recurring-button" style={{ marginBottom: 30 }}>
                <SubmitButton
                  onClick={async () => {
                    if (recurring === RecurringDonation.RECURRING) {
                      dispatch(draftAgreementAction.started(undefined));
                    }
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  Opprett avtale
                </SubmitButton>
              </div>
            </CenterDiv>
          </>
        )}
        {recurring === RecurringDonation.NON_RECURRING && (
          <>
            <div>
              <PaneTitle>Du kan nå overføre til oss</PaneTitle>
            </div>
            <CenterDiv>
              <VippsButtonWrapper data-cy="vipps-single-button">
                <SubmitButton
                  onClick={async () => {
                    if (recurring === RecurringDonation.NON_RECURRING && paymentProviderURL) {
                      window.location.href = paymentProviderURL;
                    }
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  Betal med Vipps
                </SubmitButton>
              </VippsButtonWrapper>
            </CenterDiv>
          </>
        )}
         {/* Always show referrals for anonymous donors (ID 1464) */}
         {(!hasAnswerredReferral || donorID == 1464) &&
          <Referrals />
        }
      </PaneContainer>
    </Pane>
  );
};
