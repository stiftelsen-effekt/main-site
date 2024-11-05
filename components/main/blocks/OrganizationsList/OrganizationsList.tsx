import React, { useContext } from "react";
import { Links } from "../Links/Links";
import styles from "./OrganizationsList.module.scss";
import { PortableText } from "@portabletext/react";
import { WidgetContext } from "../../layout/layout";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import Link from "next/link";

type OrganizationWidgetButton = {
  label: string;
  cause_area_id: number;
  organization_id: number;
};

type Organization = {
  _id: string;
  name: string;
  subtitle: string;
  invervention_cost: string;
  intervention_effect: string;
  intervention_type: string;
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
};

export const OrganizationsList: React.FC<{ organizations: Organization[] }> = ({
  organizations,
}) => {
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
                <span className="detailheader">{organization.intervention_type}</span>
                <h1>{organization.invervention_cost}</h1>
                <span>{organization.intervention_effect}</span>
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
              {organization.widget_button && (
                <div className={styles.buttonWrapper}>
                  <EffektButton
                    data-cy={`organizations-list-button-${organization.widget_button.organization_id}`}
                    onClick={() => {
                      setWidgetContext({
                        open: true,
                        prefilled: [
                          {
                            causeAreaId: organization.widget_button.cause_area_id,
                            share: 100,
                            organizations: [
                              {
                                organizationId: organization.widget_button.organization_id,
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
