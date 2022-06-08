import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDueDay } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
import { RichSelect } from "../../../shared/RichSelect/RichSelect";
import { RichSelectOption } from "../../../shared/RichSelect/RichSelectOption";
import { OrangeLink } from "../../../Widget.style";
import { Pane, PaneContainer, PaneTitle, UnderTitle } from "../../Panes.style";
import { InfoText } from "../PaymentPane.style";
import { AvtaleGiroDatePicker } from "./AvtaleGiroDatePicker/AvtaleGiroDatePicker";
import {
  formatChargeDay,
  getEarliestPossibleChargeDate,
} from "./AvtaleGiroDatePicker/avtalegirodates";
import { PaymentInformation } from "./PaymentInformation";
import { RecurringBankDonationForm } from "./RecurringForm";

export const ResultPane: React.FC = () => {
  const donation = useSelector((state: State) => state.donation);
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
        <PaneTitle>Tusen takk!</PaneTitle>
        <UnderTitle>Du kan nå overføre til oss</UnderTitle>

        {donation.recurring === RecurringDonation.RECURRING && (
          <div>
            <RichSelect
              selected={chooseChargeDay}
              onChange={(value: number) => {
                setChooseChargeDay(value);
              }}
            >
              <RichSelectOption
                label="Begynn tidligst mulig"
                sublabel={formatChargeDay(getEarliestPossibleChargeDate())}
                value={0}
              />
              <RichSelectOption
                label="Velg annen trekkdag"
                sublabel="Velg startdato og månedlig trekkdag"
                value={1}
              >
                <AvtaleGiroDatePicker />
              </RichSelectOption>
            </RichSelect>
            <RecurringBankDonationForm donation={donation} />
          </div>
        )}

        {donation.recurring === RecurringDonation.NON_RECURRING && (
          <div>
            <PaymentInformation donation={donation} />
            <InfoText>
              {`Hvis du ønsker å donere med samme fordeling senere kan du bruke samme KID-nummer igjen. Dersom du har noen spørsmål eller tilbakemeldinger kan du alltid ta kontakt med oss ved å sende en mail til `}
              <OrangeLink href="mailto:donasjon@gieffektivt.no">
                donasjon@gieffektivt.no
              </OrangeLink>
            </InfoText>
          </div>
        )}

        {donation.recurring === RecurringDonation.NON_RECURRING &&
          donation.donor?.email !== "anon@gieffektivt.no" && (
            <InfoText>{`Vi har også sendt en mail til ${donation.donor?.email} med informasjon om din donasjon. Sjekk søppelpost-mappen om du ikke har mottatt eposten i løpet av noen minutter.`}</InfoText>
          )}
      </PaneContainer>
    </Pane>
  );
};
