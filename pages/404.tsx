import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Navbar } from "../components/main/layout/navbar";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { Layout } from "../components/main/layout/layout";
import { widgetQuery } from "../_queries";
import { filterPageToSingleItem } from "./_app";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { SEO } from "../components/shared/seo/Seo";

const Custom404: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
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

export async function getStaticProps({ preview = false }) {
  let result = await getClient(preview).fetch(fetchNotFoundPage);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchNotFoundPage,
        queryParams: {},
      },
    },
  };
}

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
  ${widgetQuery}
  ${footerQuery}
}
`;

Custom404.layout = Layout;
export default Custom404;
