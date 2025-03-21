import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import {
  selectReferralAction,
  setOtherText,
  submitReferralAction,
} from "../../../store/referrals/actions";
import { State } from "../../../store/state";
import { ReferralData } from "../../../types/Temp";
import { WidgetPane3ReferralsProps } from "../../../types/WidgetProps";
import { PaneTitle } from "../../panes/Panes.style";
import {
  ReferralButtonsWrapper,
  ReferralTextInput,
} from "../../panes/PaymentPane/Bank/ReferralPane.style";
import { ReferralActionTypes } from "../../../store/referrals/types";
import { Action } from "typescript-fsa";
import { Dispatch } from "@reduxjs/toolkit";

export const Referrals: React.FC<{ text: WidgetPane3ReferralsProps }> = ({ text }) => {
  const dispatch = useDispatch<Dispatch<ReferralActionTypes | Action<ReferralData>>>();
  const OTHER_REFERRAL_ID = 10;

  const referrals = useSelector((state: State) => state.referrals.referrals);
  const selectedReferrals = useSelector((state: State) => state.referrals.selectedReferrals);
  const otherText = useSelector((state: State) => state.referrals.otherText);

  return (
    <div>
      <div
        style={{
          position: "relative",
          left: "-40px",
          marginTop: "1.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        <svg height="2" width="576" style={{ position: "absolute", left: "0", top: "0" }}>
          <g fill="none" stroke="currentcolor" strokeWidth="1">
            <path strokeDasharray="12,12" strokeDashoffset="6" d="M0 1 l576 0" />
          </g>
          Sorry, your browser does not support inline SVG.
        </svg>
      </div>
      <PaneTitle>{text.referrals_title}</PaneTitle>
      <ReferralButtonsWrapper>
        {referrals
          ?.filter((ref) => ref.id !== OTHER_REFERRAL_ID)
          .map((ref) => (
            <EffektButton
              squared
              variant={EffektButtonVariant.SECONDARY}
              cy={`referral-button-${ref.id}`}
              key={ref.id}
              selected={selectedReferrals.includes(ref.id)}
              useCheckmark={true}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (selectedReferrals.includes(ref.id)) {
                  const refData: ReferralData = {
                    referralID: ref.id,
                    active: false,
                  };
                  dispatch(selectReferralAction(refData));
                  dispatch(submitReferralAction.started(refData));
                } else {
                  const refData: ReferralData = {
                    referralID: ref.id,
                    active: true,
                  };
                  dispatch(selectReferralAction(refData));
                  dispatch(submitReferralAction.started(refData));
                }

                e.currentTarget.blur();
              }}
            >
              {ref.name}
            </EffektButton>
          ))}
      </ReferralButtonsWrapper>
      <ReferralTextInput
        data-cy="referral-text-input"
        type="text"
        placeholder={text.other_referral_input_placeholder}
        value={otherText}
        onChange={(e) => {
          dispatch(setOtherText(e.currentTarget.value));
          if (e.currentTarget.value.trim() !== "") {
            dispatch(
              submitReferralAction.started({
                referralID: OTHER_REFERRAL_ID,
                active: true,
                comment: e.currentTarget.value,
              }),
            );
          } else {
            dispatch(
              submitReferralAction.started({
                referralID: OTHER_REFERRAL_ID,
                active: false,
              }),
            );
          }
        }}
      />
    </div>
  );
};
