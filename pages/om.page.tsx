import Head from "next/head";
import React from "react";
import { PortableText, usePreviewSubscription } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import styles from "../styles/About.module.css";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { SEO } from "../components/shared/seo/Seo";
import { Role, Contributors } from "../components/main/blocks/Contributors/Contributors";
import { GiveBlock } from "../components/main/blocks/GiveBlock/GiveBlock";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { Links } from "../components/main/blocks/Links/Links";
import { Layout } from "../components/main/layout/layout";
import { linksContentQuery, widgetQuery } from "../_queries";
import { filterPageToSingleItem } from "./_app.page";

const About: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const about = data.result.page;

  const settings = data.result.settings[0];
  const header = about.header;
  const roles: Role[] = data.result.roles;
  const boardMembers = roles.find((role: Role) => role.id === "boardmembers")!;
  const employees = roles.find((role: Role) => role.id === "employees")!;
  const volunteers = roles.find((role: Role) => role.id === "volunteers")!;
  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/om`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader title={header.title} />

      <SectionContainer padded>
        <div className={styles.ingress__container}>
          <div className={styles.links}>
            <Links links={header.links} />
          </div>
          <div className={styles.intro}>
            <p className="inngress">{header.inngress}</p>
            <div className={styles.maincontent}>
              <PortableText blocks={about.content}></PortableText>
            </div>
          </div>
        </div>
      </SectionContainer>

      {boardMembers && boardMembers.contributors && (
        <SectionContainer padded>
          <Contributors {...boardMembers} />
        </SectionContainer>
      )}
      {employees && employees.contributors && (
        <SectionContainer padded>
          <Contributors {...employees} />
        </SectionContainer>
      )}
      {volunteers && volunteers.contributors && (
        <SectionContainer padded>
          <Contributors {...volunteers} />
        </SectionContainer>
      )}

      <div style={{ marginTop: "40px" }}>
        <SectionContainer nodivider>
          <GiveBlock />
        </SectionContainer>
      </div>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  let result = await getClient(preview).fetch(fetchAboutUs);
  result = { ...result, about: filterPageToSingleItem(result, preview) };

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchAboutUs,
        queryParams: {},
      },
    },
  };
}

const fetchAboutUs = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    description,
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
  "page": *[_type == "about_us"] {
    header {
      ...,
      seoImage{
        asset->
      },
      ${linksContentQuery}
    },
    content
  },
  "roles": *[_type == "role"] {
    _id,
    title,
    id,
    "contributors": *[ _type == "contributor" && role._ref == ^._id ] | order(order desc) {
      _id,
      image,
      name,
      email,
      subrole,
      additional
    }
  }[count(contributors) > 0]
}
`;

About.layout = Layout;
About.filterPage = true;
export default About;
