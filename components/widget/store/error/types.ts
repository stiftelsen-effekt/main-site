export const SET_ERROR = "SET_ERROR";

interface SetError {
  type: typeof SET_ERROR;
  payload: {
    message: string;
    isVisible: boolean;
  };
}

export type ErrorActionTypes = SetError;
