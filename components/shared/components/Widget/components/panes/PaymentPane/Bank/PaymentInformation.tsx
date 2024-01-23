import React from "react";
import { Donation } from "../../../../store/state";
import { RoundedBorder } from "../../../shared/Layout/Layout.style";
import { TextWrapper } from "./BankPane.style";

export const PaymentInformation: React.FC<{
  accountTitle: string;
  kidTitle: string;
  donation: Donation;
}> = ({ donation, accountTitle, kidTitle }) => {
  return (
    <>
      <RoundedBorder>
        <TextWrapper>
          <span>{accountTitle}</span>
          <span>1506 29 95960</span>
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
