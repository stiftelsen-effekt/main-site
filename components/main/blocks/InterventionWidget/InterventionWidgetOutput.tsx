import React, { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import styles from "./InterventionWidget.module.scss";
import { LinkType, Links } from "../Links/Links";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { thousandize } from "../../../../util/formatting";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../shared/components/Navbar/Navbar";

export type SanityIntervention = {
  title: string;
  organization_name: string;
  abbreviation: string;
  template_string: string;
};

type Intervention = {
  title: string;
  organizationName: string;
  abbreviation: string;
  pricePerOutput?: number;
  outputStringTemplate: string;
};

export const InterventionWidgetOutput: React.FC<{
  sum: number;
  interventions: SanityIntervention[] | undefined;
  explanationLabel?: string;
  explanationText?: any;
  explanationLinks?: (LinkType | NavLink)[];
  currency: string;
  locale: string;
}> = ({ sum, interventions, explanationLabel, explanationLinks, explanationText, currency }) => {
  const [contextExpanded, setContextExpanded] = useState(false);
  const [interventionCosts, setInterventionCosts] = useState<Map<string, number>>(new Map());
  const [selectedIntervention, setSelectedIntervention] = useState<string>(
    interventions ? interventions[0].title : "",
  );

  useEffect(() => {
    if (interventions && interventions.length > 0) {
      const url = `https://impact.gieffektivt.no/api/evaluations?${interventions
        .map((i: any) => `charity_abbreviation=${i.abbreviation}&`)
        .join("")}currency=${currency}`;
      fetch(url).then((res) => {
        res.json().then((data) => {
          const costs = new Map();
          const evaluations = data.evaluations;
          interventions.forEach((i: SanityIntervention) => {
            // For each intervention, filter the evaluations for a given charity
            const filtered = evaluations.filter(
              (e: any) => e.charity.abbreviation === i.abbreviation,
            );
            // Then order the list to get the most recent
            const ordered = filtered.sort((a: any, b: any) => a.start_year - b.start_year);
            // Get the most recent evaluation
            const evaluation = ordered[0];
            // Set the cost to the most recent evaluation converted cost (cost in NOK per output)
            costs.set(i.abbreviation, evaluation.converted_cost_per_output);
          });
          setInterventionCosts(costs);
        });
      });
    }
  }, [interventions]);

  if (typeof interventions === "undefined" || interventions.length === 0) {
    return <span>No internventions</span>;
  }

  const mappedInterventions: Intervention[] = interventions.map((i: SanityIntervention) => ({
    title: i.title,
    abbreviation: i.abbreviation,
    pricePerOutput: interventionCosts.get(i.abbreviation),
    outputStringTemplate: i.template_string,
    organizationName: i.organization_name,
  }));

  const currentIntervention = mappedInterventions.find(
    (i: any) => i.title === selectedIntervention,
  ) as Intervention;

  if (!currentIntervention) {
    setSelectedIntervention(mappedInterventions[0].title);
    return <Spinner />;
  }

  const output = currentIntervention.pricePerOutput
    ? Math.round(sum / currentIntervention.pricePerOutput)
    : 0;
  const loading = typeof currentIntervention.pricePerOutput === "undefined";
  let outputString;
  if (isNaN(output)) {
    outputString = "0";
  } else {
    outputString = output.toString();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.select}>
        {interventions.map((i: any) => (
          <button
            data-cy={`${i.title}-button`}
            key={i.title}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.blur();
              setSelectedIntervention(i.title);
            }}
            className={i.title === selectedIntervention ? styles.selected : ""}
          >
            {i.title}
          </button>
        ))}
      </div>
      <div className={styles.output}>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner />
          </div>
        )}
        {!loading && (
          <>
            <span className="detailheader">{currentIntervention.organizationName}</span>
            <div className={styles.paragraphWrapper}>
              <span data-cy="impact-output" className={styles.paragraphNumber}>
                {thousandize(parseInt(outputString))}
              </span>
              <div className={styles.explanatory}>
                <p>
                  <span className={styles.innerParagraphNumber}>{outputString}</span>
                  {currentIntervention.outputStringTemplate}
                </p>
                <span
                  className={contextExpanded ? styles.captionopen : ""}
                  onClick={() => setContextExpanded(!contextExpanded)}
                >
                  {explanationLabel}&nbsp;&nbsp;
                </span>
              </div>
            </div>
            <AnimateHeight duration={300} height={contextExpanded ? "auto" : 0} animateOpacity>
              <div className={styles.context}>
                <PortableText value={explanationText} />
              </div>
              {explanationLinks && <Links links={explanationLinks}></Links>}
            </AnimateHeight>
          </>
        )}
      </div>
    </div>
  );
};
