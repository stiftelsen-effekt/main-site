import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { PortableText } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import styles from "../styles/Organizations.module.css";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Layout } from "../components/main/layout";
import { SectionContainer } from "../components/sectionContainer";
import { PageHeader } from "../components/elements/pageheader";
import { ResponsiveImage } from "../components/elements/responsiveimage";
import { Navbar } from "../components/main/navbar";
import { Links } from "../components/elements/links";
import { footerQuery } from "../components/footer";
import { MainHeader } from "../components/main/header";
import { CookieBanner } from "../components/elements/cookiebanner";

const Organizations: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const settings = data.settings[0];
  const header = data.page[0].header;
  const organizations = data.page[0].organizations;

  return (
    <>
      <Head>
        <title>Konduit. - Organizations</title>
        <meta name="description" content="Konduit. - Organizations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader title={header.title} inngress={header.inngress} links={header.links} />
      <SectionContainer padded={true}>
        <div className={styles.organizationWrapper}>
          {organizations &&
            organizations.map((organization: any) => (
              <div key={organization._id} className={styles.organization}>
                <div className={styles.meta}>
                  <div>
                    <h2>{organization.name}</h2>
                    <h3>{organization.subtitle}</h3>
                  </div>
                  <div className={styles.intervention}>
                    <span className={styles.interventionType}>
                      {organization.intervention_type}
                    </span>
                    <strong>{organization.invervention_cost}</strong>
                    <span className={styles.interventionEffect}>
                      {organization.intervention_effect}
                    </span>
                  </div>
                </div>
                <div className={styles.description}>
                  <h2 className={styles.oneliner}>{organization.oneliner}</h2>
                  <PortableText blocks={organization.content}></PortableText>

                  {organization.links && (
                    <>
                      <h2>Les mer:</h2>
                      <Links links={organization.links} />
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const data = await getClient(preview).fetch(fetchOrganizationsPage);

  return {
    props: {
      preview,
      data,
    },
  };
}

const fetchOrganizationsPage = groq`
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
  "page": *[_type == "organizations"] {
    header,
    organizations[] -> {
      ...
    } 
  }
}
`;

Organizations.layout = Layout;
export default Organizations;
