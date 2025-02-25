import { WidgetWithStore } from "../../../shared/components/Widget/components/WidgetWithStore";
import { WidgetProps } from "../../../shared/components/Widget/types/WidgetProps";
import { PrefilledDistribution, WidgetPaneProps } from "../../layout/WidgetPane/WidgetPane";
import { Paragraph } from "../Paragraph/Paragraph";
import styles from "./DonationWidgetBlock.module.scss";

export const DonationWidgetBlock: React.FC<{
  widgetConfiguration: WidgetProps;
  overrides?: any;
  content?: any[];
  contentPosition: "left" | "right";
  contentMobilePosition: "top" | "bottom";
}> = ({ widgetConfiguration, overrides, content, contentPosition, contentMobilePosition }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.widget}>
        <WidgetWithStore
          inline={true}
          {...{
            data: {
              result: widgetConfiguration,
              query: "",
            },
          }}
          prefilled={convertToPrefilledDistribution(overrides?.prefilled_distribution)}
          prefilledSum={overrides?.prefilled_sum ?? null}
        />
      </div>
      {content && content.length > 0 && (
        <Paragraph title={""} tocKey="" blocks={content}></Paragraph>
      )}
    </div>
  );
};

// Input type
type InputDistribution = {
  _key: string;
  id: number;
  causeAreaId?: number;
  name: string;
  percentage: number;
  type: "causeArea" | "organization";
}[];

/**
 * Converts from the input format to PrefilledDistribution
 * @param input The input distribution array
 * @returns The converted PrefilledDistribution
 */
function convertToPrefilledDistribution(input?: InputDistribution): PrefilledDistribution | null {
  if (!input) return null;
  if (input.length === 0) return null;

  const result: PrefilledDistribution = [];

  // Separate cause areas and organizations
  const causeAreas = input.filter((item) => item.type === "causeArea");
  const organizations = input.filter((item) => item.type === "organization");

  // Create each cause area entry in the result
  causeAreas.forEach((causeArea) => {
    const causeAreaId = causeArea.id;
    const relatedOrgs = organizations.filter((org) => org.causeAreaId === causeAreaId);

    result.push({
      causeAreaId: causeAreaId,
      share: causeArea.percentage,
      organizations: relatedOrgs.map((org) => ({
        organizationId: org.id,
        share: org.percentage,
      })),
    });
  });

  return result;
}
