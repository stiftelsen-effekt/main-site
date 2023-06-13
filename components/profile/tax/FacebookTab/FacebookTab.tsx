import Link from "next/link";
import { Donor } from "../../../../models";
import { Links } from "../../../main/blocks/Links/Links";
import { FacebookTaxWidget } from "../FacebookTaxWidget/FacebookTaxWidget";

import style from "./FacebookTab.module.scss";
import { PortableText } from "@portabletext/react";

export const FacebookTab: React.FC<{ donor: Donor; description: any[]; links: any[] }> = ({
  donor,
  description,
  links,
}) => {
  return (
    <div className={style.container}>
      <h5>Knytt din donasjon til din profil</h5>
      <div className={style.gridContainer}>
        <section>
          <FacebookTaxWidget email={donor.email} />
        </section>
        <section>
          <PortableText value={description} />
          <Links links={links} />
        </section>
      </div>
    </div>
  );
};
