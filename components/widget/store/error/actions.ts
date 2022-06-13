import { ErrorActionTypes, SET_ERROR } from "./types";

export function setError(
  message: string,
  isVisible: boolean
): ErrorActionTypes {
  return {
    type: SET_ERROR,
    payload: {
      message,
      isVisible,
    },
  };
}
