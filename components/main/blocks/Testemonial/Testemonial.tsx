import React from "react";
import styles from "./Testemonial.module.scss";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { PortableText } from "../../../../lib/sanity";

export interface Testimony {
  quotee: string;
  quotee_background: any;
  quote: string;
  image: SanityImageSource;
}

export const Testimonial: React.FC<{ testimonies: Testimony[] }> = ({ testimonies }) => {
  const [currentTestimony, setCurrentTestimony] = React.useState(0);

  return (
    <section className={styles.wrapper}>
      {testimonies.length > 1 && (
        <button
          className={`${styles.testimonial__arrow} ${styles.testimonial__arrow__backward} ${
            currentTestimony === 0 ? styles.testimonial__arrow__hidden : ""
          }`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.blur();
            setCurrentTestimony(Math.max(0, currentTestimony - 1));
          }}
        >
          <div>←</div>
        </button>
      )}
      <div className={styles.testimonialtrack}>
        <div
          className={styles.testimonialtrackinner}
          style={{ transform: `translateX(${currentTestimony * -100}%)` }}
        >
          {testimonies.map(({ quotee, quotee_background, quote, image }) => (
            <div className={styles.testimonial} key={quotee}>
              <h4 className={styles.testemonial__quote}>“{quote}”</h4>
              <div className={styles.testemonial__image}>
                {image && <ResponsiveImage image={image} />}
              </div>
              <div className={styles.testimonial__bio}>
                <p>{quotee}</p>
                <div className={styles.tesimonial__background}>
                  {" "}
                  &#x21b3;&nbsp; <PortableText blocks={quotee_background} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {testimonies.length > 1 && (
        <button
          className={`${styles.testimonial__arrow} ${styles.testimonial__arrow__forward} ${
            currentTestimony === testimonies.length - 1 ? styles.testimonial__arrow__hidden : ""
          }`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.blur();
            setCurrentTestimony(Math.min(testimonies.length - 1, currentTestimony + 1));
          }}
        >
          <div>→</div>
        </button>
      )}
    </section>
  );
};
