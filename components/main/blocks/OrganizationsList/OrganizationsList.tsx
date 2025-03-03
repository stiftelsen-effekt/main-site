import React, { useContext } from "react";
import { Links } from "../Links/Links";
import styles from "./OrganizationsList.module.scss";
import { PortableText } from "@portabletext/react";
import { WidgetContext } from "../../layout/layout";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import Link from "next/link";
import { usePlausible } from "next-plausible";
import { ImpactEvaluation } from "../../../../models";
import { thousandize } from "../../../../util/formatting";

type OrganizationWidgetButton = {
  label: string;
  display: boolean;
};

type Organization = {
  _id: string;
  name: string;
  subtitle: string;
  oneliner: string;
  content: any;
  links: any;
  links_header: string;
  widget_button: OrganizationWidgetButton;
  organization_page_slug?: {
    slug?: {
      current: string;
    };
  };
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

export const OrganizationsList: React.FC<{ organizations: Organization[] }> = ({
  organizations,
}) => {
  const plausible = usePlausible();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  return (
    <div className={styles.organizationWrapper} data-cy="organizations-list">
      {organizations &&
        organizations.map((organization) => (
          <div
            key={organization._id}
            id={organization.name.replace(/ /g, "_")}
            className={styles.organization}
          >
            <div className={styles.meta}>
              <div>
                {organization.organization_page_slug ? (
                  <div className={styles.headerwrapper}>
                    <Link href={`/${organization.organization_page_slug.slug?.current}`}>
                      <h4>{organization.name}</h4>
                    </Link>
                  </div>
                ) : (
                  <>
                    <h4>{organization.name}</h4>
                  </>
                )}

                <p className={styles.interventionSubtitle}>{organization.subtitle}</p>
              </div>
              <div className={styles.intervention}>
                <h1>{getFormattedInterventionOutput(organization)}</h1>
                <span>{organization.intervention?.effect}</span>
              </div>
            </div>
            <div className={styles.description}>
              {organization.oneliner && <p className="inngress">{organization.oneliner}</p>}
              <PortableText value={organization.content}></PortableText>
              {organization.links && (
                <>
                  {organization.links_header && (
                    <p className="inngress">{organization.links_header}</p>
                  )}
                  <Links links={organization.links} />
                </>
              )}
              {organization.widget_button && organization.database_ids && (
                <div className={styles.buttonWrapper}>
                  <EffektButton
                    data-cy={`organizations-list-button-${organization.database_ids.organization_id}`}
                    onClick={() => {
                      plausible("OpenDonationWidget", {
                        props: {
                          page: window.location.pathname,
                        },
                      });
                      plausible("OpenDonationWidgetOrganizationListCTA", {
                        props: {
                          page: window.location.pathname,
                        },
                      });
                      setWidgetContext({
                        open: true,
                        prefilledSum: null,
                        prefilled: [
                          {
                            causeAreaId: organization.database_ids.cause_area_id,
                            share: 100,
                            organizations: [
                              {
                                organizationId: organization.database_ids.organization_id,
                                share: 100,
                              },
                            ],
                          },
                        ],
                      });
                    }}
                    fullWidth
                  >
                    {organization.widget_button.label}
                  </EffektButton>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export const getFormattedInterventionOutput = (
  organization: Pick<Organization, "impact_estimate" | "intervention">,
) => {
  if (
    !organization.impact_estimate ||
    !organization.impact_estimate.evaluation ||
    !organization.intervention
  ) {
    return "-";
  }
  if (organization.intervention.type === "output") {
    return (
      thousandize(Math.round(organization.impact_estimate.evaluation.converted_cost_per_output)) +
      " kr"
    );
  }
  if (organization.intervention.type === "percentage") {
    return `${Math.round((100 / organization.impact_estimate.evaluation.cents_per_output) * 100)}%`;
  }
  if (organization.intervention.type === "scaled_output") {
    if (organization.intervention.scaling_factor) {
      return (
        thousandize(
          Math.round(
            organization.impact_estimate.evaluation.converted_cost_per_output *
              organization.intervention.scaling_factor,
          ),
        ) + " kr"
      );
    }
    return "-";
  }
  return "-";
};
