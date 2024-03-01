import { PortableText } from "@portabletext/react";
import { MonthlyDonationsPerOutputResult, Outputs } from "../Graphs/Results/Outputs/Outputs";
import styles from "./ResultsOutput.module.scss";
import { thousandize } from "../../../../util/formatting";
import { AfricaMap } from "../AfricaMap/AfricaMap";
import { AsiaMap } from "../AsiaMap/AsiaMap";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { ResultsOutputMaps } from "./Maps/ResultsOutputMaps";
import { OrganizationSparkline } from "../Graphs/Results/OrganizationSparkline/OrganizationSparkline";

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
}> = ({ graphData, outputCountries, description }) => {
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
                  parseInt(el.period.split("-")[1]),
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
                  parseInt(el.period.split("-")[1]),
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
      ></Outputs>

      <div className={styles.organizations}>
        <h4>Organisasjoner</h4>
        <p>
          Donasjoner til anbefalte eller tidligere anbefalte organisasjoner som arbeider med{" "}
          {graphData.output.toLowerCase()}.
        </p>
        {graphData.total.organizations
          .map((o) => Object.entries(o))
          .map(([[organization, value]], i) => (
            <div key={organization} className={styles.organization}>
              <div className={styles.overview}>
                <strong>{orgAbbrivToName(organization)}</strong>
                <span>{thousandize(value.direct.sum)} kr direkte fra donorer</span>
                <span>{thousandize(value.smartDistribution.sum)} kr via smart fordeling</span>
              </div>
              <div className={styles.sparkline}>
                <OrganizationSparkline
                  transformedMonthlyDonationsPerOutput={transformedMonthlyDonationsPerOutput.filter(
                    (t) => t.organization === organization,
                  )}
                ></OrganizationSparkline>
              </div>
            </div>
          ))}
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
