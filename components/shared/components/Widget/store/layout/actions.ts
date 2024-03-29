import actionCreatorFactory from "typescript-fsa";
import {
  DECREMENT_CURRENT_PANE,
  INCREMENT_CURRENT_PANE,
  LayoutActionTypes,
  SET_ANSWERED_REFERRAL,
  SET_LOADING,
  SET_PANE_NUMBER,
} from "./types";
import { CauseArea } from "../../types/CauseArea";

const actionCreator = actionCreatorFactory();

export function setPaneNumber(paneNumber: number): LayoutActionTypes {
  return {
    type: SET_PANE_NUMBER,
    payload: {
      paneNumber,
    },
  };
}

export function nextPane(): LayoutActionTypes {
  return {
    type: INCREMENT_CURRENT_PANE,
  };
}

export function prevPane(): LayoutActionTypes {
  return {
    type: DECREMENT_CURRENT_PANE,
  };
}

export function setAnsweredReferral(answeredReferral: boolean): LayoutActionTypes {
  return {
    type: SET_ANSWERED_REFERRAL,
    payload: {
      answeredReferral,
    },
  };
}

export function setLoading(loading: boolean): LayoutActionTypes {
  return {
    type: SET_LOADING,
    payload: loading,
  };
}

export const fetchCauseAreasAction = actionCreator.async<undefined, CauseArea[], Error>(
  "FETCH_CAUSEAREAS",
);
