import React, { useReducer } from "react";
import { useSelector } from "react-redux";
import { LoadingButtonSpinner } from "../../../../Spinner/LoadingButtonSpinner";
import { State } from "../../../store/state";
import { StyledNextButton, StyledSpinner, StyledSubmitButton } from "./NavigationButtons.style";

export const NextButton: React.FC<{
  id?: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}> = ({ children, disabled, onClick }) => {
  let loading = useSelector((state: State) => state.layout.loading);

  return (
    <StyledNextButton onClick={onClick} disabled={disabled}>
      {loading ? <LoadingButtonSpinner /> : children}
    </StyledNextButton>
  );
};

export const SubmitButton: React.FC<{
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}> = ({ children, onClick }) => {
  let loading = useSelector((state: State) => state.layout.loading);

  return (
    <StyledSubmitButton onClick={onClick}>
      {loading ? <LoadingButtonSpinner /> : children}
    </StyledSubmitButton>
  );
};
