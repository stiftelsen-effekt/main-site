import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../elements/radiobuttongroup";
import { setDueDay } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { RecurringDonation } from "../../../../types/Enums";
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
        {donation.recurring === RecurringDonation.RECURRING && (
          <>
            <div>
              <PaneTitle>Opprett AvtaleGiro avtale</PaneTitle>
              <div style={{ paddingTop: 20 }}>
                <RadioButtonGroup
                  options={[
                    { title: "Begynn tidligst mulig", value: 0 },
                    { title: "Velg annen trekkdag", value: 1 },
                  ]}
                  selected={chooseChargeDay}
                  onSelect={(option) => setChooseChargeDay(option)}
                />
              </div>
              <div style={{ paddingTop: 40 }}>
                {chooseChargeDay === 0 && (
                  <span>{formatChargeDay(getEarliestPossibleChargeDate())}</span>
                )}
                {chooseChargeDay === 1 && <AvtaleGiroDatePicker />}
              </div>
            </div>
            <div>
              <RecurringBankDonationForm donation={donation} />
            </div>
          </>
        )}

        {donation.recurring === RecurringDonation.NON_RECURRING && (
          <div>
            <PaneTitle>Tusen takk!</PaneTitle>
            <PaymentInformation donation={donation} />
            <InfoText>
              {`Hvis du ønsker å donere med samme fordeling senere kan du bruke samme KID-nummer igjen. Dersom du har noen spørsmål eller tilbakemeldinger kan du alltid ta kontakt med oss ved å sende en mail til `}
              <Link href="mailto:donasjon@gieffektivt.no" passHref target={"_blank"}>
                donasjon@gieffektivt.no
              </Link>
              .
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
