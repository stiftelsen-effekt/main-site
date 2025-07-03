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
import { usePlausible } from "next-plausible";
import { calculateDonationBreakdown } from "../../../../utils/donationCalculations";

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
      const orderID = useSelector((state: State) => state.donation.swishOrderID);
      const token = useSelector((state: State) => state.donation.swishPaymentRequestToken);
      const donation = useSelector((state: State) => state.donation);
      const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];

      const status = useSwishStatus(orderID);
      const qrCode = useQrCode(token);
      const [{ isDesktop, isMobile }] = useDeviceSelectors();
      const [showQrCode, setShowQrCode] = useState(!isMobile);

      const plausible = usePlausible();

      useEffect(() => {
        if (!token || !isMobile) return;

        triggerSwishApp(token);
      }, [isMobile, token]);

      useEffect(() => {
        if (
          status &&
          isStringEnum(status, ["PAID", "DECLINED", "ERROR", "CANCELLED"]) &&
          status === "PAID"
        ) {
          const breakdown = calculateDonationBreakdown(
            donation.causeAreaAmounts ?? {},
            donation.orgAmounts ?? {},
            donation.causeAreaDistributionType ?? {},
            donation.operationsPercentageModeByCauseArea ?? {},
            donation.operationsPercentageByCauseArea ?? {},
            causeAreas,
            donation.selectionType ?? "single",
            donation.selectedCauseAreaId ?? 1,
            donation.globalOperationsEnabled ?? false,
            donation.globalOperationsPercentage ?? 0,
            donation.operationsConfig?.excludedCauseAreaIds ?? [],
            donation.smartDistributionTotal,
          );
          const totalSumIncludingTip = breakdown.totalAmount;

          plausible("CompletedDonation", {
            revenue: {
              currency: "SEK",
              amount: totalSumIncludingTip || 0,
            },
            props: {
              method: "swish",
              recurring: false,
              kid: donation.kid,
            },
          });
        }
      }, [status]);

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
                            <EffektButton
                              onClick={() => {
                                plausible("DraftSwishAgreementInApp");
                                triggerSwishApp(token);
                              }}
                            >
                              Öppna Swish
                            </EffektButton>
                            <EffektButton
                              onClick={() => {
                                plausible("DraftSwishAgreementWithQR");
                                setShowQrCode(true);
                              }}
                            >
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

            <Referrals
              text={{
                referrals_title: referrals.referrals_title,
                other_referral_input_placeholder: referrals.other_referral_input_placeholder,
              }}
            />
          </PaneContainer>
        </Pane>
      );
    }),
  {
    ssr: false,
  },
);
