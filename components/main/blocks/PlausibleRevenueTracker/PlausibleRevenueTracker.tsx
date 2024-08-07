import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
      }
    }
  }, [router.query]);

  return null;
};
