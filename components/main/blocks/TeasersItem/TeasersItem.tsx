import { useRouter } from "next/router";
import React from "react";
import elements from "./TeasersItem.module.scss";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export interface TeasersItemProps {
  title: string;
  paragraph: string;
  disclaimer?: string;
  link?: string;
  image: SanityImageSource;
}

export const TeasersItem: React.FC<TeasersItemProps> = ({
  title,
  paragraph,
  disclaimer,
  link,
  image,
}) => {
  const router = useRouter();

  return (
    <div className={elements.teaser}>
      <div className={elements.teaserimage}>
        <ResponsiveImage image={image} />
      </div>
      <div className={elements.teasertext}>
        <div>
          <h4>{title}</h4>
          <p className="inngress">{paragraph}</p>
        </div>
        <div>
          {disclaimer && <p className={elements.teaserdisclaimer}>{disclaimer}</p>}
          {link && (
            <EffektButton
              onClick={() => {
                router.push(link);
              }}
            >
              Les mer
            </EffektButton>
          )}
        </div>
      </div>
    </div>
  );
};
