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
          <h3>Gavekort.</h3>
          <p>
            Gi en gave til verden og noen du er glad i. Gjennomfør en donasjon som vanlig, last ned
            malen vår under og print ut eller send digitalt.
          </p>
        </div>
        <Link
          href={
            "https://drive.google.com/file/d/1Xaur4Fd1hXvfld_XMPrBK0-2y_Rp-V_v/view?usp=share_link"
          }
          target="_blank"
          passHref
        >
          <a target={"_blank"}>→ Last ned mal til gavekort her</a>
        </Link>
      </div>
    </div>
  );
};
