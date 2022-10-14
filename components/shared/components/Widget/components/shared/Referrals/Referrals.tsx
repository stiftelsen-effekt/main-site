import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EffektButton, EffektButtonType } from "../../../../EffektButton/EffektButton";
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

export const Referrals: React.FC<{ text: WidgetPane3ReferralsProps }> = ({ text }) => {
  const dispatch = useDispatch();
  const OTHER_REFERRAL_ID = 10;

  const referrals = useSelector((state: State) => state.referrals.referrals);
  const selectedReferrals = useSelector((state: State) => state.referrals.selectedReferrals);
  const otherText = useSelector((state: State) => state.referrals.otherText);

  return (
    <div>
      <div style={{ position: "relative", left: "-40px" }}>
        <svg height="2" width="576" style={{ position: "absolute", left: "0", top: "0" }}>
          <g fill="none" stroke="currentcolor" strokeWidth="1">
            <path strokeDasharray="12,12" strokeDashoffset="6" d="M0 1 l576 0" />
          </g>
          Sorry, your browser does not support inline SVG.
        </svg>
      </div>
      <PaneTitle>{text.pane3_referrals_title}</PaneTitle>
      <ReferralButtonsWrapper>
        {referrals?.map((ref) => (
          <EffektButton
            squared
            type={EffektButtonType.SECONDARY}
            cy={`referral-button-${ref.id}`}
            key={ref.id}
            selected={selectedReferrals.includes(ref.id)}
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
      {selectedReferrals.includes(OTHER_REFERRAL_ID) && (
        <ReferralTextInput
          data-cy="referral-text-input"
          type="text"
          placeholder="Skriv inn"
          value={otherText}
          onChange={(e) => {
            dispatch(setOtherText(e.currentTarget.value));
            dispatch(
              submitReferralAction.started({
                referralID: 10,
                active: true,
                comment: e.currentTarget.value,
              }),
            );
          }}
        />
      )}
    </div>
  );
};
