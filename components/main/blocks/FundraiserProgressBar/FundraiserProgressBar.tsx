import { thousandize } from "../../../../util/formatting";
import styles from "./FundraiserProgressBar.module.scss";
import { FetchFundraiserResult } from "../../../../studio/sanity.types";

export const FundraiserProgressBar: React.FC<{
  config: NonNullable<FetchFundraiserResult["page"]>["fundraiser_goal_config"];
  matchingAmount?: number;
  matchingCeiling?: number;
  currentAmount: number;
}> = ({ config, currentAmount, matchingAmount, matchingCeiling }) => {
  if (!config) return "Missing config for fundraiser progress bar";

  const { goal, current_amount_text_template, goal_amount_text_template } = config;

  if (!goal) return "Missing goal";
  if (!current_amount_text_template) return "Missing current amount text template";
  if (!goal_amount_text_template) return "Missing goal amount text template";

  const currentAmountText = current_amount_text_template
    .replace("{amount}", thousandize(currentAmount))
    .replace("{goal}", thousandize(goal));
  const goalAmountText = goal_amount_text_template.replace("{goal}", thousandize(goal));

  const progress = Math.min(100, (currentAmount / goal) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.barcontainer}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.text}>
        <div className={styles.amount}>
          <span>{currentAmountText}</span>
          {matchingAmount && (
            <span className={styles.matchingAmount}>
              {thousandize(matchingAmount)} kr i matching
              {matchingCeiling && ` av ${thousandize(matchingCeiling)} kr tilgjengelig`}
            </span>
          )}
        </div>

        <span>{goalAmountText}</span>
      </div>
    </div>
  );
};
