import { thousandize } from "../../../../util/formatting";
import styles from "./FundraiserProgressBar.module.scss";
import { FetchFundraiserResult } from "../../../../studio/sanity.types";

export const FundraiserProgressBar: React.FC<{
  config: NonNullable<FetchFundraiserResult["page"]>["fundraiser_goal_config"];
  currentAmount: number;
  locale: string;
}> = ({ config, currentAmount, locale }) => {
  if (!config) return "Missing config for fundraiser progress bar";

  const { goal, current_amount_text_template, goal_amount_text_template } = config;

  if (!current_amount_text_template) return "Missing current amount text template";

  const currentAmountText = current_amount_text_template
    .replace("{amount}", thousandize(currentAmount, locale))
    .replace("{goal}", thousandize(goal || 0, locale));
  const goalAmountText = goal_amount_text_template
    ? goal_amount_text_template.replace("{goal}", thousandize(goal || 0, locale))
    : "";

  return (
    <div className={styles.container} data-cy="fundraiser-progress-bar">
      {goal && (
        <div className={styles.barcontainer}>
          <div className={styles.bar} style={{ width: `${(currentAmount / goal) * 100}%` }} />
        </div>
      )}

      <div className={styles.text}>
        <span data-cy="fundraiser-progress-current">{currentAmountText}</span>
        {goal_amount_text_template && (
          <span data-cy="fundraiser-progress-goal">{goalAmountText}</span>
        )}
      </div>
    </div>
  );
};
