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
import { SEO } from "../components/seo/Seo";

const Organizations: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const settings = data.settings[0];
  const header = data.page[0].header;
  const organizations = data.page[0].organizations;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/organizations`}
      />

      <MainHeader hideOnScroll={true}>
        {/*<CookieBanner />*/}
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
                    <p className="inngress">{organization.name}</p>
                    <p className="inngress">{organization.subtitle}</p>
                  </div>
                  <div className={styles.intervention}>
                    <span className="detailheader">{organization.intervention_type}</span>
                    <h1>{organization.invervention_cost}</h1>
                    <span>{organization.intervention_effect}</span>
                  </div>
                </div>
                <div className={styles.description}>
                  <p className="inngress">{organization.oneliner}</p>
                  <PortableText blocks={organization.content}></PortableText>

                  {organization.links && (
                    <>
                      <p className="inngress">Les mer:</p>
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
    header {
      ...,
      seoImage{
        asset->
      },
    },
    organizations[] -> {
      ...
    } 
  }
}
`;

Organizations.layout = Layout;
export default Organizations;
