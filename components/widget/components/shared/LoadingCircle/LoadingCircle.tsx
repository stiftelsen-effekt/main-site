import React from "react";
import { LoadingCircleWrapper, SpinningCircle } from "./LoadingCircle.style";

export const LoadingCircle: React.FC = () => {
  return (
    <LoadingCircleWrapper>
      <SpinningCircle />
    </LoadingCircleWrapper>
  );
};
