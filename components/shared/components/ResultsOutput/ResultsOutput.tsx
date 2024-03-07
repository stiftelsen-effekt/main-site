import { PortableText } from "@portabletext/react";
import {
  MonthlyDonationsPerOutputResult,
  OutputGraphAnnotation,
  Outputs,
} from "../Graphs/Results/Outputs/Outputs";
import styles from "./ResultsOutput.module.scss";
import { thousandize } from "../../../../util/formatting";
import { AfricaMap } from "../AfricaMap/AfricaMap";
import { AsiaMap } from "../AsiaMap/AsiaMap";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { ResultsOutputMaps } from "./Maps/ResultsOutputMaps";
import {
  OrganizationSparkline,
  OrganizationSparklineLegend,
} from "../Graphs/Results/OrganizationSparkline/OrganizationSparkline";
import { LinkComponent, Links, LinksProps } from "../../../main/blocks/Links/Links";
import { GraphContextData } from "../Graphs/Shared/GraphContext/GraphContext";
import { NavLink } from "../Navbar/Navbar";

export type TransformedMonthlyDonationsPerOutput = {
  via: string;
  organization: string;
  period: Date;
  numberOfOutputs: number;
  sum: number;
}[];

export const ResultsOutput: React.FC<{
  graphData: MonthlyDonationsPerOutputResult;
  outputCountries: string[];
  description: any[];
  graphAnnotations?: OutputGraphAnnotation[];
  graphContext: GraphContextData;
  organizationLinks?: {
    abbreviation: string;
    link: NavLink;
  }[];
  links?: LinksProps & {
    title?: string;
  };
}> = ({
  graphData,
  outputCountries,
  description,
  graphAnnotations,
  graphContext,
  organizationLinks,
  links,
}) => {
  const transformedMonthlyDonationsPerOutput: TransformedMonthlyDonationsPerOutput = useMemo(
    () =>
      graphData.monthly.flatMap((el) => {
        return el.organizations.flatMap((org) => {
          return Object.entries(org).flatMap(([key, value]) => {
            return [
              {
                via: "direct",
                organization: key,
                period: new Date(
                  parseInt(el.period.split("-")[0]),
                  parseInt(el.period.split("-")[1]) - 1,
                  1,
                ),
                numberOfOutputs: value.direct.numberOfOutputs,
                sum: value.direct.sum,
              },
              {
                via: "smartDistribution",
                organization: key,
                period: new Date(
                  parseInt(el.period.split("-")[0]),
                  parseInt(el.period.split("-")[1]) - 1,
                  1,
                ),
                numberOfOutputs: value.smartDistribution.numberOfOutputs,
                sum: value.smartDistribution.sum,
              },
            ];
          });
        });
      }),
    [graphData],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.outputsWrapper}>
            <div>
              <h2 className={styles.outputNumber}>
                {thousandize(Math.round(graphData.total.numberOfOutputs))}
              </h2>
              <span className={styles.outputName}>{graphData.output}</span>
            </div>
            <PortableText value={description} />
          </div>
          <ResultsOutputMaps outputCountries={outputCountries} />
        </div>
      </div>
      <Outputs
        transformedMonthlyDonationsPerOutput={transformedMonthlyDonationsPerOutput}
        output={graphData.output}
        graphAnnotations={graphAnnotations}
        graphContext={graphContext}
      ></Outputs>

      <div className={styles.organizations}>
        <h4>Organisasjoner</h4>
        <p>
          Donasjoner til anbefalte eller tidligere anbefalte organisasjoner som arbeider med{" "}
          {graphData.output.toLowerCase()}.
        </p>
        <OrganizationSparklineLegend />
        {graphData.total.organizations
          .map((o) => Object.entries(o))
          .map(([[organization, value]], i) => {
            const orgLink = organizationLinks
              ? organizationLinks.find((l) => l.abbreviation === organization)
              : null;

            return (
              <div key={organization} className={styles.organization}>
                <div className={styles.overview}>
                  <strong>{orgAbbrivToName(organization)}</strong>
                  <span>{thousandize(Math.round(value.direct.sum))} kr direkte fra donorer</span>
                  <span>
                    {thousandize(Math.round(value.smartDistribution.sum))} kr via smart fordeling
                  </span>
                  {orgLink && (
                    <div className={styles.orgLink}>
                      <LinkComponent link={orgLink?.link} />
                    </div>
                  )}
                </div>
                <div className={styles.sparkline}>
                  <OrganizationSparkline
                    transformedMonthlyDonationsPerOutput={transformedMonthlyDonationsPerOutput.filter(
                      (t) => t.organization === organization,
                    )}
                  ></OrganizationSparkline>
                </div>
              </div>
            );
          })}
        {links && links.links.length > 0 && (
          <div className={styles.linksWrapper}>
            <p className="inngress">{links.title ?? "Les mer:"}</p>
            <Links links={links.links}></Links>
          </div>
        )}
      </div>
    </div>
  );
};

const orgAbbrivToName = (abbriv: string) => {
  switch (abbriv) {
    case "hki":
      return "Hellen Keller International";
    case "sight":
      return "Sightsavers";
    case "amf":
      return "Against Malaria Foundation";
    case "sci":
      return "SCI Foundation";
    case "mc":
      return "Malaria Consortium";
    case "ni":
      return "New Incentives";
    case "dtw":
      return "Deworm the World";
    case "end":
      return "Evidence Action the END Fund";
    case "gd":
      return "GiveDirectly";
    case "ubi":
      return "GiveDirectly Borgerlønn";
    default:
      return abbriv;
  }
};
