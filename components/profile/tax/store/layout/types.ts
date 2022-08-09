export const SELECT_PRIVACY_POLICY = "SELECT_PRIVACY_POLICY";
export const SET_PANE_NUMBER = "SET_PANE_NUMBER";
export const INCREMENT_CURRENT_PANE = "INCREMENT_CURRENT_PANE";
export const DECREMENT_CURRENT_PANE = "DECREMENT_CURRENT_PANE";
export const SET_ANSWERED_REFERRAL = "SET_ANSWERRED_REFERRAL";
export const SET_HEIGHT = "SET_HEIGHT";
export const SET_LOADING = "SET_LOADING";
export const SHOW_SECOND_PANE = "SHOW_SECOND_PANE";

interface SelectPrivacyPolicy {
  type: typeof SELECT_PRIVACY_POLICY;
  payload: {
    privacyPolicy: boolean;
  };
}

interface ShowSecondPane {
  type: typeof SHOW_SECOND_PANE;
  payload: {
    showPane: boolean;
  };
}

interface SetPaneNumber {
  type: typeof SET_PANE_NUMBER;
  payload: {
    paneNumber: number;
  };
}

interface IncrementCurrentPane {
  type: typeof INCREMENT_CURRENT_PANE;
}

interface DecrementCurrentPane {
  type: typeof DECREMENT_CURRENT_PANE;
}

interface SetAnsweredReferral {
  type: typeof SET_ANSWERED_REFERRAL;
  payload: {
    answeredReferral: boolean;
  };
}

interface SetHeight {
  type: typeof SET_HEIGHT;
  payload: {
    height: number;
  };
}

interface SetLoading {
  type: typeof SET_LOADING;
  payload: boolean;
}

export type LayoutActionTypes =
  | SelectPrivacyPolicy
  | ShowSecondPane
  | SetPaneNumber
  | IncrementCurrentPane
  | DecrementCurrentPane
  | SetAnsweredReferral
  | SetHeight
  | SetLoading;
