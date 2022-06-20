import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Layout } from "../components/main/layout";
import { Navbar } from "../components/main/navbar";
import { PageHeader } from "../components/elements/pageheader";
import { SectionContainer } from "../components/sectionContainer";
import { ContactInfo } from "../components/elements/contact-info";
import { footerQuery } from "../components/footer";
import { QuestionsAndAnswersGroup } from "../components/elements/questionsandanswers";
import { MainHeader } from "../components/main/header";
import { CookieBanner } from "../components/elements/cookiebanner";
import { SEO } from "../components/seo/Seo";

const Support: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const header = data.page[0].header;
  const contactinfo = data.page[0].contact;
  const settings = data.settings[0];

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/support`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader title={header.title} inngress={header.inngress} links={header.links} />

      <SectionContainer padded={true}>
        {data.page[0].questionandanswergroups.map((group: any) => (
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
  const data = await getClient(preview).fetch(fetchSupport);

  return {
    props: {
      preview,
      data,
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
  "page": *[_type == "support"] {
    header {
      ...,
      seoImage{
        asset->
      },
      links[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      }
    },
    questionandanswergroups,
    contact->
  },
}
`;

Support.layout = Layout;
export default Support;
