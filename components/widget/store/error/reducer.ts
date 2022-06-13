import { Reducer } from "redux";
import { Error } from "../state";
import { ErrorActionTypes, SET_ERROR } from "./types";

const initialState: Error = {
  message: "",
  isVisible: false,
};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Error} state The current state of the Layout
 * @param {ErrorActionTypes} action An action mutating the current Layout state
 */

export const errorReducer: Reducer<Error, ErrorActionTypes> = (
  state: Error = initialState,
  action: ErrorActionTypes
) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        message: action.payload.message,
        isVisible: action.payload.isVisible,
      };
    default:
      return state;
  }
};
