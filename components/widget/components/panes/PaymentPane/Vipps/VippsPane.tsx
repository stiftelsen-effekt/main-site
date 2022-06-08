import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "../../../../../elements/datepicker";
import { draftAgreementAction, setVippsAgreement } from "../../../../store/donation/actions";
import { setLoading } from "../../../../store/layout/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
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
  const isLoading = useSelector((state: State) => state.layout.loading);
  const { paymentProviderURL, recurring, vippsAgreement } = donationState;
  const [draftError, setDraftError] = useState(false);
  const [chooseChargeDay, setChooseChargeDay] = useState(0);

  return (
    <Pane>
      <PaneContainer>
        <PaneTitle>Tusen takk!</PaneTitle>
        <UnderTitle>Du kan nå overføre til oss</UnderTitle>
        {isLoading && <LoadingCircle />}
        {!isLoading && recurring === RecurringDonation.RECURRING && (
          <div>
            <RichSelect
              selected={chooseChargeDay}
              onChange={(value: number) => {
                setChooseChargeDay(value);
                if (vippsAgreement) {
                  dispatch(
                    setVippsAgreement({
                      ...vippsAgreement,
                      initialCharge: value === 0,
                    }),
                  );
                }
              }}
            >
              <RichSelectOption
                label="Begynn i dag"
                sublabel="Du kan endre månedlig trekkdag senere"
                value={0}
              />
              <RichSelectOption
                label="Velg annen trekkdag"
                sublabel="Velg startdato og månedlig trekkdag"
                value={1}
              >
                <DatePicker
                  selected={donationState.vippsAgreement?.monthlyChargeDay}
                  onChange={(date) =>
                    dispatch(
                      setVippsAgreement({
                        ...vippsAgreement,
                        monthlyChargeDay: date,
                        initialCharge: false,
                      }),
                    )
                  }
                />
                <VippsDatePicker />
              </RichSelectOption>
            </RichSelect>
            {draftError && <ErrorField text="Det har skjedd en feil, vennligst prøv på nytt" />}
          </div>
        )}
        {!isLoading && recurring === RecurringDonation.RECURRING && (
          <CenterDiv>
            <VippsButton
              tabIndex={0}
              onClick={async () => {
                setLoading(true);
                if (recurring === RecurringDonation.RECURRING) {
                  dispatch(draftAgreementAction.started(undefined));
                  setDraftError(true);
                }
                (document.activeElement as HTMLElement).blur();
              }}
            />
          </CenterDiv>
        )}
        {!isLoading && recurring === RecurringDonation.NON_RECURRING && (
          <div>
            <VippsButtonWrapper>
              <VippsButton
                tabIndex={0}
                onClick={async () => {
                  setLoading(true);
                  if (recurring === RecurringDonation.NON_RECURRING) {
                    window.open(paymentProviderURL);
                  }
                  (document.activeElement as HTMLElement).blur();
                }}
              />
            </VippsButtonWrapper>
            <InfoText>
              {`Ønsker du å se hele donasjonshistorikken din? Gå til `}
              <OrangeLink href="https://gieffektivt.no/historikk" target="_blank">
                https://gieffektivt.no/historikk
              </OrangeLink>
              {` og tast inn eposten din, så mottar du straks en oversikt over alle dine donasjoner.`}
            </InfoText>
          </div>
        )}
      </PaneContainer>
    </Pane>
  );
};
