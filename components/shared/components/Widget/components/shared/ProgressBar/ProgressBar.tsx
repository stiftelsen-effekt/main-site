import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WidgetContext } from "../../../../../../main/layout/layout";
import { prevPane } from "../../../store/layout/actions";
import { State } from "../../../store/state";
import {
  ProgressContainer,
  ProgressCircle,
  ProgressLine,
  HeaderContainer,
  ActionButton,
} from "./ProgressBar.style";
import { Dispatch } from "@reduxjs/toolkit";
import { LayoutActionTypes } from "../../../store/layout/types";

export const ProgressBar: React.FC<{ inline?: boolean }> = ({ inline }) => {
  const numberOfPanes = 3;
  const dispatch = useDispatch<Dispatch<LayoutActionTypes>>();
  const paneNumber = useSelector((state: State) => state.layout.paneNumber);
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  const points = [];
  for (let i = 0; i < numberOfPanes; i++) {
    points.push(<ProgressCircle key={i} filled={(paneNumber >= i).toString()} />);
  }

  return (
    <HeaderContainer>
      <ActionButton
        data-cy="back-button"
        disabled={paneNumber === 0}
        active={(paneNumber === 0).toString()}
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
      {!inline && (
        <ActionButton
          data-cy="close-widget"
          onClick={(e) => {
            setWidgetContext({ ...widgetContext, open: false });
            e.currentTarget.blur();
          }}
        >
          ✕
        </ActionButton>
      )}
    </HeaderContainer>
  );
};
