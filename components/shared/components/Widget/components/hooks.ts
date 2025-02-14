import { useContext, useEffect } from "react";
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
import { WidgetContext, WidgetContextType } from "../../../../main/layout/layout";
import { PrefilledDistribution } from "../../../../main/layout/WidgetPane/WidgetPane";
import { CauseArea } from "../types/CauseArea";
import { DistributionCauseArea } from "../types/DistributionCauseArea";

interface UsePrefilledDistributionProps {
  inline: boolean;
  distributionCauseAreas: DistributionCauseArea[];
}

/**
 * Hook to handle prefilled distribution data for the widget
 */
export const usePrefilledDistribution = ({
  inline,
  distributionCauseAreas,
}: UsePrefilledDistributionProps) => {
  const dispatch = useDispatch();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  useEffect(() => {
    if (inline || !widgetContext.prefilled || distributionCauseAreas.length === 0) {
      return;
    }

    const prefilled = widgetContext.prefilled;

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
  }, [inline, widgetContext.prefilled, distributionCauseAreas, dispatch]);
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
