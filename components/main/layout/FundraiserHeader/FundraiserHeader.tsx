import type { SanityImageObject } from "@sanity/image-url";
import styles from "./FundraiserHeader.module.scss";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export const FundraiserHeader: React.FC<{
  headerImage: SanityImageObject;
  fundraiserImage: SanityImageObject;
}> = ({ headerImage, fundraiserImage }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerimage}>
        <ResponsiveImage
          image={headerImage}
          alt="Header image"
          layout="cover"
          coverAspectRatio={20 / 9}
          sizes="(min-width: 1920px) 1714px, (min-width: 1181px) 90vw, 100vw"
          priority
        />
      </div>
      <div className={styles.fundraiserimage}>
        <ResponsiveImage
          image={fundraiserImage}
          alt="Fundraiser image"
          layout="cover"
          coverAspectRatio={1}
          sizes="(min-width: 1521px) 200px, (min-width: 1181px) 160px, 96px"
          priority
        />
      </div>
    </div>
  );
};
