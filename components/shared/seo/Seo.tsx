import React from "react";
import { NextSeo } from "next-seo";
import { SEOMeta } from "../../../models";

export const SEO: React.FC<SEOMeta> = ({
  title,
  titleTemplate = "Gi Effektivt. | %s",
  description,
  canonicalurl,
  imageAsset,
  keywords,
}) => {
  const images = [];
  if (imageAsset)
    images.push({
      url: imageAsset.url + "?w=1200&h=630&fit=crop",
      width: 1200,
      height: 630,
      alt: title,
    });

  const additionalMetaTags = [];
  if (keywords)
    additionalMetaTags.push({
      name: "keywords",
      content: keywords,
    });

  return (
    <NextSeo
      title={title}
      titleTemplate={titleTemplate}
      description={description}
      canonical={canonicalurl}
      openGraph={{
        url: canonicalurl,
        title: title,
        description: description,
        images: images,
        site_name: "Gi Effektivt.",
      }}
      twitter={{
        site: "@gieffektivt",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={additionalMetaTags}
    ></NextSeo>
  );
};
