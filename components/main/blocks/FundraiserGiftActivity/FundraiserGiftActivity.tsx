import { useState } from "react";
import AnimateHeight from "react-animate-height";
import style from "./FundraiserGiftActivity.module.scss";
import { thousandize } from "../../../../util/formatting";
import { FetchFundraiserResult } from "../../../../studio/sanity.types";

export const FundraiserGiftActivity: React.FC<{
  config: NonNullable<FetchFundraiserResult["page"]>["gift_activity_config"];
  donations: {
    amount: number;
    name: string | null;
    message: string | null;
  }[];
}> = ({ donations, config }) => {
  const [currentlyShowing, setCurrentlyShowing] = useState(5);

  if (!config) return "Missing config for fundraiser gift activity";
  if (!config.gift_amount_text_template) return "Missing gift amount text template";
  if (!config.show_more_text_template) return "Missing show more text template";

  const showMoreText = config.show_more_text_template.replace(
    "{count}",
    (donations.length - currentlyShowing).toString(),
  );

  /* Show five donations to start */
  /* Use AnimateHeight component to expand 5 more at a time */
  /* Divy the donations into arrays with 5 elements each */
  /* Use map to render each array of donations */

  const divviedDonations = donations.reduce((acc, donation, i) => {
    const index = Math.floor(i / 5);
    acc[index] = acc[index] || [];
    acc[index].push(donation);
    return acc;
  }, [] as { amount: number; name: string | null; message: string | null }[][]);

  const getHeaderText = (name: string | null, amount: number) => {
    if (name) {
      return (config.gift_amount_text_template as string)
        .replace("{name}", name)
        .replace("{sum}", thousandize(amount));
    }
    return `En gave på ${thousandize(amount)} kr`;
  };

  return (
    <div className={style.container}>
      <span className={style.title}>{config.title}</span>
      {divviedDonations.map((donationGroup, i) => (
        <AnimateHeight key={i} duration={300} height={i < currentlyShowing / 5 ? "auto" : 0}>
          {donationGroup.map((donation, j) => (
            <div key={j} className={style.donation}>
              <span className={style.amount}>{getHeaderText(donation.name, donation.amount)}</span>
              {donation.message && <span className={style.message}>{donation.message}</span>}
            </div>
          ))}
        </AnimateHeight>
      ))}
      {currentlyShowing < donations.length && (
        <button onClick={() => setCurrentlyShowing(currentlyShowing + 5)} className={style.seemore}>
          {showMoreText}
        </button>
      )}
    </div>
  );
};
