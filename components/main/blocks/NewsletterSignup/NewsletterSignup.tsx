import React from "react";
import styles from "./NewsletterSignup.module.scss";

export const NewsletterSignup: React.FC<{
  header?: string;
  formurl?: string;
  sendlabel?: string;
}> = ({ header, formurl, sendlabel }) => {
  /* This is a modified version of mailchimps embedded subscribe-element
    see docs/mailchimp.html for the original version */

  if (!formurl) return <span>Newsletter missing formurl</span>;

  return (
    <form
      className={`${styles.category} ${styles.newsletter}`}
      action={formurl}
      method="post"
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      target="_blank"
      noValidate
    >
      <fieldset>
        <label className={styles.newsletter_label} htmlFor="mce-EMAIL">
          {header || "Meld meg på nyhetsbrevet"}
        </label>

        <div className={styles.input__inlinebutton}>
          <input
            data-cy="newsletter-input"
            type="email"
            name="EMAIL"
            placeholder="E-POST"
            id="mce-EMAIL"
          />
          <button
            data-cy="newsletter-submit"
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
          >
            {sendlabel}&nbsp;→
          </button>
        </div>
      </fieldset>
      {/* This input seems to be for making sure robots do not subscribe to our newsletter */}
      <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
        <input
          type="text"
          name="b_b187f08a296043edd3aa56680_4c98331f9d"
          tabIndex={-1}
          defaultValue=""
        />
      </div>
    </form>
  );
};
