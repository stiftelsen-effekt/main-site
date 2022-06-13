import { Reducer } from "redux";
import { isType } from "typescript-fsa";
import { Layout } from "../state";
import { fetchOrganizationsAction } from "./actions";
import {
  SET_PANE_NUMBER,
  LayoutActionTypes,
  SELECT_PRIVACY_POLICY,
  SET_ANSWERED_REFERRAL,
  SET_HEIGHT,
  INCREMENT_CURRENT_PANE,
  DECREMENT_CURRENT_PANE,
  SET_LOADING,
} from "./types";

const initialState: Layout = {
  privacyPolicy: false,
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
  action: LayoutActionTypes
) => {
  if (isType(action, fetchOrganizationsAction.done)) {
    return {
      ...state,
      organizations: action.payload.result,
    };
  }

  switch (action.type) {
    case SELECT_PRIVACY_POLICY:
      return { ...state, privacyPolicy: action.payload.privacyPolicy };
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
    default:
      return state;
  }
};
