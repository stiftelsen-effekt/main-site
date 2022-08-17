import React from "react";
import { Donation } from "../../../../store/state";
import { RoundedBorder } from "../../../shared/Layout/Layout.style";
import { TextWrapper } from "./ResultPane.style";

export const PaymentInformation: React.FC<{
  donation: Donation;
}> = ({ donation }) => {
  return (
    <>
      <RoundedBorder>
        <TextWrapper>
          <span>Kontonr</span>
          <span>1506 29 95960</span>
        </TextWrapper>
      </RoundedBorder>
      <RoundedBorder>
        <TextWrapper>
          <span>KID</span>
          <span data-cy="kidNumber">{donation.kid}</span>
        </TextWrapper>
      </RoundedBorder>
    </>
  );
};
