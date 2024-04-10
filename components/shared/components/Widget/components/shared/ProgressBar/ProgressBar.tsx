import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WidgetContext } from "../../../../../../main/layout/layout";
import { prevPane } from "../../../store/layout/actions";
import { State } from "../../../store/state";
import { WidgetTooltipContext } from "../../Widget";
import {
  ProgressContainer,
  ProgressCircle,
  ProgressLine,
  HeaderContainer,
  ActionButton,
  TooltipWrapper,
} from "./ProgressBar.style";

export const ProgressBar: React.FC = () => {
  const numberOfPanes = 3;
  const dispatch = useDispatch();
  const paneNumber = useSelector((state: State) => state.layout.paneNumber);
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const [tooltip, setTooltip] = useContext(WidgetTooltipContext);

  const points = [];
  for (let i = 0; i < numberOfPanes; i++) {
    points.push(<ProgressCircle key={i} filled={paneNumber >= i} />);
  }

  return (
    <HeaderContainer>
      {tooltip !== null && <TooltipWrapper>{tooltip}</TooltipWrapper>}
      <ActionButton
        data-cy="back-button"
        disabled={paneNumber === 0}
        active={paneNumber === 0}
        onClick={(e) => {
          dispatch(prevPane());
          e.currentTarget.blur();
        }}
      >
        ←
      </ActionButton>
      <ProgressContainer>
        {points.map((p) => p)}
        <ProgressLine />
      </ProgressContainer>
      <ActionButton
        data-cy="close-widget"
        onClick={(e) => {
          setWidgetContext({ ...widgetContext, open: false });
          e.currentTarget.blur();
        }}
      >
        ✕
      </ActionButton>
    </HeaderContainer>
  );
};
