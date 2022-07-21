import React, { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import styles from "./ImpactWidget.module.scss";
import { Links } from "../Links/Links";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { thousandize } from "../../../../util/formatting";

export type Intervention = {
  title: string;
  organizationName: string;
  pricePerOutput?: number;
  outputStringTemplate: string;
};

export interface ImpactWidgetProps {
  data: any;
}

export const ImpactWidget: React.FC<ImpactWidgetProps> = ({ data }) => {
  const [sum, setSum] = useState(400);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [interventionCosts, setInterventionCosts] = useState<Map<string, number>>(new Map());

  const interventionWidget = data.result.frontpage[0].intervention_widget;
  const interventions= interventionWidget.interventions.map((i: any) => ({
    title: i.title,
    pricePerOutput: interventionCosts.get(i.abbreviation),
    outputStringTemplate: i.template_string,
    organizationName: i.organization_name,
  }))
  
  const [selectedIntervention, setSelectedIntervention] = useState<string>(interventions[0].title);

  useEffect(() => {
    const interventions = interventionWidget.interventions;
    const url = `https://impact.gieffektivt.no/api/evaluations?${interventions
      .map((i: any) => `charity_abbreviation=${i.abbreviation}&`)
      .join("")}currency=NOK`;
    console.log(url);
    fetch(url).then((res) => {
      res.json().then((data) => {
        const costs = new Map();
        const evaluations = data.evaluations;
        interventions.forEach((i: any) => {
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
  }, [interventionWidget.interventions]);

  const currentIntervention = interventions.find(
    (i: any) => i.title === selectedIntervention,
  ) as Intervention;
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
      <div className={styles.header}>
        <h3>{interventionWidget.title}</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.input}>
          <div className={styles.input}>
            <label htmlFor="sum">Donasjon:</label>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                value={sum}
                onChange={(e) => {
                  if(e.target.value.length <= 9) setSum(parseInt(e.target.value) || 0)
                }}
                name="sum"
              />
            </div>
          </div>
          <div className={styles.select}>
            {interventions.map((i: any) => (
              <button
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
                <span className={styles.paragraphNumber}>{thousandize(parseInt(outputString))}</span>
                <div className={styles.explanatory}>
                  <p>
                    <span className={styles.innerParagraphNumber}>{outputString}</span>
                    {currentIntervention.outputStringTemplate}
                  </p>
                  <span
                    className={contextExpanded ? styles.captionopen : ""}
                    onClick={() => setContextExpanded(!contextExpanded)}
                  >
                    Hvordan er dette sammenlignet med andre organisasjoner?&nbsp;&nbsp;
                  </span>
                </div>
              </div>
              <AnimateHeight duration={300} height={contextExpanded ? "auto" : 0} animateOpacity>
                <div className={styles.context}>
                  Tallene er basert på analysene til GiveWell. De gir et omtrentlig bilde på hva
                  våre anbefalte organisasjoner får ut av pengene. Alle tre tiltak er topp anbefalt
                  som de mest kostnadseffektive måtene å redde liv eller forbedre den økonomiske
                  situasjonen til ekstremt fattige. Mange bistandsorganisasjoner viser til
                  overdrevne og misvisende tall i sin markedsføring. Bak våre tall ligger tusenvis
                  av timer med undersøkelser og inkluderer alle kostnader, inkludert planlegging,
                  innkjøp, distribusjon, opplæring og kontroll.
                </div>
                <Links
                  links={[
                    {
                      _key: "givewell",
                      _type: "link",
                      title: "GiveWell's analyser",
                      url: "https://www.givewell.org/impact-estimates",
                      newtab: true,
                    },
                    {
                      _key: "organiasjoner",
                      _type: "navitem",
                      title: "Anbefalte organisasjoner",
                      slug: "organizations",
                    },
                  ]}
                ></Links>
              </AnimateHeight>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
