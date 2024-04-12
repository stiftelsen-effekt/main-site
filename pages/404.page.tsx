import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { groq } from "next-sanity";
import React from "react";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";

import { Navbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { getClient } from "../lib/sanity.server";
import { getAppStaticProps } from "./_app.page";

const Custom404: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  navbarData,
  missingPage,
  preview,
}) => {
  return (
    <>
      <MainHeader hideOnScroll={true}>
        <CookieBanner configuration={missingPage.settings[0].cookie_banner_configuration} />
        <Navbar {...navbarData} />
      </MainHeader>

      <SectionContainer>
        <h2 style={{ marginTop: "10vh" }}>
          {missingPage.settings[0].not_found_title || "Page not found"}
        </h2>
      </SectionContainer>
    </>
  );
};

const fetchMissingPage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    cookie_banner_configuration {
      ...,
      privacy_policy_link {
        ...,
        "slug": page->slug.current
      }
    },
    not_found_title,
  },
}
`;

export const getStaticProps = async ({ preview = false }: GetStaticPropsContext) => {
  const appStaticProps = await getAppStaticProps({ preview });

  const result = await getClient(preview).fetch(fetchMissingPage);

  return {
    props: {
      appStaticProps,
      missingPage: result,
      navbarData: await Navbar.getStaticProps({ dashboard: false, preview }),
      preview,
    }, // satisfies GeneralPageProps (requires next@13);,
  };
};

export default Custom404;
