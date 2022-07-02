import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaneTitle } from "../../../../main/widget/components/panes/Panes.style";
import { submitReferralAction } from "../../../../main/widget/store/referrals/actions";
import { State } from "../../../../main/widget/store/state";
import { EffektButton, EffektButtonType } from "../../../../shared/components/EffektButton/EffektButton";
import { ReferralButtonsWrapper, ReferralTextInput } from "../../panes/PaymentPane/Bank/ReferralPane.style";

export const Referrals: React.FC = () => {
    const referrals = useSelector((state: State) => state.referrals.referrals);
    const [selectedReferral, setSelectedReferral] = useState(0);
    const [otherInput, setOtherInput] = useState("");
    const dispatch = useDispatch();

    return (
        <div>
            <div style={{position: "relative", left: "-40px"}}>
                <svg height="2" width="576" style={{position: "absolute", left: "0", top: "0"}}>
                    <g fill="none" stroke="currentcolor" strokeWidth="1">
                        <path strokeDasharray="12,12" strokeDashoffset="6" d="M0 1 l576 0"/>
                    </g>
                    Sorry, your browser does not support inline SVG.
                </svg>
            </div>
            <PaneTitle>Hvor hørte du om oss?</PaneTitle>
            <ReferralButtonsWrapper>
            {referrals?.map((ref) => (
                <EffektButton
                    type={EffektButtonType.SECONDARY}
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
      </div>
    )
}