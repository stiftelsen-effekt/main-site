import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getEstimatedLtv } from "../../../../util/ltv";
import { PaymentMethod } from "../../../shared/components/Widget/types/Enums";

// Define our tracking data interface
interface TrackingData {
  revenue: string;
  method: string;
  recurring: boolean;
  kid: string;
}

export const PlausibleRevenueTracker: React.FC<{
  enabled?: boolean;
  locale: string;
  type: "agreement" | "donation";
}> = ({ enabled, locale, type }) => {
  const plausible = usePlausible();
  const router = useRouter();

  let currency = "NOK";
  if (locale === "sv") {
    currency = "SEK";
  }

  useEffect(() => {
    if (enabled) {
      // Try to decode the plausible parameter if it exists
      const { plausible: plausibleParam } = router.query;

      if (plausibleParam) {
        try {
          // Decode the base64 string and parse the JSON
          const trackingData: TrackingData = JSON.parse(
            Buffer.from(plausibleParam as string, "base64").toString("utf-8"),
          );

          const { revenue, method, recurring, kid } = trackingData;

          if (revenue && method && kid) {
            plausible(type === "donation" ? "CompletedDonation" : "StartedAgreement", {
              revenue: {
                currency: currency,
                amount: parseFloat(revenue),
              },
              props: {
                method: method,
                recurring: recurring,
                kid: kid,
              },
            });

            if (type === "donation") {
              // Facebook Pixel tracking
              // @ts-ignore
              if (window.fbq) {
                // @ts-ignore
                window.fbq("track", "Purchase", {
                  value: revenue,
                  currency: currency,
                });
              }
            } else {
              let paymentMethod: PaymentMethod | undefined;
              if (method.toLowerCase() === "avtalegiro") {
                paymentMethod = PaymentMethod.AVTALEGIRO;
              } else if (method.toLowerCase() === "vipps") {
                paymentMethod = PaymentMethod.VIPPS;
              }

              if (typeof paymentMethod !== "undefined") {
                getEstimatedLtv({ method: paymentMethod, sum: parseFloat(revenue) }).then((ltv) => {
                  // Facebook Pixel tracking
                  // @ts-ignore
                  if (window.fbq) {
                    // @ts-ignore
                    window.fbq("track", "Subscribe", {
                      value: revenue,
                      currency: currency,
                      predicted_ltv: ltv,
                    });
                  }
                });
              }
            }
          }
        } catch (error) {
          console.error("Failed to parse plausible tracking data:", error);
        }
      }
    }
  }, [router.query, plausible, currency, type, enabled]);

  return null;
};

/**
 * Helper function to decode the plausible parameter back into tracking data
 */
export const decodePlausibleData = (encoded: string): TrackingData | null => {
  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
  } catch (error) {
    console.error("Failed to decode plausible tracking data:", error);
    return null;
  }
};
