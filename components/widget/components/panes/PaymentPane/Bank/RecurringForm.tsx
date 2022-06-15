import React from "react";
import { useDispatch } from "react-redux";
import { Donation } from "../../../../store/state";
import AvtaleGiroLogo from "../../../../assets/avtalegiro.jpeg";
import { AvtaleGiroButton } from "./RecurringForm.style";
import { API_URL } from "../../../../config/api";
import { draftAvtaleGiroAction } from "../../../../store/donation/actions";
import { EffektButton } from "../../../../../elements/effektbutton";
import { SubmitButton } from "../../../shared/Buttons/NavigationButtons";

export const RecurringBankDonationForm: React.FC<{
  donation: Donation;
}> = ({ donation }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <form
        id="avtalegiro-form"
        action="https://pvu.nets.no/ecsa/start"
        method="post"
        target="_parent"
        style={{ paddingBottom: 30, display: "flex", justifyContent: "center" }}
      >
        <input type="hidden" name="companyName" id="companyName" value="Effektiv Altruisme Norge" />
        <input type="hidden" name="companyAccountNo" id="companyAccountNo" value="15062995960" />
        <input type="hidden" name="kid" id="kid" value={donation.kid} />
        <input
          type="hidden"
          name="amountLimit"
          id="amountLimit"
          value={donation.sum && donation.sum > 20000 ? donation.sum : 20000}
        />
        <input
          type="hidden"
          name="returnUrl"
          id="returnUrl"
          value={`${API_URL}/donations/status`}
        />
        <input type="hidden" name="notificationDisabled" id="notificationDisabled" value="false" />
        <SubmitButton onClick={() => dispatch(draftAvtaleGiroAction.started(undefined))}>
          Opprett avtale
        </SubmitButton>
      </form>
    </div>
  );
};
