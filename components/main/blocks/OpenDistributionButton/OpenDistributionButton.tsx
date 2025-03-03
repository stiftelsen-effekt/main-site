import { useContext } from "react";
import { Opendistributionbutton, Organization } from "../../../../studio/sanity.types";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { WidgetContext } from "../../layout/layout";
import { PrefilledDistribution } from "../../layout/WidgetPane/WidgetPane";
import styles from "./OpenDistributionButton.module.scss";
import { usePlausible } from "next-plausible";
import { ImpactEvaluation } from "../../../../models";
import { thousandize } from "../../../../util/formatting";
import { getFormattedInterventionOutput } from "../OrganizationsList/OrganizationsList";

export const OpenDistributionButton: React.FC<
  Omit<Opendistributionbutton, "organization"> & {
    organization: {
      _type: "organization";
      intervention?: {
        abbreviation: string;
        type: string;
        effect: string;
        scaling_factor?: number;
      };
      database_ids: {
        cause_area_id: number;
        organization_id: number;
      };
      impact_estimate: {
        evaluation: ImpactEvaluation;
      } | null;
    };
  }
> = ({ text, inverted, organization, display_output_info, distribution_cause_areas }) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const plausible = usePlausible();

  if (!distribution_cause_areas) {
    return null;
  }

  const prefilled = cleanDistribution(distribution_cause_areas);

  const containerStyles = [styles.container];
  if (inverted) {
    containerStyles.push(styles.inverted);
  }

  return (
    <div className={containerStyles.join(" ")}>
      {display_output_info && organization.intervention && organization.impact_estimate && (
        <div className={styles.outputInfo}>
          <h2>{getFormattedInterventionOutput(organization)}</h2>
          <span>{organization.intervention.effect}</span>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <EffektButton
          onClick={() => {
            plausible("OpenDonationWidget", {
              props: {
                page: window.location.pathname,
              },
            });
            plausible("OpenDonationWidgetPrefilledDistributionCTA", {
              props: {
                page: window.location.pathname,
              },
            });
            setWidgetContext({
              open: true,
              prefilled: prefilled,
              prefilledSum: null,
            });
          }}
        >
          {text}
        </EffektButton>
      </div>
    </div>
  );
};

// Type guards to help TypeScript understand our filtered types
type ValidCauseArea = {
  cause_area_id: number;
  cause_area_percentage: number;
  cause_area_organizations?: Array<{
    organization_id?: number;
    organization_percentage?: number;
    _key: string;
  }>;
  _key: string;
};

type ValidOrganization = {
  organization_id: number;
  organization_percentage: number;
  _key: string;
};

export const cleanDistribution = (
  input: Opendistributionbutton["distribution_cause_areas"],
): PrefilledDistribution => {
  if (!input) {
    return [];
  }

  return input
    .filter(
      (area): area is ValidCauseArea =>
        area != null &&
        typeof area.cause_area_id === "number" &&
        typeof area.cause_area_percentage === "number",
    )
    .map((area) => ({
      causeAreaId: area.cause_area_id,
      share: area.cause_area_percentage,
      organizations: (area.cause_area_organizations ?? [])
        .filter(
          (org): org is ValidOrganization =>
            org != null &&
            typeof org.organization_id === "number" &&
            typeof org.organization_percentage === "number",
        )
        .map((org) => ({
          organizationId: org.organization_id,
          share: org.organization_percentage,
        })),
    }));
};
