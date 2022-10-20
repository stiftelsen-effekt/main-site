import { PortableText } from "../../../../lib/sanity";
import { Links } from "../../../main/blocks/Links/Links";

import styles from "./TaxDeductionsTab.module.scss";

export const TaxDeductionsTab: React.FC<{ description: any[]; links: any[] }> = ({
  description,
  links,
}) => {
  return (
    <div className={styles.container}>
      <h5>Skattefradrag</h5>
      <PortableText blocks={description} />
      <Links links={links} />
    </div>
  );
};
