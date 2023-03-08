import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { SEO } from "../components/shared/seo/Seo";
import { ContactInfo } from "../components/main/blocks/Contact/Contact";
import { QuestionsAndAnswersGroup } from "../components/main/blocks/QuestionAndAnswers/QuestionAndAnswers";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { Layout } from "../components/main/layout/layout";
import { usePreviewSubscription } from "../lib/sanity";
import { linksContentQuery, questionAndAnswerSelectionQuery, widgetQuery } from "../_queries";
import { filterPageToSingleItem } from "./_app";

const Support: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const page = data.result.page;

  const header = page.header;
  const contactinfo = page.contact;
  const settings = data.result.settings[0];

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/ofte-stilte-sporsmal`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader title={header.title} inngress={header.inngress} links={header.links} />

      <SectionContainer padded={true}>
        {page.questionandanswergroups.map((group: any) => (
          <QuestionsAndAnswersGroup key={group._key} group={group} />
        ))}
      </SectionContainer>

      <SectionContainer>
        <ContactInfo
          title={contactinfo.title}
          description={contactinfo.description}
          phone={contactinfo.phone}
          email={contactinfo.email}
        ></ContactInfo>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  let result = await getClient(preview).fetch(fetchSupport);
  result = { ...result, page: filterPageToSingleItem(result, preview) };

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchSupport,
        queryParams: {},
      },
    },
  };
}

const fetchSupport = groq`
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
  ${footerQuery}
  ${widgetQuery}
  "page": *[_type == "support"] {
    header {
      ...,
      seoImage{
        asset->
      },
      ${linksContentQuery}
    },
    questionandanswergroups[] {
      ${questionAndAnswerSelectionQuery}
    },
    contact->
  },
}
`;

Support.layout = Layout;
Support.filterPage = true;
export default Support;
