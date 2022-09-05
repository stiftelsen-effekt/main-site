import styled from "styled-components";
import { EffektButton } from "../../../../EffektButton/EffektButton";
import { Spinner } from "../../../../Spinner/Spinner";

export const StyledNextButton = styled(EffektButton)`
  font-size: 20px;
  padding: 14px 40px;
  border-radius: 45px;
  min-width: 140px;

  @media only screen and (max-width: 768px) {
    font-size: 25px;
    padding: 18px 68px;
    border-radius: 60px;
    min-width: 210px;
  }
`;

export const StyledSubmitButton = styled(EffektButton)`
  font-size: 20px;
  padding: 14px 40px;
  border-radius: 45px;
  min-width: 140px;

  @media only screen and (max-width: 768px) {
    font-size: 25px;
    padding: 18px 68px;
    border-radius: 60px;
    min-width: 210px;
  }
`;

export const StyledSpinner = styled(Spinner)`
  transform: scale(0.3);
  height: 20px;
  width: 20px;
  position: relative;
  top: -8px;
  left: -12px;
  transform-origin: center center;
  mix-blend-mode: difference;

  &::after {
    width: 70px;
    height: 70px;
    border-width: 10px;
  }

  @media only screen and (max-width: 768px) {
    top: -10px;
    left: -12px;
  }
`;
