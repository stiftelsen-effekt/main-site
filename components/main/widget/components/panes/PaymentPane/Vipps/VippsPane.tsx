import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../../shared/components/RadioButton/RadioButtonGroup";
import { WidgetContext } from "../../../../../layout/layout";
import { draftAgreementAction, setVippsAgreement } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
import { SubmitButton } from "../../../shared/Buttons/NavigationButtons";
import { ErrorField } from "../../../shared/Error/ErrorField";
import { CenterDiv, Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { VippsDatePicker } from "./VippsDatePicker/VippsDatePicker";
import { VippsButtonWrapper } from "./VippsPane.style";

export const VippsPane: React.FC = () => {
  const dispatch = useDispatch();
  const donationState = useSelector((state: State) => state.donation);
  const { paymentProviderURL, recurring, vippsAgreement } = donationState;
  const [draftError, setDraftError] = useState(false);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

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
              <VippsButtonWrapper>
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
      </PaneContainer>
    </Pane>
  );
};
