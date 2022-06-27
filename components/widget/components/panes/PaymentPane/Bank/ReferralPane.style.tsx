import styled from "styled-components";
import { gray18, orange15 } from "../../../../config/colors";

export const ReferralsWrapper = styled.div``;

export const ReferralButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const ReferralTextInput = styled.input`
  padding: 10px 10px 10px 10px;
  margin: 1%;
  font-size: 16px;
  background-color: black;
  color: white;
  border: 1px solid white;
  border-radius: 10px;
  width: 98%;

  &:hover {
    cursor: text;
  }
`;
