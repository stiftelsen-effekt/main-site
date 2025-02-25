import { useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
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

interface UsePrefilledDistributionProps {
  inline: boolean;
  distributionCauseAreas: DistributionCauseArea[];
  prefilledDistribution: PrefilledDistribution | null;
}

/**
 * Hook to handle prefilled distribution data for the widget
 */
export const usePrefilledDistribution = ({
  inline,
  distributionCauseAreas,
  prefilledDistribution,
}: UsePrefilledDistributionProps) => {
  const dispatch = useDispatch();
  const [widgetContext] = useContext(WidgetContext);
  // Add a ref to track if we've already applied the prefilled distribution
  const hasAppliedPrefill = useRef(false);

  useEffect(() => {
    // Return early if no cause areas to distribute
    if (distributionCauseAreas.length === 0) {
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
    if (hasAppliedPrefill.current) {
      return;
    }

    distributionCauseAreas.forEach((causeArea) => {
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
  }, [inline, widgetContext.prefilled, prefilledDistribution, distributionCauseAreas, dispatch]);

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
}: {
  inline: boolean;
  causeAreas: CauseArea[] | undefined;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  useEffect(() => {
    if (inline || !router.query || !causeAreas) {
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
    }

    if (recurring) {
      dispatch(setRecurring(RecurringDonation.RECURRING));
      setWidgetContext({ ...widgetContext, open: true });
    }
  }, [inline, router.query, causeAreas, dispatch, setWidgetContext, widgetContext]);
};

// Helper functions

const handlePrefilledCauseArea = (
  dispatch: any,
  causeArea: DistributionCauseArea,
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

const resetCauseArea = (dispatch: any, causeArea: DistributionCauseArea) => {
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
