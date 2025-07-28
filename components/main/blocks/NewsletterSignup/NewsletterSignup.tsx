import React, { useState } from "react";
import styles from "./NewsletterSignup.module.scss";

export const NewsletterSignup: React.FC<{
  header?: string;
  formurl?: string;
  sendlabel?: string;
  emailLabel?: string;
  locale: string;
}> = ({ header, formurl, sendlabel, emailLabel, locale }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDKSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_EFFEKT_API}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "*/*",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Tak for din tilmelding!");
        setEmail("");
      } else {
        setMessage("Der opstod en fejl. Prøv venligst igen.");
      }
    } catch (error) {
      setMessage("Der opstod en fejl. Prøv venligst igen.");
    } finally {
      setLoading(false);
    }
  };

  if (locale === "no" || locale === "sv") {
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
              placeholder={emailLabel || "E-POST"}
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
  } else if (locale === "dk") {
    return (
      <form
        className={`${styles.category} ${styles.newsletter}`}
        onSubmit={handleDKSubmit}
        noValidate
      >
        <fieldset>
          <label className={styles.newsletter_label} htmlFor="dk-email">
            {header || "Tilmeld dig nyhedsbrevet"}
          </label>
          <div className={styles.input__inlinebutton}>
            <input
              data-cy="newsletter-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailLabel || "EMAIL"}
              id="dk-email"
              disabled={loading}
            />
            <button data-cy="newsletter-submit" type="submit" disabled={loading}>
              {loading ? "..." : `${sendlabel || "Send"}\u00A0→`}
            </button>
          </div>
          {message && (
            <div className={styles.message} style={{ marginTop: "10px", fontSize: "14px" }}>
              {message}
            </div>
          )}
        </fieldset>
      </form>
    );
  } else {
    return <span>Unsupported locale for NewsletterSignup: {locale}</span>;
  }
};
