import { isType } from "typescript-fsa";
import { registerDonationAction } from "../donation/actions";
import { Layout } from "../state";
import { fetchCauseAreasAction } from "./actions";
import {
  SET_PANE_NUMBER,
  LayoutActionTypes,
  SET_ANSWERED_REFERRAL,
  SET_HEIGHT,
  INCREMENT_CURRENT_PANE,
  DECREMENT_CURRENT_PANE,
  SET_LOADING,
} from "./types";
import { Reducer } from "@reduxjs/toolkit";

const initialState: Layout = {
  paneNumber: 0,
  height: 512,
  loading: false,
};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Layout} state The current state of the Layout
 * @param {LayoutActionTypes} action An action mutating the current Layout state
 */

export const layoutReducer: Reducer<Layout, LayoutActionTypes> = (
  state: Layout = initialState,
  action: LayoutActionTypes,
): Layout => {
  if (isType(action, fetchCauseAreasAction.done)) {
    return {
      ...state,
      causeAreas: action.payload.result,
    };
  }

  switch (action.type) {
    case SET_PANE_NUMBER:
      return { ...state, paneNumber: action.payload.paneNumber };
    case INCREMENT_CURRENT_PANE:
      return { ...state, paneNumber: state.paneNumber + 1 };
    case DECREMENT_CURRENT_PANE:
      return { ...state, paneNumber: state.paneNumber - 1 };
    case SET_ANSWERED_REFERRAL:
      return { ...state, answeredReferral: action.payload.answeredReferral };
    case SET_HEIGHT:
      return { ...state, height: action.payload.height };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case registerDonationAction.started.type:
      return { ...state, loading: true };
    case registerDonationAction.done.type:
      return { ...state, loading: false };
    case registerDonationAction.failed.type:
      return { ...state, loading: false };
    default:
      return state;
  }
};
