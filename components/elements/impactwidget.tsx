import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import styles from "../../styles/ImpactWidget.module.css";
import { Links } from "./links";
import { Spinner } from "./spinner";

export type Intervention = {
  title: string;
  organizationName: string;
  pricePerOutput?: number;
  outputStringTemplate: string;
};

export const ImpactWidget: React.FC<{
  title: string;
  defaultSum: number;
  interventions: Intervention[];
  buttonText: string;
}> = ({ title, defaultSum, interventions, buttonText }) => {
  const [sum, setSum] = useState(defaultSum);
  const [selectedIntervention, setSelectedIntervention] = useState<string>(interventions[0].title);
  const [contextExpanded, setContextExpanded] = useState(false);

  const currentIntervention = interventions.find(
    (i) => i.title === selectedIntervention,
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
        <h3>{title}</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.input}>
          <div className={styles.input}>
            <label htmlFor="sum">Donasjon:</label>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                value={sum}
                onChange={(e) => setSum(parseInt(e.target.value) || 0)}
                name="sum"
              />
            </div>
          </div>
          <div className={styles.select}>
            {interventions.map((i) => (
              <button
                key={i.title}
                onClick={() => setSelectedIntervention(i.title)}
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
                <span className={styles.paragraphNumber}>{outputString}</span>
                <div className={styles.explanatory}>
                  <p>
                    <span className={styles.innerParagraphNumber}>{outputString}&nbsp;</span>
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
