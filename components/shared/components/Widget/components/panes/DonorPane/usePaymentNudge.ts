import { useEffect, useMemo, useState } from "react";
import { PaymentMethod, RecurringDonation } from "../../../types/Enums";
import { PaymentMethodId, PaymentMethodNudge, WidgetProps } from "../../../types/WidgetProps";
import { thousandize, getFormattingLocale } from "../../../../../../../util/formatting";

export const paymentMethodIdMap: Partial<Record<PaymentMethod, PaymentMethodId>> = {
  [PaymentMethod.VIPPS]: "vipps",
  [PaymentMethod.BANK]: "bank",
  [PaymentMethod.SWISH]: "swish",
  [PaymentMethod.AUTOGIRO]: "autogiro",
  [PaymentMethod.AVTALEGIRO]: "avtalegiro",
  [PaymentMethod.QUICKPACK_MOBILEPAY]: "quickpay_mobilepay",
  [PaymentMethod.QUICKPAY_CARD]: "quickpay_card",
  [PaymentMethod.DKBANK]: "dkbank",
};

interface UsePaymentNudgeParams {
  nudges: PaymentMethodNudge[] | undefined;
  selectedPaymentMethod: PaymentMethod | undefined;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
  donationSum: number | undefined;
  isRecurring: boolean;
  paymentOptionsRef: React.RefObject<HTMLDivElement | null>;
  locale: string;
}

interface UsePaymentNudgeResult {
  activeNudge: PaymentMethodNudge | null;
  nudgeMessageText: string | null;
  nudgeArrowLeft: number | null;
}

export function usePaymentNudge({
  nudges,
  selectedPaymentMethod,
  paymentMethods,
  donationSum,
  isRecurring,
  paymentOptionsRef,
  locale,
}: UsePaymentNudgeParams): UsePaymentNudgeResult {
  const [nudgeArrowLeft, setNudgeArrowLeft] = useState<number | null>(null);

  const formattingLocale = useMemo(() => getFormattingLocale(locale), [locale]);

  const selectedPaymentMethodId = useMemo(
    () => (selectedPaymentMethod ? paymentMethodIdMap[selectedPaymentMethod] : undefined),
    [selectedPaymentMethod],
  );

  const activeNudge = useMemo(() => {
    if (!nudges || nudges.length === 0) return null;
    if (!selectedPaymentMethodId) return null;
    if (!donationSum || donationSum <= 0) return null;

    const recurringType = isRecurring ? "recurring" : "single";

    return (
      nudges.find((nudge) => {
        const fromId = nudge.from_method?._id;
        const toId = nudge.to_method?._id;
        if (!fromId || !toId) return false;
        if (fromId !== selectedPaymentMethodId) return false;
        if (nudge.minimum_amount && donationSum < nudge.minimum_amount) return false;
        if (
          nudge.recurring_type &&
          nudge.recurring_type !== "both" &&
          nudge.recurring_type !== recurringType
        ) {
          return false;
        }
        const targetAvailable = paymentMethods.some((method) => method._id === toId);
        return targetAvailable;
      }) || null
    );
  }, [nudges, selectedPaymentMethodId, donationSum, isRecurring, paymentMethods]);

  const nudgeMessageText = useMemo(() => {
    if (!activeNudge || !activeNudge.message) return null;

    const amount = donationSum;
    const fromId = activeNudge.from_method?._id;
    const toId = activeNudge.to_method?._id;
    if (!amount || amount <= 0 || !fromId || !toId) {
      return activeNudge.message.replace(/\{savings\}/g, "–");
    }

    const calculateCost = (methodId: PaymentMethodId) => {
      const method = paymentMethods.find((m) => m._id === methodId);
      const transactionCost = method?.transaction_cost;
      if (!transactionCost) {
        return { cost: 0, hasData: false };
      }

      const percentageFee = transactionCost.percentage_fee ?? 0;
      const fixedFee = transactionCost.fixed_fee ?? 0;
      const hasData =
        transactionCost.percentage_fee !== undefined || transactionCost.fixed_fee !== undefined;

      return {
        cost: (percentageFee / 100) * amount + fixedFee,
        hasData,
      };
    };

    const fromCost = calculateCost(fromId);
    const toCost = calculateCost(toId);
    const hasCostData = fromCost.hasData || toCost.hasData;
    const savings = hasCostData ? Math.max(fromCost.cost - toCost.cost, 0) : null;
    const formattedSavings =
      savings !== null ? thousandize(Math.round(savings), formattingLocale) : null;

    return activeNudge.message.replace(/\{savings\}/g, formattedSavings ?? "–");
  }, [activeNudge, donationSum, paymentMethods, formattingLocale]);

  useEffect(() => {
    if (!activeNudge?.to_method?._id || !paymentOptionsRef.current) {
      setNudgeArrowLeft(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      const container = paymentOptionsRef.current;
      if (!container) return;

      const target = container.querySelector<HTMLElement>(
        `[data-method-id="${activeNudge.to_method?._id}"]`,
      );
      if (target) {
        const childOfContainer = container.querySelector("div");
        const radioButtonChoices = childOfContainer?.querySelectorAll("label");
        if (!radioButtonChoices) {
          setNudgeArrowLeft(null);
          return;
        }

        let offset = 0;
        for (const radioButtonChoice of Array.from(radioButtonChoices)) {
          if (radioButtonChoice.dataset.methodId === activeNudge.to_method?._id) {
            break;
          }
          offset += radioButtonChoice.clientWidth;
        }
        // Circle is 1.5em wide, so to get to the center of the circle, we need to add 0.75em
        setNudgeArrowLeft(offset + 0.75 * 20 + 20);
      } else {
        setNudgeArrowLeft(null);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [activeNudge?.to_method?._id, paymentMethods, selectedPaymentMethodId]);

  return {
    activeNudge,
    nudgeMessageText,
    nudgeArrowLeft,
  };
}
