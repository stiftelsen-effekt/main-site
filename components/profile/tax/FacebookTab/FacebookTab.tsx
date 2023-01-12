import Link from "next/link";
import { PortableText } from "../../../../lib/sanity";
import { Donor } from "../../../../models";
import { Links } from "../../../main/blocks/Links/Links";
import { FacebookTaxWidget } from "../FacebookTaxWidget/FacebookTaxWidget";

import style from "./FacebookTab.module.scss";

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
          <PortableText blocks={description} />
          <Links links={links} />
        </section>
      </div>
    </div>
  );
};
