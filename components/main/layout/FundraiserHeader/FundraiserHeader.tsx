import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import styles from "./FundraiserHeader.module.scss";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export const FundraiserHeader: React.FC<{
  headerImage: SanityImageObject;
  fundraiserImage: SanityImageObject;
}> = ({ headerImage, fundraiserImage }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerimage}>
        <ResponsiveImage image={headerImage} alt="Header image" layout="cover" priority />
      </div>
      <div className={styles.fundraiserimage}>
        <ResponsiveImage image={fundraiserImage} alt="Fundraiser image" layout="cover" priority />
      </div>
    </div>
  );
};
