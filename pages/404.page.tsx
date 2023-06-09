import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { Navbar } from "../components/main/layout/navbar";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { widgetQuery } from "../_queries";
import { filterPageToSingleItem, getAppStaticProps } from "./_app.page";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { SEO } from "../components/shared/seo/Seo";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

const Custom404: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ data, preview }) => {
  const settings = data.result.settings[0];
  const dashboard = data.result.dashboard[0];

  return (
    <>
      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} texts={dashboard} />
      </MainHeader>

      <SectionContainer>
        <h2 style={{ marginTop: "10vh" }}>Finner ikke siden</h2>
      </SectionContainer>
    </>
  );
};
export const getStaticProps = async ({ preview = false }: GetStaticPropsContext) => {
  const appStaticProps = await getAppStaticProps();
  let result = await getClient(preview).fetch(fetchNotFoundPage);

  return {
    props: {
      appStaticProps,
      preview: preview,
      data: {
        result: result,
        query: fetchNotFoundPage,
        queryParams: {},
      },
    },
  };
};

const fetchNotFoundPage = groq`
{
  "dashboard": *[_id == "dashboard"] {
    my_page_text,
    send_donation_text,
  },
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
  ${widgetQuery}
  ${footerQuery}
}
`;

export default Custom404;
