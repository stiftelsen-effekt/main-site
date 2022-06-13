import actionCreatorFactory from "typescript-fsa";
import { Organization } from "../../types/Organization";
import {
  DECREMENT_CURRENT_PANE,
  INCREMENT_CURRENT_PANE,
  LayoutActionTypes,
  SELECT_PRIVACY_POLICY,
  SET_ANSWERED_REFERRAL,
  SET_LOADING,
  SET_PANE_NUMBER,
} from "./types";

const actionCreator = actionCreatorFactory();

export function selectPrivacyPolicy(privacyPolicy: boolean): LayoutActionTypes {
  return {
    type: SELECT_PRIVACY_POLICY,
    payload: {
      privacyPolicy,
    },
  };
}

export function setPaneNumber(paneNumber: number): LayoutActionTypes {
  return {
    type: SET_PANE_NUMBER,
    payload: {
      paneNumber,
    },
  };
}

export function nextPane(): LayoutActionTypes {
  return {
    type: INCREMENT_CURRENT_PANE,
  };
}

export function prevPane(): LayoutActionTypes {
  return {
    type: DECREMENT_CURRENT_PANE,
  };
}

export function setAnsweredReferral(
  answeredReferral: boolean
): LayoutActionTypes {
  return {
    type: SET_ANSWERED_REFERRAL,
    payload: {
      answeredReferral,
    },
  };
}

export function setLoading(loading: boolean): LayoutActionTypes {
  return {
    type: SET_LOADING,
    payload: loading,
  };
}

export const fetchOrganizationsAction = actionCreator.async<
  undefined,
  Organization[],
  Error
>("FETCH_ORGANIZATIONS");
