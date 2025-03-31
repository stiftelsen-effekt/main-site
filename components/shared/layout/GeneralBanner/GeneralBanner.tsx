import React, { useContext } from "react";
import styles from "./GeneralBanner.module.scss";
import { GeneralBannerQueryResult } from "../../../../studio/sanity.types";
import { CustomLink } from "../../components/CustomLink/CustomLink";
import { BannerContext } from "../../../main/layout/layout";
import { usePlausible } from "next-plausible";

export const GeneralBanner: React.FC<{ configuration: GeneralBannerQueryResult }> = ({
  configuration,
}) => {
  const plausible = usePlausible();
  const [bannerContext, setBannerContext] = useContext(BannerContext);

  if (!configuration) return null;
  if (!configuration.link) return null;
  if (bannerContext.generalBannerDismissed) return null;

  return (
    <>
      <CustomLink
        href={configuration.link.slug as string}
        onClick={() => {
          plausible("GeneralBannerClick", {
            props: {
              link: configuration.link?.slug,
            },
          });
          setBannerContext((prev) => ({
            ...prev,
            generalBannerDismissed: true,
            layoutPaddingTop: 0,
          }));
        }}
      >
        <div data-cy="generalbanner-container" className={styles.container}>
          <div className={styles.content}>
            <div className={styles.description}>
              <p>{configuration.title}</p>
              <span>{configuration.link.title} →</span>
            </div>
            <div className={styles.buttonsWrapper}>
              <span
                className={styles.dismiss}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  plausible("GeneralBannerDismissed", {
                    props: {
                      link: configuration.link?.slug,
                    },
                  });
                  setBannerContext((prev) => ({
                    ...prev,
                    generalBannerDismissed: true,
                    layoutPaddingTop: 0,
                  }));
                }}
              >
                ✕
              </span>
            </div>
          </div>
        </div>
      </CustomLink>
    </>
  );
};
