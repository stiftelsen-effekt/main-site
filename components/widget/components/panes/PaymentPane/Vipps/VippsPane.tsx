import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "../../../../../elements/datepicker";
import { RadioButtonGroup } from "../../../../../elements/radiobuttongroup";
import { draftAgreementAction, setVippsAgreement } from "../../../../store/donation/actions";
import { setLoading } from "../../../../store/layout/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
import { SubmitButton } from "../../../shared/Buttons/NavigationButtons.style";
import { ErrorField } from "../../../shared/Error/ErrorField";
import { LoadingCircle } from "../../../shared/LoadingCircle/LoadingCircle";
import { RichSelect } from "../../../shared/RichSelect/RichSelect";
import { RichSelectOption } from "../../../shared/RichSelect/RichSelectOption";
import { OrangeLink } from "../../../Widget.style";
import { CenterDiv, Pane, PaneContainer, PaneTitle, UnderTitle } from "../../Panes.style";
import { InfoText } from "../PaymentPane.style";
import { VippsDatePicker } from "./VippsDatePicker/VippsDatePicker";
import { VippsButton, VippsButtonWrapper } from "./VippsPane.style";

export const VippsPane: React.FC = () => {
  const dispatch = useDispatch();
  const donationState = useSelector((state: State) => state.donation);
  const { paymentProviderURL, recurring, vippsAgreement } = donationState;
  const [draftError, setDraftError] = useState(false);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);

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
              <div style={{ marginBottom: 30 }}>
                <SubmitButton
                  onClick={async () => {
                    if (recurring === RecurringDonation.RECURRING) {
                      dispatch(draftAgreementAction.started(undefined));
                      setDraftError(true);
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
              <PaneTitle>Tusen takk!</PaneTitle>
            </div>
            <CenterDiv>
              <VippsButtonWrapper>
                <SubmitButton
                  onClick={async () => {
                    if (recurring === RecurringDonation.NON_RECURRING) {
                      window.open(paymentProviderURL);
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
      </PaneContainer>
    </Pane>
  );
};