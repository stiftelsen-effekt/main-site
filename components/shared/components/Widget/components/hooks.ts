import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  setSum,
  setRecurring,
  setCauseAreaDistributionType,
  setCauseAreaSelection,
  setOrgAmount,
  setPrefilledShares,
} from "../store/donation/actions";
import { RecurringDonation, ShareType } from "../types/Enums";
import { WidgetContext } from "../../../../main/layout/layout";
import { PrefilledDistribution } from "../../../../main/layout/WidgetPane/WidgetPane";
import { CauseArea } from "../types/CauseArea";
import { WidgetProps } from "../types/WidgetProps";
import { paymentMethodConfigurations } from "../config/methods";
import { useDebouncedCallback } from "use-debounce";
import { State } from "../store/state";
import { Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../store/donation/types";
import { setPaneNumber } from "../store/layout/actions";
import { LayoutActionTypes } from "../store/layout/types";

interface UsePrefilledDistributionProps {
  inline: boolean;
  causeAreas: CauseArea[] | undefined;
  prefilledDistribution: PrefilledDistribution | null;
}

export const usePrefilledCauseAreaIds = () => {
  const [widgetContext] = useContext(WidgetContext);

  return useMemo(
    () => new Set(widgetContext.prefilled?.map((area) => area.causeAreaId) ?? []),
    [widgetContext.prefilled],
  );
};

/**
 * Hook to handle prefilled distribution data for the widget
 */
export const usePrefilledDistribution = ({
  inline,
  causeAreas,
  prefilledDistribution,
}: UsePrefilledDistributionProps) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes | LayoutActionTypes>>();
  const [widgetContext] = useContext(WidgetContext);
  const causeAreaAmounts = useSelector((state: State) => state.donation.causeAreaAmounts ?? {});
  // Add a ref to track if we've already applied the prefilled distribution
  const hasAppliedPrefill = useRef(false);

  useEffect(() => {
    // Return early if no cause areas to distribute
    if (!causeAreas || causeAreas.length === 0) {
      return;
    }

    // Skip if inline AND no direct prefilledDistribution was provided
    if (inline && !prefilledDistribution) {
      return;
    }

    // Use directly provided prefilledDistribution if available, otherwise fall back to context
    const prefilled =
      prefilledDistribution || (widgetContext.prefilled ? widgetContext.prefilled : []);

    // If no prefilled data available, return early
    if (prefilled.length === 0) {
      return;
    }

    // Only apply prefill once to avoid overwriting user changes
    // Except if the prefill comes from the context, then we need to reapply it
    if (hasAppliedPrefill.current && !widgetContext.prefilled) {
      return;
    }

    // Accumulate shares across every cause area into one flat org-keyed map (org IDs are
    // unique across cause areas) rather than dispatching setPrefilledShares per cause area,
    // which would otherwise have each cause area's dispatch clobber the previous one's.
    const combinedShares: Record<number, number> = {};
    let hasAnyPrefilledShares = false;
    const prefilledCauseAreas = causeAreas.filter((causeArea) =>
      prefilled.some((prefilledArea) => prefilledArea.causeAreaId === causeArea.id),
    );
    const visibleCauseAreas = causeAreas.filter(
      (causeArea) =>
        causeArea.isActive ||
        prefilledCauseAreas.some((prefilledArea) => prefilledArea.id === causeArea.id),
    );

    if (visibleCauseAreas.length > 1 && prefilledCauseAreas.length > 0) {
      const singlePrefilledCauseArea =
        prefilledCauseAreas.length === 1 ? prefilledCauseAreas[0] : undefined;
      dispatch(
        setCauseAreaSelection(
          singlePrefilledCauseArea ? "single" : "multiple",
          singlePrefilledCauseArea?.id,
        ),
      );
      dispatch(setPaneNumber(1));
    }

    causeAreas.forEach((causeArea) => {
      const prefilledCauseArea = prefilled.find(
        (prefilledArea) => prefilledArea.causeAreaId === causeArea.id,
      );

      if (prefilledCauseArea) {
        const causeAreaAmount = causeAreaAmounts[causeArea.id] || 0;
        const sharesByOrgId = handlePrefilledCauseArea(
          dispatch,
          causeArea,
          prefilledCauseArea,
          causeAreaAmount,
        );
        if (Object.keys(sharesByOrgId).length > 0) {
          hasAnyPrefilledShares = true;
          Object.assign(combinedShares, sharesByOrgId);
        }
      } else {
        resetCauseArea(dispatch, causeArea);
      }
    });

    dispatch(setPrefilledShares(hasAnyPrefilledShares ? combinedShares : null));

    // Mark that we've applied the prefill
    hasAppliedPrefill.current = true;
    // Deliberately excludes causeAreaAmounts - this effect should only re-run when the
    // prefill itself changes, not on every amount keystroke (the amount is only read to
    // seed the prefilled organization once).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inline, widgetContext.prefilled, causeAreas, prefilledDistribution, dispatch]);

  // Reset the ref if prefilled data changes
  useEffect(() => {
    hasAppliedPrefill.current = false;
  }, [prefilledDistribution, widgetContext.prefilled]);
};

/**
 * Hook to handle prefilled sum for the widget
 */
export const usePrefilledSum = ({ inline }: { inline: boolean }) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes>>();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  useEffect(() => {
    if (!inline && widgetContext.prefilledSum !== null) {
      dispatch(setSum(widgetContext.prefilledSum));
    }
  }, [inline, widgetContext.prefilledSum, dispatch]);
};

/**
 * Hook to handle URL query parameters for prefilling the widget
 */
export const useQueryParamsPrefill = ({
  inline,
  causeAreas,
  defaultPaymentType,
}: {
  inline: boolean;
  causeAreas: CauseArea[] | undefined;
  defaultPaymentType: RecurringDonation;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<Dispatch<DonationActionTypes>>();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const hasAppliedQueryParams = useRef(false);

  useEffect(() => {
    if (inline || !router.query || !causeAreas) {
      return;
    }

    if (hasAppliedQueryParams.current) {
      return;
    }

    const { distribution, recurring } = router.query;

    if (distribution && typeof distribution === "string") {
      const prefilledDistribution = parseDistributionQueryParam(distribution);
      setWidgetContext({
        open: true,
        prefilled: prefilledDistribution,
        prefilledSum: null,
      });
      hasAppliedQueryParams.current = true;
    }

    if (recurring !== undefined) {
      const recurringValue = Array.isArray(recurring) ? recurring[0] : recurring;
      const isTruthy = ["1", "true"].includes(recurringValue.toLowerCase());
      const isFalsy = ["0", "false"].includes(recurringValue.toLowerCase());

      if (isTruthy || isFalsy) {
        dispatch(
          setRecurring(isTruthy ? RecurringDonation.RECURRING : RecurringDonation.NON_RECURRING),
        );
        setWidgetContext({ ...widgetContext, open: true });
        hasAppliedQueryParams.current = true;
      }
    }
  }, [inline, router.query, causeAreas, dispatch, setWidgetContext, widgetContext]);

  useEffect(() => {
    dispatch(setRecurring(defaultPaymentType));
  }, [defaultPaymentType, dispatch]);
};

// Helper functions

// Applies a prefilled cause area's organization shares (0-100 each, e.g. from the
// organizations list - one org at 100% - or a CMS-configured distribution link with
// several) as kr amounts of whatever the cause area's amount currently is, and returns
// the applied shares (org ID -> percentage) so the caller can track them for auto-updating
// as the amount changes later.
const handlePrefilledCauseArea = (
  dispatch: any,
  causeArea: CauseArea,
  prefilledCauseArea: PrefilledDistribution[number],
  causeAreaAmount: number,
): Record<number, number> => {
  dispatch(
    setCauseAreaDistributionType(
      causeArea.id,
      causeArea.organizations.length <= 1 || prefilledCauseArea.organizations.length === 0
        ? ShareType.STANDARD
        : ShareType.CUSTOM,
    ),
  );

  const shareByOrgId: Record<number, number> = {};
  prefilledCauseArea.organizations.forEach((org) => {
    if (org.share > 0) shareByOrgId[org.organizationId] = org.share;
  });

  causeArea.organizations.forEach((organization) => {
    const share = shareByOrgId[organization.id] ?? 0;
    dispatch(setOrgAmount(organization.id, Math.round((share / 100) * causeAreaAmount)));
  });

  return shareByOrgId;
};

const resetCauseArea = (dispatch: any, causeArea: CauseArea) => {
  dispatch(setCauseAreaDistributionType(causeArea.id, ShareType.STANDARD));

  causeArea.organizations.forEach((organization) => {
    dispatch(setOrgAmount(organization.id, 0));
  });
};

const parseDistributionQueryParam = (distribution: string): PrefilledDistribution => {
  return distribution.split(",").map((prefilledCauseArea) => {
    const [causeAreaId, share, ...organizations] = prefilledCauseArea.split(":");
    return {
      causeAreaId: parseInt(causeAreaId),
      share: parseFloat(share),
      organizations: organizations.map((organization) => {
        const [organizationId, share] = organization.split("-");
        return {
          organizationId: parseInt(organizationId),
          share: parseFloat(share),
        };
      }),
    };
  });
};

/**
 * Determine available recurring options based on the configured payment methods
 */
export const useAvailableRecurringOptions = (
  paymentMethods: NonNullable<WidgetProps["methods"]>,
) => {
  const recurring = useMemo(
    () =>
      paymentMethods.some((method) => {
        const configuration = paymentMethodConfigurations.find(
          (config) => config.id === method._id,
        );
        return configuration?.recurringOptions.includes(RecurringDonation.RECURRING);
      }),
    [paymentMethods],
  );

  const single = useMemo(
    () =>
      paymentMethods.some((method) => {
        const configuration = paymentMethodConfigurations.find(
          (config) => config.id === method._id,
        );
        return configuration?.recurringOptions.includes(RecurringDonation.NON_RECURRING);
      }),
    [paymentMethods],
  );

  return useMemo(() => ({ recurring, single }), [recurring, single]);
};

/**
 * Determine available payment methods based on the selected recurring option
 */
export const useAvailablePaymentMethods = (paymentMethods: NonNullable<WidgetProps["methods"]>) => {
  const recurring = useSelector((state: State) => state.donation.recurring);

  const availablePaymentMethods = useMemo(
    () =>
      paymentMethods.filter((method) => {
        const configuration = paymentMethodConfigurations.find(
          (config) => config.id === method._id,
        );
        return configuration?.recurringOptions.includes(recurring);
      }),
    [paymentMethods, recurring],
  );

  return availablePaymentMethods;
};

/**
 * This effect is used to set the default payment method to single if recurring is not enabled
 */
export const useDefaultPaymentMethodEffect = (
  paymentMethods: NonNullable<WidgetProps["methods"]>,
) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes>>();
  const recurring = useSelector((state: State) => state.donation.recurring);

  const availableRecurringOptions = useAvailableRecurringOptions(paymentMethods);

  useEffect(() => {
    if (recurring === RecurringDonation.RECURRING && !availableRecurringOptions.recurring) {
      dispatch(setRecurring(RecurringDonation.NON_RECURRING));
    }
  }, [recurring, availableRecurringOptions.recurring, dispatch]);
};

/**
 * Scale the widget to fit the screen
 */
export const useWidgetScaleEffect = (
  widgetRef: React.RefObject<HTMLDivElement | null>,
  inline: boolean,
) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(979);
  const [lastHeight, setLastHeight] = useState(979);
  const [lastWidth, setLastWidth] = useState(400);

  const scaleWidget = useCallback(() => {
    if (!inline || window.innerWidth < 1180) {
      setScalingFactor(
        (window.innerWidth >= 1180 ? Math.min(window.innerWidth * 0.4, 720) : window.innerWidth) /
          576,
      );
      setScaledHeight(Math.ceil(window.innerHeight / scalingFactor));
      if (window.innerHeight != lastHeight && window.innerWidth == lastWidth) {
        // This is probably the android keyboard opening
        const delta = lastHeight - window.innerHeight;
        if (delta > 0) widgetRef.current?.scrollTo(0, Math.ceil(delta / scalingFactor));
        else widgetRef.current?.scrollTo(0, 0);
      }
      setLastWidth(window.innerWidth);
      setLastHeight(window.innerHeight);
    }
  }, [
    setScalingFactor,
    setScaledHeight,
    scalingFactor,
    scaledHeight,
    setLastWidth,
    setLastHeight,
    inline,
  ]);

  useEffect(() => scaleWidget, [widgetContext.open, scaleWidget]);

  const debouncedScaleWidget = useDebouncedCallback(() => scaleWidget(), 1000, { maxWait: 1000 });

  useEffect(() => {
    if (!inline) {
      window.addEventListener("resize", debouncedScaleWidget);

      return () => {
        window.removeEventListener("resize", debouncedScaleWidget);
      };
    }
  }, [debouncedScaleWidget, inline]);

  useEffect(() => {
    scaleWidget();
  }, [widgetContext, scaleWidget]);

  return useMemo(() => ({ scaledHeight, scalingFactor }), [scaledHeight, scalingFactor]);
};
