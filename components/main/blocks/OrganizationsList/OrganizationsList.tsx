import React from "react";
import { Links } from "../Links/Links";
import styles from "./OrganizationsList.module.scss";
import { PortableText } from "@portabletext/react";

export const OrganizationsList: React.FC<{ organizations: any[] }> = ({ organizations }) => {
  return (
    <div className={styles.organizationWrapper}>
      {organizations &&
        organizations.map((organization: any) => (
          <div
            key={organization._id}
            id={organization.name.replace(/ /g, "_")}
            className={styles.organization}
          >
            <div className={styles.meta}>
              <div>
                <h4>{organization.name}</h4>
                <h5>{organization.name}</h5>

                <p className={styles.interventionSubtitle}>{organization.subtitle}</p>
              </div>
              <div className={styles.intervention}>
                <span className="detailheader">{organization.intervention_type}</span>
                <h1>{organization.invervention_cost}</h1>
                <span>{organization.intervention_effect}</span>
              </div>
            </div>
            <div className={styles.description}>
              <p className="inngress">{organization.oneliner}</p>
              <PortableText value={organization.content}></PortableText>

              {organization.links && (
                <>
                  <p className="inngress">{organization.links_header}</p>
                  <Links links={organization.links} />
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
