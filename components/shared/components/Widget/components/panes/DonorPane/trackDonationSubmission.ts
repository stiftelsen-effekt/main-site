import { PaymentMethod } from "../../../types/Enums";
import { getEstimatedLtv } from "../../../../../../../util/ltv";

interface TrackDonationParams {
  isAnonymous: boolean;
  isRecurring: boolean;
  method: PaymentMethod | undefined;
  sum: number | undefined;
  taxDeduction: boolean;
  newsletter: boolean;
  plausible: (eventName: string, options?: { props: Record<string, unknown> }) => void;
}

export function trackDonationSubmission({
  isAnonymous,
  isRecurring,
  method,
  sum,
  taxDeduction,
  newsletter,
  plausible,
}: TrackDonationParams): void {
  if (isAnonymous) return;

  plausible("SubmitDonorPane", {
    props: {
      donorType: isAnonymous ? 0 : 1,
      taxDeduction,
      newsletter,
      method,
    },
  });

  if (isRecurring) {
    trackRecurringDonation({ method, sum, plausible });
  } else {
    trackSingleDonation({ method, sum, plausible });
  }
}

function trackRecurringDonation({
  method,
  sum,
  plausible,
}: Pick<TrackDonationParams, "method" | "sum" | "plausible">): void {
  if (!method) return;

  if (method === PaymentMethod.VIPPS) plausible("SelectVippsRecurring", { props: {} });
  if (method === PaymentMethod.AVTALEGIRO) plausible("SelectAvtaleGiro", { props: {} });
  if (method === PaymentMethod.AUTOGIRO) plausible("SelectAutoGiro", { props: {} });

  if (sum) {
    getEstimatedLtv({ method, sum }).then((ltv) => {
      trackFacebookLead(ltv ?? undefined);
    });
  }
}

function trackSingleDonation({
  method,
  sum,
  plausible,
}: Pick<TrackDonationParams, "method" | "sum" | "plausible">): void {
  if (method === PaymentMethod.VIPPS) plausible("SelectSingleVippsPayment", { props: {} });
  if (method === PaymentMethod.SWISH) plausible("SelectSwishSingle", { props: {} });
  if (method === PaymentMethod.BANK) plausible("SelectBankSingle", { props: {} });

  trackFacebookLead(sum ?? undefined);
}

function trackFacebookLead(value: number | undefined): void {
  if (typeof window === "undefined") return;
  // @ts-ignore
  if (typeof window.fbq !== "undefined" && window.fbq !== null) {
    // @ts-ignore
    window.fbq("track", "Lead", {
      value,
      currency: "NOK",
    });
  }
}
