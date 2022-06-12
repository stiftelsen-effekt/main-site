import Head from "next/head";
import React from "react";
import { PortableText } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import styles from "../styles/About.module.css";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Layout } from "../components/main/layout";
import { Navbar } from "../components/main/navbar";
import { PageHeader } from "../components/elements/pageheader";
import { SectionContainer } from "../components/sectionContainer";
import { footerQuery } from "../components/footer";
import { MainHeader } from "../components/main/header";
import { CookieBanner } from "../components/elements/cookiebanner";
import { Contributors, Role } from "../components/elements/contributors";
import { Links } from "../components/elements/links";
import { GiveBlock } from "../components/elements/giveblock";

const About: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const settings = data.settings[0];
  const header = data.about[0].header;
  const roles: Role[] = data.roles;
  const boardMembers = roles.find((role: Role) => role.id === "boardmembers")!;
  const employees = roles.find((role: Role) => role.id === "employees")!;
  const volunteers = roles.find((role: Role) => role.id === "volunteers")!;
  return (
    <>
      <Head>
        <title>
          {settings.title} - {header.title}
        </title>
        <meta name="description" content={settings.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader title={header.title} />

      <SectionContainer padded>
        <div className={styles.ingress__container}>
          <div className={styles.links}>
            <Links links={header.links} />
          </div>
          <div>
            <p className="inngress">{header.inngress}</p>
            <div className={styles.maincontent}>
              <PortableText blocks={data.about[0].content}></PortableText>
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

      <SectionContainer inverted nodivider>
        <GiveBlock />
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const data = await getClient(preview).fetch(fetchAboutUs);

  return {
    props: {
      preview,
      data,
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
  "about": *[_type == "about_us"] {
    header,
    content
  },
  "roles": *[_type == "role"] {
    _id,
    title,
    id,
    "contributors": *[ _type == "contributor" && role._ref == ^._id ] {
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
export default About;
