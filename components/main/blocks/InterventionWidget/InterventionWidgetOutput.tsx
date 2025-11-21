import React, { useContext, useEffect, useMemo, useState } from "react";
import AnimateHeight from "react-animate-height";
import styles from "./InterventionWidget.module.scss";
import { LinkType, Links } from "../Links/Links";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { thousandize } from "../../../../util/formatting";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { stegaClean } from "@sanity/client/stega";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { WidgetContext } from "../../layout/layout";
import { usePlausible } from "next-plausible";

export type InterventionWidgetOutputConfiguration = {
  interventions: SanityIntervention[];
  explanation_label: string;
  explanation_text: any[];
  explanation_links?: (LinkType | NavLink)[];
  donate_button?: boolean;
  donate_label_short?: string;
  locale: string;
};

export type SanityIntervention = {
  title: string;
  organization_name: string;
  abbreviation: string;
  template_string: string;
  organization_id: string;
  cause_area_id: string;
};

type Intervention = {
  title: string;
  organizationName: string;
  abbreviation: string;
  pricePerOutput?: number;
  outputStringTemplate: string;
  organizationId: string;
  causeAreaId: string;
  shortDescription: string;
};

export const InterventionWidgetOutput: React.FC<{
  sum: number;
  configuration: InterventionWidgetOutputConfiguration;
  currency: string;
  locale: string;
}> = ({ sum, configuration, currency }) => {
  const { interventions, explanation_label, explanation_text, explanation_links } = configuration;

  const [contextExpanded, setContextExpanded] = useState(false);
  const [interventionCosts, setInterventionCosts] = useState<Map<string, number>>(new Map());
  const [interventionShortDescriptions, setInterventionShortDescriptions] = useState<
    Map<string, string>
  >(new Map());
  const [selectedIntervention, setSelectedIntervention] = useState<string>(
    interventions ? interventions[0].title : "",
  );
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const plausible = usePlausible();
  const currentDate = useMemo(() => new Date(), []);

  useEffect(() => {
    if (interventions && interventions.length > 0) {
      const url = `https://impact.gieffektivt.no/api/evaluations?${interventions
        .map((i: any) => `charity_abbreviation=${stegaClean(i.abbreviation)}&`)
        .join("")}currency=${stegaClean(currency)}&language=${stegaClean(
        configuration.locale,
      )}&conversion_year=${currentDate.getFullYear()}&conversion_month=${
        currentDate.getMonth() + 1
      }`;
      fetch(url)
        .then((res) => {
          res.json().then((data) => {
            const costs = new Map();
            const shortDescriptions = new Map();
            const evaluations = data.evaluations;
            interventions.forEach((i: SanityIntervention) => {
              // For each intervention, filter the evaluations for a given charity
              const filtered = evaluations.filter(
                (e: any) => e.charity.abbreviation === stegaClean(i.abbreviation),
              );
              // Then order the list to get the most recent
              const ordered = filtered.sort((a: any, b: any) => b.start_year - a.start_year);
              // Get the most recent evaluation
              const evaluation = ordered[0];
              // Set the cost to the most recent evaluation converted cost (cost in NOK per output)
              costs.set(stegaClean(i.abbreviation), evaluation.converted_cost_per_output);
              shortDescriptions.set(
                stegaClean(i.abbreviation),
                evaluation.intervention.short_description,
              );
            });
            setInterventionCosts(costs);
            setInterventionShortDescriptions(shortDescriptions);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [interventions]);

  if (typeof interventions === "undefined" || interventions.length === 0) {
    return <span>No internventions</span>;
  }

  const mappedInterventions: Intervention[] = interventions.map((i: SanityIntervention) => ({
    title: i.title,
    abbreviation: i.abbreviation,
    pricePerOutput: interventionCosts.get(stegaClean(i.abbreviation)),
    outputStringTemplate: i.template_string,
    organizationName: i.organization_name,
    organizationId: i.organization_id,
    causeAreaId: i.cause_area_id,
    shortDescription: interventionShortDescriptions.get(stegaClean(i.abbreviation)) || "",
  }));

  const currentIntervention = mappedInterventions.find(
    (i: any) => stegaClean(i.title) === selectedIntervention,
  ) as Intervention;

  if (!currentIntervention) {
    setSelectedIntervention(stegaClean(mappedInterventions[0].title));
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
              setSelectedIntervention(stegaClean(i.title));
            }}
            className={stegaClean(i.title) === selectedIntervention ? styles.selected : ""}
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
                  {explanation_label}&nbsp;&nbsp;
                </span>
              </div>
            </div>
            <AnimateHeight duration={300} height={contextExpanded ? "auto" : 0} animateOpacity>
              <div className={styles.context}>
                <PortableText value={explanation_text} />
              </div>
              {explanation_links && <Links links={explanation_links}></Links>}
            </AnimateHeight>
            {configuration.donate_button && (
              <div className={styles.giveButtonWrapper}>
                <EffektButton
                  onClick={() => {
                    plausible("OpenDonationWidget", {
                      props: {
                        page: window.location.pathname,
                      },
                    });
                    plausible("OpenDonationWidgetInterventionWidgetCTA", {
                      props: {
                        page: window.location.pathname,
                      },
                    });
                    setWidgetContext({
                      open: true,
                      prefilled: [
                        {
                          causeAreaId: currentIntervention.causeAreaId,
                          share: 100,
                          organizations: [
                            {
                              organizationId: currentIntervention.organizationId,
                              share: 100,
                            },
                          ],
                        },
                      ],
                      prefilledSum: sum,
                    });
                  }}
                >
                  {configuration.donate_label_short?.replace(".", "") || "Gi"}{" "}
                  {thousandize(parseInt(outputString))}{" "}
                  {currentIntervention.shortDescription.toLowerCase()}
                </EffektButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
