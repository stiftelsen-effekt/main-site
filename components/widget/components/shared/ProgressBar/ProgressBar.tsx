import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { ProgressContainer, ProgressCircle, ProgressLine } from "./ProgressBar.style";

export const ProgressBar: React.FC = () => {
  const paneNumber = useSelector((state: State) => state.layout.paneNumber);
  const numberOfPanes = 3;
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);

  const progressPercentage = paneNumber * 25 + (hasAnswerredReferral ? 25 : 0);

  const points = [];
  for (let i = 0; i < numberOfPanes; i++) {
    points.push(<ProgressCircle key={i} filled={paneNumber >= i} />);
  }

  return (
    <ProgressContainer>
      {points.map((p) => p)}
      <ProgressLine />
    </ProgressContainer>
  );
};
