import React from "react";
import { Donation } from "../../../../store/state";
import { RoundedBorder } from "../../../shared/Layout/Layout.style";
import { HorizontalLine, TextWrapper } from "./ResultPane.style";

export const PaymentInformation: React.FC<{
  donation: Donation;
}> = ({ donation }) => {
  return (
    <RoundedBorder>
      <TextWrapper>
        <b>Kontonr</b>
        <span>1506 29 95960</span>
      </TextWrapper>
      <HorizontalLine />
      <TextWrapper>
        <b>KID</b>
        <span data-cy="kidNumber">{donation.kid}</span>
      </TextWrapper>
    </RoundedBorder>
  );
};
