import { dispatch } from "d3";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EffektButton } from "../../../../elements/effektbutton";
import { submitReferralAction } from "../../../store/referrals/actions";
import { State } from "../../../store/state";
import { PaneTitle } from "../../panes/Panes.style";
import { ReferralsWrapper, ReferralButtonsWrapper, ReferralTextInput } from "../../panes/PaymentPane/Bank/ReferralPane.style";

export const Referrals: React.FC = () => { 
    const referrals = useSelector((state: State) => state.referrals.referrals);
    const [selectedReferral, setSelectedReferral] = useState(0);
    const [otherInput, setOtherInput] = useState("");
    const dispatch = useDispatch();

    return (
        <ReferralsWrapper>
        <PaneTitle>Hvor hørte du om oss?</PaneTitle>
        <ReferralButtonsWrapper>
          {referrals?.map((ref) => (
            <EffektButton
              cy={`referral-button-${ref.id}`}
              key={ref.id}
              selected={ref.id == selectedReferral}
              onClick={() => {
                setSelectedReferral(ref.id);
                dispatch(
                  submitReferralAction.started({
                    referralID: ref.id,
                    comment: otherInput
                  }),
                );
              }}
            >
              {ref.name}
            </EffektButton>
          ))}
        </ReferralButtonsWrapper>
        {selectedReferral == 10 &&
          <ReferralTextInput
            data-cy="referral-text-input"
            type="text"
            placeholder="Skriv inn"
            onChange={(e) => {
              setOtherInput(e.target.value)
              dispatch(
                submitReferralAction.started({
                  referralID: 10,
                  comment: e.target.value
                }),
              );
            }}
          />
        }
      </ReferralsWrapper>
    )
}