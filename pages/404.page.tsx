import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { groq } from "next-sanity";
import React from "react";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";

import { Navbar } from "../components/main/layout/navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { getClient } from "../lib/sanity.server";
import { getAppStaticProps } from "./_app.page";

const Custom404: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ data, preview }) => {
  const settings = data.result.settings[0];

  return (
    <>
      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <SectionContainer>
        <h2 style={{ marginTop: "10vh" }}>Finner ikke siden</h2>
      </SectionContainer>
    </>
  );
};

export const getStaticProps = async ({ preview = false }: GetStaticPropsContext) => {
  const appStaticProps = await getAppStaticProps({ preview });
  let result = await getClient(preview).fetch(fetchNotFoundPage);

  return {
    props: {
      appStaticProps,
      preview: preview,
      data: {
        result,
        query: fetchNotFoundPage,
        queryParams: {},
      },
    },
  };
};

const fetchNotFoundPage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
    main_navigation[] {
      _type == 'navgroup' => {
        _type,
        _key,
        title,
        items[]->{
          title,
          "slug": page->slug.current
        },
      },
      _type != 'navgroup' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
    }
  },
}
`;

export default Custom404;
