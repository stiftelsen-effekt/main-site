import { Reducer } from "redux";
import { isType } from "typescript-fsa";
import { PaymentInfo } from "../state";
import { registerPaymentAction } from "./actions";
import { PaymentInfoActionTypes } from "./types";

const initialState: PaymentInfo = {};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Layout} state The current state of the Layout
 * @param {LayoutActionTypes} action An action mutating the current Layout state
 */

export const paymentInfoReducer: Reducer<
  PaymentInfo,
  PaymentInfoActionTypes
> = (state: PaymentInfo = initialState, action: PaymentInfoActionTypes) => {
  if (isType(action, registerPaymentAction.done)) {
    return {
      ...state,
      referrals: action.payload.result,
    };
  }

  return state;
};
