import { Reducer } from "redux";
import { isType } from "typescript-fsa";
import { Referrals } from "../state";
import { fetchReferralsAction } from "./actions";
import { ReferralActionTypes } from "./types";

const initialState: Referrals = {};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Layout} state The current state of the Layout
 * @param {LayoutActionTypes} action An action mutating the current Layout state
 */

export const referralReducer: Reducer<Referrals, ReferralActionTypes> = (
  state: Referrals = initialState,
  action: ReferralActionTypes
) => {
  if (isType(action, fetchReferralsAction.done)) {
    return {
      ...state,
      referrals: action.payload.result,
    };
  }

  return state;
};
