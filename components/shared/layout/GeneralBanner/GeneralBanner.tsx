import React, { useContext, useState } from "react";
import styles from "./GeneralBanner.module.scss";
import { Generalbanner } from "../../../../studio/sanity.types";
import { NavLink } from "../../components/Navbar/Navbar";
import Link from "next/link";
import { CookiesAccepted } from "../../../main/layout/layout";

export const GeneralBanner: React.FC<{ configuration: Generalbanner & { link: NavLink } }> = ({
  configuration,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useContext(CookiesAccepted);

  if (!cookiesAccepted.loaded || typeof cookiesAccepted.accepted === "undefined" || dismissed)
    return null;

  return (
    <>
      <Link
        href={configuration.link.slug as string}
        onClick={() => {
          setDismissed(true);
        }}
      >
        <div data-cy="generalbanner-container" className={styles.container}>
          <div className={styles.content}>
            <div className={styles.description}>
              <p>{configuration.title}</p>
              <span>{configuration.link.title} →</span>
            </div>
            <div className={styles.buttonsWrapper}>
              <span
                className={styles.dismiss}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setDismissed(true);
                }}
              >
                ✕
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
