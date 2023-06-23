import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { CauseAreaNames, State } from "../../../../store/state";

const RedFont = styled.p`
  color: red;
  font-style: italic;
  margin-top: 5px;

  @media only screen and (max-width: 350px) {
    font-size: 14px;
  }
`;

export const SharesSum: React.FC<{ causeArea: CauseAreaNames }> = ({ causeArea }) => {
  const shares = useSelector((state: State) =>
    state.donation.shares.find((s) => s.causeArea === causeArea),
  );

  if (!shares) return <span>Could not find shares</span>;

  const sum = shares.organizationShares.reduce((acc, curr) => acc + curr.split, 0);

  if (sum === 100) return null;

  return <RedFont>{`Du har fordelt ${sum} av 100 prosent`}</RedFont>;
};
