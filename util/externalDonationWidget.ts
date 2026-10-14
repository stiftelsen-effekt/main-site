import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { stegaClean } from "@sanity/client/stega";
import type { WidgetContextType } from "../components/main/layout/layout";
import type { ExternalDonationWidgetConfig } from "../components/shared/components/Widget/types/WidgetProps";

/**
 * Sites can configure an externally hosted donation widget (e.g. one provided by their CRM) in
 * site settings. For those sites, every donation button sends the donor to the external widget
 * instead of opening the built-in widget pane. Prefilled distributions and sums are not carried over.
 */
export type ExternalDonationUrls = {
  default: string;
  recurring: string;
  single: string;
};

export const getExternalDonationUrls = (
  config: ExternalDonationWidgetConfig | null | undefined,
): ExternalDonationUrls | null => {
  const url = stegaClean(config?.url);
  if (!url) return null;
  return {
    default: url,
    recurring: stegaClean(config?.recurring_url) || url,
    single: stegaClean(config?.single_url) || url,
  };
};

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
  urls: ExternalDonationUrls | null,
  widgetContext: WidgetContextType,
  setWidgetContext: Dispatch<SetStateAction<WidgetContextType>>,
): Dispatch<SetStateAction<WidgetContextType>> => {
  const router = useRouter();

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
