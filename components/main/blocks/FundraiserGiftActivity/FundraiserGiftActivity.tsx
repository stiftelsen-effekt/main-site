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
  locale: string;
}> = ({ donations, config, locale }) => {
  const [currentlyShowing, setCurrentlyShowing] = useState(5);

  if (!config) return "Missing config for fundraiser gift activity";
  if (!config.title) return "Missing title";
  if (!config.gift_amount_text_template) return "Missing gift amount text template";
  if (!config.anonymous_gift_amount_text_template)
    return "Missing anonymous gift amount text template";
  if (!config.show_more_text_template) return "Missing show more text template";
  if (!config.no_donations_text) return "Missing no donations text";

  const {
    gift_amount_text_template,
    anonymous_gift_amount_text_template,
    show_more_text_template,
    no_donations_text,
    title,
  } = config;

  const showMoreText = show_more_text_template.replace(
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
    const template = name ? gift_amount_text_template : anonymous_gift_amount_text_template;
    return template
      .replace("{name}", name ?? "Donor")
      .replace("{sum}", thousandize(amount, locale));
  };

  return (
    <div className={style.container} data-cy="fundraiser-gift-activity">
      <span className={style.title} data-cy="fundraiser-gift-title">
        {title}
      </span>
      {divviedDonations.map((donationGroup, i) => (
        <AnimateHeight key={i} duration={300} height={i < currentlyShowing / 5 ? "auto" : 0}>
          {donationGroup.map((donation, j) => (
            <div key={j} className={style.donation} data-cy="fundraiser-gift-item">
              <span className={style.amount} data-cy="fundraiser-gift-amount">
                {getHeaderText(donation.name, donation.amount)}
              </span>
              {donation.message && (
                <span className={style.message} data-cy="fundraiser-gift-message">
                  {donation.message}
                </span>
              )}
            </div>
          ))}
        </AnimateHeight>
      ))}
      {donations.length === 0 && (
        <div className={style.noDonations}>
          <span>{no_donations_text}</span>
        </div>
      )}
      {currentlyShowing < donations.length && (
        <button
          onClick={() => setCurrentlyShowing(currentlyShowing + 5)}
          className={style.seemore}
          data-cy="fundraiser-gift-show-more"
        >
          {showMoreText}
        </button>
      )}
    </div>
  );
};
