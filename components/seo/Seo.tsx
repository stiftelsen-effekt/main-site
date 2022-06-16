import React from "react";
import { NextSeo } from "next-seo";
import { SEOMeta } from "../../models";

export const SEO: React.FC<SEOMeta> = ({ title, description, image, twitterCard }) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical="https://www.canonical.ie/"
      openGraph={{
        url: "https://www.url.ie/a",
        title: title,
        description: description,
        images: [],
        site_name: "GiEffektivt.",
      }}
      twitter={{
        handle: "@handle",
        site: "@gieffektivt",
        cardType: "summary_large_image",
      }}
    ></NextSeo>
  );
};
