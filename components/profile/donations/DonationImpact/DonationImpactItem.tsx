import React, { useEffect, useState } from "react";
import style from "./DonationImpactItem.module.scss";
import { thousandize, thousandizeString } from "../../../../util/formatting";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../models";
import AnimateHeight from "react-animate-height";
import { Links } from "../../../main/blocks/Links/Links";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const DonationImpactItem: React.FC<{
  orgAbriv: string;
  sumToOrg: number;
  donationTimestamp: Date;
  precision: number;
  signalRequiredPrecision: (precision: number) => void;
}> = ({ orgAbriv, sumToOrg, donationTimestamp, precision, signalRequiredPrecision }) => {
  const { data, error, isValidating } = useSWR<{ evaluations: ImpactEvaluation[] }>(
    `https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=${orgAbriv}&currency=NOK&language=NO&donation_year=${donationTimestamp.getFullYear()}&donation_month=${
      donationTimestamp.getMonth() + 1
    }`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const [showDetails, setShowDetails] = useState(false);
  const [requiredPrecision, setRequiredPrecision] = useState(0);

  useEffect(() => {
    if (precision < requiredPrecision) {
      signalRequiredPrecision(requiredPrecision);
    }
  }, [precision, requiredPrecision]);

  if (!data || isValidating) {
    return (
      <tr key={`loading`}>
        <td>Loading...</td>
      </tr>
    );
  }
  if (error) {
    return (
      <tr key={`error`}>
        <td>{error}</td>
      </tr>
    );
  }
  /**
   * Sort evaluations by start time
   * Then return the first evaluation that has a start year and month less than or equal to the donation
   * This will be the most recent relevant evaluation to calculate the impact
   */
  const relevantEvaluation = data?.evaluations[0];

  if (!relevantEvaluation) {
    return (
      <>
        <tr className={style.overview} data-cy="donation-impact-list-item-overview">
          <td>
            <span className={style.impactOutput} data-cy="donation-impact-list-item-output">
              {thousandize(sumToOrg)}
            </span>
          </td>
          <td>
            <div className={style.impactContext}>
              <span className={style.impactDetailsDescription}>kr til {orgAbriv}</span>
              <span
                className={[style.impactDetailsExpandText, showDetails ? style.expanded : ""].join(
                  " ",
                )}
                onClick={() => setShowDetails(!showDetails)}
              >
                Ingen relevant evaluering tilgjengelig for å beregne effekt
              </span>
            </div>
          </td>
        </tr>
        <tr className={style.details}>
          <td colSpan={Number.MAX_SAFE_INTEGER}>
            {/* Strange hack required to not have table reflow when showing the animated area */}
            <AnimateHeight duration={300} animateOpacity height={showDetails ? "auto" : 0}>
              <div>
                <p>
                  For denne intervensjonen har vi ikke lagt inn en relevant evaluering fra GiveWell
                  for tidsrommet donasjonen er gitt. Dette kan skyldes at vi ikke har oppdaterte
                  tall fra GiveWell for det gitte tidsrommet, eller at vi ikke har rukket å legge
                  det inn i vår database. Vi jobber kontinuerlig med å oppdatere våre tall og håper
                  å kunne legge inn en relevant evaluering for denne intervensjonen så snart det
                  foreligger. Ta gjerne kontakt med oss på{" "}
                  <a href="mailto:donasjon@gieffektivt.no" style={{ textDecoration: "underline" }}>
                    donasjon@gieffektivt.no
                  </a>{" "}
                  om du har noen spørsmål.
                </p>
                <div>
                  <Links
                    links={[
                      {
                        _type: "link",
                        _key: "giveWell",
                        title: "GiveWell’s analyser",
                        url: "https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models",
                        newtab: true,
                      },
                    ]}
                  />
                </div>
              </div>
            </AnimateHeight>
          </td>
        </tr>
        <tr className={style.spacerRow}>
          <td colSpan={Number.MAX_SAFE_INTEGER}></td>
        </tr>
      </>
    );
  }

  const output = sumToOrg / relevantEvaluation.converted_cost_per_output;

  let tmpRequiredPrecision = 0;
  while (parseFloat(output.toFixed(tmpRequiredPrecision)) === 0 && tmpRequiredPrecision < 3) {
    tmpRequiredPrecision += 1;
  }
  if (requiredPrecision < tmpRequiredPrecision) {
    setRequiredPrecision(tmpRequiredPrecision);
  }

  const formattedOutput = thousandizeString(
    (Math.round(output * Math.pow(10, requiredPrecision)) / Math.pow(10, requiredPrecision))
      .toFixed(precision)
      .replace(/\./, ","),
  );

  return (
    <>
      <tr className={style.overview} data-cy="donation-impact-list-item-overview">
        <td>
          <span className={style.impactOutput} data-cy="donation-impact-list-item-output">
            {formattedOutput}
          </span>
        </td>
        <td>
          <div className={style.impactContext}>
            <span className={style.impactDetailsDescription}>
              {relevantEvaluation.intervention.short_description}
            </span>
            <span
              className={[style.impactDetailsExpandText, showDetails ? style.expanded : ""].join(
                " ",
              )}
              onClick={() => setShowDetails(!showDetails)}
            >
              {`${thousandize(Math.round(sumToOrg))} kr til ${
                relevantEvaluation.charity.charity_name
              }`}
            </span>
          </div>
        </td>
      </tr>
      <tr className={style.details}>
        <td colSpan={Number.MAX_SAFE_INTEGER}>
          {/* Strange hack required to not have table reflow when showing the animated area */}
          <AnimateHeight duration={300} animateOpacity height={showDetails ? "auto" : 0}>
            <div>
              <p>{relevantEvaluation.intervention.long_description}</p>
              <p>
                Tallene er basert på analysene til GiveWell. De gir et omtrentlig bilde på hva våre
                anbefalte organisasjoner får ut av pengene. Tiltaket er topp anbefalt som en av de
                mest kostnadseffektive måtene å redde liv eller forbedre den økonomiske situasjonen
                til ekstremt fattige. Mange bistandsorganisasjoner viser til overdrevne og
                misvisende tall i sin markedsføring. Bak våre tall ligger tusenvis av timer med
                undersøkelser og inkluderer alle kostnader, inkludert planlegging, innkjøp,
                distribusjon, opplæring og kontroll.
              </p>
              <div>
                <Links
                  links={[
                    {
                      _type: "link",
                      _key: "charity_description",
                      title: "Om " + relevantEvaluation.charity.charity_name,
                      url:
                        "https://gieffektivt.no/topplista#" +
                        relevantEvaluation.charity.charity_name.replaceAll(" ", "_"),
                      newtab: true,
                    },
                    {
                      _type: "link",
                      _key: "giveWell",
                      title: "GiveWell’s analyser",
                      url: "https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models",
                      newtab: true,
                    },
                  ]}
                />
              </div>
            </div>
          </AnimateHeight>
        </td>
      </tr>
      <tr className={style.spacerRow}>
        <td colSpan={Number.MAX_SAFE_INTEGER}></td>
      </tr>
    </>
  );
};
