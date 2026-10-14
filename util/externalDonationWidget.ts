import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import type { WidgetContextType } from "../components/main/layout/layout";

/**
 * Some sites use a donation widget hosted by their CRM instead of the one built into this site.
 * For those sites, every donation button sends the donor to the external widget instead of
 * opening the built-in widget pane. Prefilled distributions and sums are not carried over.
 */
type ExternalDonationUrls = {
  default: string;
  recurring: string;
  single: string;
};

const EXTERNAL_DONATION_URLS: Partial<Record<string, ExternalDonationUrls>> = {
  sv: {
    default: "https://ge.geeffektivt.se/_/donation/donationconfiguration",
    recurring: "https://ge.geeffektivt.se/_/donation/donationconfiguration?interval=recurringlock",
    single: "https://ge.geeffektivt.se/_/donation/donationconfiguration?interval=onetimelock",
  },
};

export const getExternalDonationUrls = (locale: string | null | undefined) =>
  locale ? (EXTERNAL_DONATION_URLS[locale] ?? null) : null;

export const usesExternalDonationWidget = (locale: string | null | undefined) =>
  getExternalDonationUrls(locale) !== null;

const parseRecurringQueryParam = (recurring: string | string[] | undefined) => {
  if (recurring === undefined) return undefined;
  const value = (Array.isArray(recurring) ? recurring[0] : recurring).toLowerCase();
  if (["1", "true"].includes(value)) return true;
  if (["0", "false"].includes(value)) return false;
  return undefined;
};

/**
 * Wraps the widget context setter so that opening the widget navigates to the external
 * donation widget when the site uses one. Also handles the `recurring` and `distribution`
 * query params, which otherwise open the built-in widget on page load.
 */
export const useExternalDonationWidget = (
  locale: string | null | undefined,
  widgetContext: WidgetContextType,
  setWidgetContext: Dispatch<SetStateAction<WidgetContextType>>,
): Dispatch<SetStateAction<WidgetContextType>> => {
  const router = useRouter();
  const urls = getExternalDonationUrls(locale);

  useEffect(() => {
    if (!urls || !router.isReady) return;
    const recurring = parseRecurringQueryParam(router.query.recurring);
    if (recurring !== undefined) {
      window.location.href = recurring ? urls.recurring : urls.single;
    } else if (typeof router.query.distribution === "string") {
      window.location.href = urls.default;
    }
  }, [urls, router.isReady, router.query.recurring, router.query.distribution]);

  return useCallback(
    (action) => {
      if (urls) {
        const next = typeof action === "function" ? action(widgetContext) : action;
        if (next.open) {
          window.location.href = urls.default;
          return;
        }
      }
      setWidgetContext(action);
    },
    [urls, widgetContext, setWidgetContext],
  );
};
