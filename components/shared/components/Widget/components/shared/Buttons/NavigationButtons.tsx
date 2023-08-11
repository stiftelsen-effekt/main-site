import React from "react";
import { useSelector } from "react-redux";
import { LoadingButtonSpinner } from "../../../../Spinner/LoadingButtonSpinner";
import { State } from "../../../store/state";
import { StyledNextButton, StyledSubmitButton } from "./NavigationButtons.style";

export const NextButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  let loading = useSelector((state: State) => state.layout.loading);

  return (
    <StyledNextButton {...props}>{loading ? <LoadingButtonSpinner /> : children}</StyledNextButton>
  );
};

export const SubmitButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  let loading = useSelector((state: State) => state.layout.loading);

  return (
    <StyledSubmitButton {...props}>
      {loading ? <LoadingButtonSpinner /> : children}
    </StyledSubmitButton>
  );
};
