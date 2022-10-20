import Link from "next/link";
import { PortableText } from "../../../../lib/sanity";
import { Donor } from "../../../../models";
import { Links } from "../../../main/blocks/Links/Links";
import { FacebookTaxWidget } from "../FacebookTaxWidget/FacebookTaxWidget";

import style from "./FacebookTab.module.scss";

export const FacebookTab: React.FC<{ donor: Donor | null; description: any[]; links: any[] }> = ({
  donor,
  description,
  links,
}) => {
  return (
    <div className={style.gridContainer}>
      <section>
        <h5>Facebook-donasjoner</h5>
        <FacebookTaxWidget name={donor ? donor.name : null} email={donor ? donor.email : null} />
      </section>
      <section>
        <h5>Skattefradrag</h5>
        <PortableText blocks={description} />
        <Links links={links} />
      </section>
    </div>
  );
};
