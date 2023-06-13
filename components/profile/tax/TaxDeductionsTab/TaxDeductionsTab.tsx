import { PortableText } from "@portabletext/react";
import { Links } from "../../../main/blocks/Links/Links";

import styles from "./TaxDeductionsTab.module.scss";

export const TaxDeductionsTab: React.FC<{ description: any[]; links: any[] }> = ({
  description,
  links,
}) => {
  return (
    <div className={styles.container}>
      <h5>Få skattefradrag på dine donasjoner til oss</h5>
      <PortableText value={description} />
      <Links links={links} />
    </div>
  );
};
