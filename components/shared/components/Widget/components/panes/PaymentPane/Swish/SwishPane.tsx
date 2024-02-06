import { useDeviceSelectors } from "react-device-detect";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import useSWR from "swr";
import { Spinner } from "../../../../../Spinner/Spinner";
import { State } from "../../../../store/state";
import { SwishPaymentMethod, WidgetPane3ReferralsProps } from "../../../../types/WidgetProps";
import { Referrals } from "../../../shared/Referrals/Referrals";
import { CenterDiv, Pane, PaneContainer, PaneTitle } from "../../Panes.style";
import { Stack, StyledPaneContent, StyledSpinnerWrapper } from "./SwishPane.style";
import dynamic from "next/dynamic";
import { EffektButton } from "../../../../../EffektButton/EffektButton";

function isStringEnum<T extends string>(x: any, e: T[]): x is T {
  return e.includes(x);
}

function useSwishStatus(orderID?: string) {
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

  return data?.status;
}

function useQrCode(token?: string) {
  return useMemo(
    () => new URL(`/swish/qr/${token}`, process.env.NEXT_PUBLIC_EFFEKT_API).toString(),
    [token],
  );
}

/** https://developer.swish.nu/documentation/guides/trigger-the-swish-app#browser */
function triggerSwishApp(token: string) {
  // @ts-expect-error
  window.location = `swish://paymentrequest?token=${token}`;
}

export const SwishPane = dynamic<{
  referrals: WidgetPane3ReferralsProps;
  config: SwishPaymentMethod;
}>(
  () =>
    Promise.resolve(({ referrals, config }) => {
      const donorID = useSelector((state: State) => state.donation.donor?.donorID);
      const orderID = useSelector((state: State) => state.donation.swishOrderID);
      const token = useSelector((state: State) => state.donation.swishPaymentRequestToken);
      const hasAnswerredReferral = useSelector((state: State) => state.layout.answeredReferral);

      const status = useSwishStatus(orderID);
      const qrCode = useQrCode(token);
      const [{ isDesktop, isMobile }] = useDeviceSelectors();
      const [showQrCode, setShowQrCode] = useState(!isMobile);

      useEffect(() => {
        if (!token || !isMobile) return;

        triggerSwishApp(token);
      }, [isMobile, token]);

      const title =
        status && isStringEnum(status, ["PAID", "DECLINED", "ERROR", "CANCELLED"])
          ? {
              PAID: config.success.title,
              DECLINED: config.declined.title,
              ERROR: config.error.title,
              CANCELLED: config.cancelled.title,
            }[status]
          : config.prompt.title;

      const text =
        status && isStringEnum(status, ["PAID", "DECLINED", "ERROR", "CANCELLED"])
          ? {
              PAID: config.success.text,
              DECLINED: config.declined.text,
              ERROR: config.error.text,
              CANCELLED: config.cancelled.text,
            }[status]
          : showQrCode
          ? config.prompt.scan_text
          : config.prompt.redirect_text;

      return (
        <Pane>
          <PaneContainer>
            <StyledPaneContent>
              <PaneTitle>{title}</PaneTitle>
              {text ? <p>{text}</p> : null}
              {!status || !isStringEnum(status, ["PAID", "DECLINED", "ERROR", "CANCELLED"]) ? (
                <>
                  {qrCode && showQrCode ? (
                    <CenterDiv>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCode} alt="" />
                    </CenterDiv>
                  ) : (
                    <CenterDiv>
                      <Stack>
                        <StyledSpinnerWrapper>
                          <Spinner />
                        </StyledSpinnerWrapper>
                        {token && !isDesktop ? (
                          <>
                            <EffektButton onClick={() => triggerSwishApp(token)}>
                              Öppna Swish
                            </EffektButton>
                            <EffektButton onClick={() => setShowQrCode(true)}>
                              Visa QR-kod istället
                            </EffektButton>
                          </>
                        ) : null}
                      </Stack>
                    </CenterDiv>
                  )}
                </>
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
    }),
  {
    ssr: false,
  },
);
