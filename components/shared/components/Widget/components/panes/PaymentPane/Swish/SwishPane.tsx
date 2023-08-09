import React from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { Spinner } from "../../../../../Spinner/Spinner";
import { State } from "../../../../store/state";
import { SwishPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { CenterDiv, Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { StyledPaneContent, StyledSpinnerWrapper } from "./SwishPane.style";

function isStringEnum<T extends string>(x: any, e: T[]): x is T {
  return e.includes(x);
}

export const SwishPane: React.FC<{
  referrals: WidgetPane3ReferralsProps;
  config: SwishPaymentMethod;
}> = ({ referrals, config }) => {
  const donorID = useSelector((state: State) => state.donation.donor?.donorID);
  const orderID = useSelector((state: State) => state.donation.swishOrderID);
  const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);

  const { data } = useSWR(
    `/swish/orders/${orderID}/status`,
    orderID
      ? async (endpoint) => {
          const res = await fetch(new URL(endpoint, process.env.NEXT_PUBLIC_EFFEKT_API));
          return (await res.json()) as {
            status: string;
          };
        }
      : null,
    {
      refreshInterval: 1000,
    },
  );

  const title =
    data?.status && isStringEnum(data.status, ["PAID", "DECLINED", "ERROR", "CANCELLED"])
      ? {
          PAID: config.success.title,
          DECLINED: config.declined.title,
          ERROR: config.error.title,
          CANCELLED: config.cancelled.title,
        }[data.status]
      : config.prompt.title;

  const text =
    data?.status && isStringEnum(data.status, ["PAID", "DECLINED", "ERROR", "CANCELLED"])
      ? {
          PAID: config.success.text,
          DECLINED: config.declined.text,
          ERROR: config.error.text,
          CANCELLED: config.cancelled.text,
        }[data.status]
      : config.prompt.text;

  return (
    <Pane>
      <PaneContainer>
        <StyledPaneContent>
          <PaneTitle>{title}</PaneTitle>
          {text ? <p>{text}</p> : null}
          {!data?.status ||
          !isStringEnum(data.status, ["PAID", "DECLINED", "ERROR", "CANCELLED"]) ? (
            <StyledSpinnerWrapper>
              <Spinner />
            </StyledSpinnerWrapper>
          ) : null}
        </StyledPaneContent>
        {/* Always show referrals for anonymous donors (ID 1464) */}
        {(!hasAnswerredReferral || donorID == 1464) && (
          <Referrals
            text={{
              pane3_referrals_title: referrals.pane3_referrals_title,
            }}
          />
        )}
      </PaneContainer>
    </Pane>
  );
};
