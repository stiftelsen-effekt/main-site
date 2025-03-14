import { thousandize } from "../../../../util/formatting";
import styles from "./FundraiserProgressBar.module.scss";

export const FundraiserProgressBar: React.FC<{
  config: {
    goal: number;
    current_amount_text_template: string;
    goal_amount_text_template: string;
  };
  currentAmount: number;
}> = ({ config, currentAmount }) => {
  const { goal, current_amount_text_template, goal_amount_text_template } = config;

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
        <span>{currentAmountText}</span>
        <span>{goalAmountText}</span>
      </div>
    </div>
  );
};
