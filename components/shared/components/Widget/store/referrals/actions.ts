import actionCreatorFactory from "typescript-fsa";
import { ReferralData, ReferralType } from "../../types/Temp";
import { ReferralActionTypes, SELECT_REFERRAL, SET_OTHER_TEXT } from "./types";

const actionCreator = actionCreatorFactory();

export const fetchReferralsAction = actionCreator.async<undefined, [ReferralType], Error>(
  "FETCH_REFERRALS",
);

export const submitReferralAction = actionCreator.async<ReferralData, boolean, Error>(
  "SUBMIT_REFERRAL",
);

export function selectReferralAction(ref: ReferralData): ReferralActionTypes {
  return {
    type: SELECT_REFERRAL,
    payload: {
      ref,
    },
  };
}

export function setOtherText(text: string): ReferralActionTypes {
  return {
    type: SET_OTHER_TEXT,
    payload: {
      text,
    },
  };
}
