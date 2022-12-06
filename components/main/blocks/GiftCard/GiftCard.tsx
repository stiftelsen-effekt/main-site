import { useRouter } from "next/router";
import React from "react";
import styles from "./GiftCard.module.scss";
import GiftImage from "./gave-cropped.png";
import Link from "next/link";
import Image from "next/image";

export const GiftCard: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.giftcard}>
      <div className={styles.giftcardimage}>
        <Image src={GiftImage} />
      </div>
      <div className={styles.giftcardtext}>
        <div>
          <h3>Gavekort</h3>
          <p>
            Noe om å gi en donasjon til jul og så at man kan laste ned og printe ut, Nedlastbar PDF
            som kan printes ut og brukes som gave dokument
          </p>
        </div>
        <Link
          href={
            "https://drive.google.com/file/d/1Ym7FwUHaBkOgMCl9wXkEzHczYFDD20EM/view?usp=share_link"
          }
          target="_blank"
          passHref
        >
          <a target={"_blank"}>→ Last ned gavekort-mal her</a>
        </Link>
      </div>
    </div>
  );
};
