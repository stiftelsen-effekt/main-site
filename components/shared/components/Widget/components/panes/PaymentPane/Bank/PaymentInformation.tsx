import React from "react";
import { Donation } from "../../../../store/state";
import { RoundedBorder } from "../../../shared/Layout/Layout.style";
import { TextWrapper } from "./BankPane.style";

export const PaymentInformation: React.FC<{
  accountTitle: string;
  kidTitle: string;
  donation: Donation;
  accountNr: string;
}> = ({ donation, accountTitle, kidTitle, accountNr }) => {
  return (
    <>
      <RoundedBorder>
        <TextWrapper>
          <span>{accountTitle}</span>
          <span>{accountNr}</span>
        </TextWrapper>
      </RoundedBorder>
      <RoundedBorder>
        <TextWrapper>
          <span>{kidTitle}</span>
          <span data-cy="kidNumber">{donation.kid}</span>
        </TextWrapper>
      </RoundedBorder>
    </>
  );
};
