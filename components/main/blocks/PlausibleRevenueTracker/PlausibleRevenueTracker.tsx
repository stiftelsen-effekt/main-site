import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getEstimatedLtv } from "../../../../util/ltv";
import { PaymentMethod } from "../../../shared/components/Widget/types/Enums";

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
      const { revenue, method, recurring, kid } = router.query;
      if (revenue && method && recurring && kid) {
        plausible(type === "donation" ? "CompletedDonation" : "StartedAgreement", {
          revenue: {
            currency: currency,
            amount: parseFloat(revenue as string),
          },
          props: {
            method: method as string,
            recurring: recurring === "true",
            kid: kid as string,
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
          if ((method as string).toLowerCase() === "avtalegiro") {
            paymentMethod = PaymentMethod.AVTALEGIRO;
          } else if ((method as string).toLowerCase() === "vipps") {
            paymentMethod = PaymentMethod.VIPPS;
          }

          if (typeof paymentMethod !== "undefined") {
            getEstimatedLtv({ method: paymentMethod, sum: parseFloat(revenue as string) }).then(
              (ltv) => {
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
              },
            );
          }
        }
      }
    }
  }, [router.query]);

  return null;
};
