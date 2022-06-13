import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WidgetContext } from "../../../../main/layout";
import { prevPane } from "../../../store/layout/actions";
import { State } from "../../../store/state";
import {
  ProgressContainer,
  ProgressCircle,
  ProgressLine,
  HeaderContainer,
  ActionButton,
} from "./ProgressBar.style";

export const ProgressBar: React.FC = () => {
  const numberOfPanes = 3;
  const dispatch = useDispatch();
  const paneNumber = useSelector((state: State) => state.layout.paneNumber);
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  const progressPercentage = paneNumber * 25 + (hasAnswerredReferral ? 25 : 0);

  const points = [];
  for (let i = 0; i < numberOfPanes; i++) {
    points.push(<ProgressCircle key={i} filled={paneNumber >= i} />);
  }

  return (
    <HeaderContainer>
      <ActionButton active={paneNumber === 0} onClick={() => dispatch(prevPane())}>
        ←
      </ActionButton>
      <ProgressContainer>
        {points.map((p) => p)}
        <ProgressLine />
      </ProgressContainer>
      <ActionButton onClick={() => setWidgetOpen(false)}>✕</ActionButton>
    </HeaderContainer>
  );
};
