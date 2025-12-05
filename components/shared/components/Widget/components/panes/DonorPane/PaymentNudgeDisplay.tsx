import React from "react";
import AnimateHeight from "react-animate-height";
import { Info } from "react-feather";
import { PaymentNudge, PaymentNudgeContainer, PaymentNudgeWrapper } from "./DonorPane.style";

interface PaymentNudgeDisplayProps {
  isVisible: boolean;
  message: string | null;
  arrowLeft: number | null;
}

export const PaymentNudgeDisplay: React.FC<PaymentNudgeDisplayProps> = ({
  isVisible,
  message,
  arrowLeft,
}) => {
  return (
    <PaymentNudgeContainer>
      <AnimateHeight height={isVisible && message ? "auto" : 0} animateOpacity duration={250}>
        {isVisible && message && (
          <PaymentNudgeWrapper
            style={
              arrowLeft !== null
                ? ({
                    ["--nudge-arrow-left" as string]: `${arrowLeft}px`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <PaymentNudge>
              <Info size={22} />
              <div>
                <p>{message}</p>
              </div>
            </PaymentNudge>
          </PaymentNudgeWrapper>
        )}
      </AnimateHeight>
    </PaymentNudgeContainer>
  );
};
