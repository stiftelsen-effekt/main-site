import { AnyAction } from "redux";
import { ReferralData } from "../../types/Temp";

export const SELECT_REFERRAL = "SELECT_REFERRAL";
export const SET_OTHER_TEXT = "SET_OTHER_TEXT";

interface SelectReferral {
  type: typeof SELECT_REFERRAL;
  payload: {
    ref: ReferralData;
  };
}

interface SetOtherText {
  type: typeof SET_OTHER_TEXT;
  payload: {
    text: string;
  };
}

export type ReferralActionTypes = SelectReferral | SetOtherText;
