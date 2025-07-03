import styles from "./ColeComponent.module.scss";

import { SanityImageAsset } from "../../../../studio/sanity.types";

export const ColeComponent: React.FC<{
  title: string;
  image?: SanityImageAsset;
}> = ({ title, image }) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>

      {JSON.stringify(image)}
    </div>
  );
};
