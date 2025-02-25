import React from "react";
import styles from "./Testemonial.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { PortableText } from "@portabletext/react";

export interface Testimony {
  quotee: string;
  quotee_background: any;
  quote: string;
  image: SanityImageObject;
}

export const Testimonial: React.FC<{ testimonies: Testimony[] }> = ({ testimonies }) => {
  const [currentTestimony, setCurrentTestimony] = React.useState(0);

  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      setCurrentTestimony(Math.min(testimonies.length - 1, currentTestimony + 1));
    }

    if (touchStart - touchEnd < -100) {
      setCurrentTestimony(Math.max(0, currentTestimony - 1));
    }
  };

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
          aria-label="Previous testimonial"
        >
          <div>←</div>
        </button>
      )}
      <div
        className={styles.testimonialtrack}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.testimonialtrackinner}
          style={{ transform: `translateX(${currentTestimony * -100}%)` }}
        >
          {testimonies.map(({ quotee, quotee_background, quote, image }) => (
            <div className={styles.testimonial} key={quotee}>
              {quote && <h4 className={styles.testemonial__quote}>“{quote}”</h4>}
              <div className={styles.testemonial__image}>
                {image && (
                  <ResponsiveImage image={image} sizes="(min-width: 1181px) 170px, 120px" />
                )}
              </div>
              <div className={styles.testimonial__bio}>
                <p>{quotee}</p>
                <div className={styles.tesimonial__background}>
                  {" "}
                  &#x21b3;&nbsp; <PortableText value={quotee_background} />
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
          aria-label="Next testimonial"
        >
          <div>→</div>
        </button>
      )}
      {testimonies.length > 1 && (
        <div className={styles.testimonial__dots}>
          {testimonies.map((_, i) => (
            <button
              key={i}
              className={`${styles.testimonial__dot} ${
                currentTestimony === i ? styles.testimonial__dot__active : ""
              }`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.blur();
                setCurrentTestimony(i);
              }}
              aria-label="Go to testimonial"
            ></button>
          ))}
        </div>
      )}
    </section>
  );
};
