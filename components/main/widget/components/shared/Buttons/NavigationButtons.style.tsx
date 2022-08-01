import styled from "styled-components";
import { EffektButton } from "../../../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../../../shared/components/Spinner/Spinner";

export const StyledNextButton = styled(EffektButton)`
  font-size: 2rem;
  padding: 14px 40px;
  border-radius: 45px;
  min-width: 140px;

  @media only screen and (max-width: 768px) {
    font-size: 2.5rem;
    padding: 18px 68px;
    border-radius: 60px;
    min-width: 210px;
  }
`;

export const StyledSubmitButton = styled(EffektButton)`
  font-size: 2rem;
  padding: 14px 40px;
  border-radius: 45px;
  min-width: 140px;

  @media only screen and (max-width: 768px) {
    font-size: 2.5rem;
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
  top: -6px;
  left: -10px;
  transform-origin: center center;
  --secondary: #fafafa;
  --primary: #000;

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
