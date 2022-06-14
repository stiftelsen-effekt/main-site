import styled from "styled-components";
import { EffektButton } from "../../../../elements/effektbutton";

export const NextButton = styled(EffektButton)`
  font-size: 20px;
  padding: 14px 40px;
  border-radius: 45px;

  @media only screen and (max-width: 768px) {
    font-size: 25px;
    padding: 18px 68px;
    border-radius: 60px;
  }
`;

export const SubmitButton = styled(EffektButton)`
  font-size: 25px;
  padding: 18px 68px;
  border-radius: 60px;
`;
