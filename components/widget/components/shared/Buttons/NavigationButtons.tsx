import React, { useReducer } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { StyledNextButton, StyledSpinner, StyledSubmitButton } from "./NavigationButtons.style";

export const NextButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}> = ({ children, disabled, onClick }) => {
  const loading = useSelector((state: State) => state.layout.loading);
  return (
    <StyledNextButton onClick={onClick} disabled={disabled}>
      {loading ? <StyledSpinner /> : children}
    </StyledNextButton>
  );
};

export const SubmitButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({
  children,
  onClick,
}) => {
  const loading = useSelector((state: State) => state.layout.loading);
  return (
    <StyledSubmitButton onClick={onClick}>
      {loading ? <StyledSpinner /> : children}
    </StyledSubmitButton>
  );
};
