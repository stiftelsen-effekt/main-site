import { isType } from "typescript-fsa";
import { Referrals } from "../state";
import { fetchReferralsAction } from "./actions";
import { ReferralActionTypes, SELECT_REFERRAL, SET_OTHER_TEXT } from "./types";
import { Reducer } from "@reduxjs/toolkit";

const initialState: Referrals = {
  websiteSession: new Date().getTime().toString(),
  selectedReferrals: [],
  otherText: "",
};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Layout} state The current state of the Layout
 * @param {LayoutActionTypes} action An action mutating the current Layout state
 */

export const referralReducer: Reducer<Referrals, ReferralActionTypes> = (
  state: Referrals = initialState,
  action: ReferralActionTypes,
) => {
  if (isType(action, fetchReferralsAction.done)) {
    return {
      ...state,
      referrals: action.payload.result,
    };
  }

  if (action.type === SELECT_REFERRAL) {
    if (action.payload.ref.active) {
      return {
        ...state,
        selectedReferrals: [...state.selectedReferrals, action.payload.ref.referralID],
      };
    } else {
      return {
        ...state,
        selectedReferrals: state.selectedReferrals.filter(
          (referralID) => referralID !== action.payload.ref.referralID,
        ),
      };
    }
  }

  if (action.type === SET_OTHER_TEXT) {
    return {
      ...state,
      otherText: action.payload.text,
    };
  }

  return state;
};
