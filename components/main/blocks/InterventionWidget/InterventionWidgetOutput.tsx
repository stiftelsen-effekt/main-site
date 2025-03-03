import React, { useContext, useMemo, useState } from "react";
import AnimateHeight from "react-animate-height";
import styles from "./InterventionWidget.module.scss";
import { LinkType, Links } from "../Links/Links";
import { thousandize } from "../../../../util/formatting";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { stegaClean } from "@sanity/client/stega";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { WidgetContext } from "../../layout/layout";
import { usePlausible } from "next-plausible";
import { ImpactEvaluation } from "../../../../models";

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
  organization: {
    database_ids: {
      cause_area_id: number;
      organization_id: number;
    };
    intervention: {
      abbreviation: string;
      type: string;
      scaling_factor: number;
    };
    impact_estimate: {
      evaluation: ImpactEvaluation;
    } | null;
  };
  template_string: string;
  template_donate_button: string;
};

export const InterventionWidgetOutput: React.FC<{
  sum: number;
  configuration: InterventionWidgetOutputConfiguration;
  currency: string;
  locale: string;
}> = ({ sum, configuration, currency }) => {
  const { interventions, explanation_label, explanation_text, explanation_links } = configuration;

  const [contextExpanded, setContextExpanded] = useState(false);

  const [selectedIntervention, setSelectedIntervention] = useState<number>(
    interventions[0].organization.database_ids.organization_id,
  );
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const plausible = usePlausible();

  const currentIntervention = useMemo(() => {
    return interventions.find(
      (i: SanityIntervention) =>
        stegaClean(i.organization.database_ids.organization_id) === selectedIntervention,
    );
  }, [selectedIntervention]);

  if (!currentIntervention) {
    return "No current intervention";
  }

  const outputString = useMemo(() => {
    if (
      !currentIntervention.organization.impact_estimate ||
      !currentIntervention.organization.impact_estimate.evaluation ||
      !currentIntervention.organization.intervention
    ) {
      return "-";
    }
    if (currentIntervention.organization.intervention.type === "output") {
      return thousandize(
        Math.round(
          sum /
            currentIntervention.organization.impact_estimate.evaluation.converted_cost_per_output,
        ),
      );
    }
    if (currentIntervention.organization.intervention.type === "percentage") {
      return `${thousandize(
        Math.round(
          (100 / currentIntervention.organization.impact_estimate.evaluation.cents_per_output) *
            sum,
        ),
      )}`;
    }
    if (currentIntervention.organization.intervention.type === "scaled_output") {
      if (currentIntervention.organization.intervention.scaling_factor) {
        return thousandize(
          Math.round(
            sum /
              (currentIntervention.organization.impact_estimate.evaluation
                .converted_cost_per_output *
                currentIntervention.organization.intervention.scaling_factor),
          ),
        );
      }
    }
    return "-";
  }, [currentIntervention, sum]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.select}>
        {interventions.map((i: SanityIntervention) => (
          <button
            data-cy={`${i.title}-button`}
            key={i.title}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.blur();
              setSelectedIntervention(stegaClean(i.organization.database_ids.organization_id));
            }}
            className={
              stegaClean(i.organization.database_ids.organization_id) === selectedIntervention
                ? styles.selected
                : ""
            }
          >
            {i.title}
          </button>
        ))}
      </div>
      <div className={styles.output}>
        <div className={styles.paragraphWrapper}>
          <span data-cy="impact-output" className={styles.paragraphNumber}>
            {outputString}
          </span>
          <div className={styles.explanatory}>
            <p>
              <span className={styles.innerParagraphNumber}>{outputString}</span>
              {currentIntervention.template_string}
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
                      causeAreaId: currentIntervention.organization.database_ids.cause_area_id,
                      share: 100,
                      organizations: [
                        {
                          organizationId:
                            currentIntervention.organization.database_ids.organization_id,
                          share: 100,
                        },
                      ],
                    },
                  ],
                  prefilledSum: sum,
                });
              }}
            >
              {currentIntervention.template_donate_button.replace("{outputs}", outputString)}
            </EffektButton>
          </div>
        )}
      </div>
    </div>
  );
};
