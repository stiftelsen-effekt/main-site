import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  setCauseAreaPercentageShare,
  setShareType,
  setShares,
  setSum,
  setRecurring,
} from "../store/donation/actions";
import { RecurringDonation } from "../types/Enums";
import { WidgetContext } from "../../../../main/layout/layout";
import { PrefilledDistribution } from "../../../../main/layout/WidgetPane/WidgetPane";
import { CauseArea } from "../types/CauseArea";
import { DistributionCauseArea } from "../types/DistributionCauseArea";
import { WidgetProps } from "../types/WidgetProps";
import { paymentMethodConfigurations } from "../config/methods";
import { useDebouncedCallback } from "use-debounce";
import { State } from "../store/state";

interface UsePrefilledDistributionProps {
  inline: boolean;
  causeAreas: CauseArea[] | undefined;
  prefilledDistribution: PrefilledDistribution | null;
}

/**
 * Hook to handle prefilled distribution data for the widget
 */
export const usePrefilledDistribution = ({
  inline,
  causeAreas,
  prefilledDistribution,
}: UsePrefilledDistributionProps) => {
  const dispatch = useDispatch();
  const [widgetContext] = useContext(WidgetContext);
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

    console.log("Applying prefill");

    causeAreas.forEach((causeArea) => {
      const prefilledCauseArea = prefilled.find(
        (prefilledArea) => prefilledArea.causeAreaId === causeArea.id,
      );

      if (prefilledCauseArea) {
        handlePrefilledCauseArea(dispatch, causeArea, prefilledCauseArea);
      } else {
        resetCauseArea(dispatch, causeArea);
      }
    });

    // Mark that we've applied the prefill
    hasAppliedPrefill.current = true;
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
  const dispatch = useDispatch();
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
  const dispatch = useDispatch();
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
      console.log("Applying query params");
    }

    if (recurring) {
      dispatch(setRecurring(RecurringDonation.RECURRING));
      setWidgetContext({ ...widgetContext, open: true });
      hasAppliedQueryParams.current = true;
      console.log("Applying query params");
    }
  }, [inline, router.query, causeAreas, dispatch, setWidgetContext, widgetContext]);

  useEffect(() => {
    dispatch(setRecurring(defaultPaymentType));
  }, [defaultPaymentType, dispatch]);
};

// Helper functions

const handlePrefilledCauseArea = (
  dispatch: any,
  causeArea: CauseArea,
  prefilledCauseArea: PrefilledDistribution[number],
) => {
  dispatch(setCauseAreaPercentageShare(causeArea.id, prefilledCauseArea.share.toString()));
  dispatch(setShareType(causeArea.id, false));

  const newCauseAreaOrganizations = causeArea.organizations.map((organization) => {
    const prefilledOrg = prefilledCauseArea.organizations.find(
      (prefOrg) => prefOrg.organizationId === organization.id,
    );
    return {
      ...organization,
      percentageShare: prefilledOrg ? prefilledOrg.share.toString() : "0",
      prefilledPercentageShare: prefilledOrg ? prefilledOrg.share.toString() : undefined,
    };
  });

  dispatch(setShares(causeArea.id, newCauseAreaOrganizations));
};

const resetCauseArea = (dispatch: any, causeArea: CauseArea) => {
  dispatch(setCauseAreaPercentageShare(causeArea.id, "0"));
  dispatch(setShareType(causeArea.id, true));

  const resetOrganizations = causeArea.organizations.map((organization) => ({
    ...organization,
    percentageShare: "0",
    prefilledPercentageShare: undefined,
  }));

  dispatch(setShares(causeArea.id, resetOrganizations));
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
  const dispatch = useDispatch();
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
  widgetRef: React.RefObject<HTMLDivElement>,
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
