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
import Link from "next/link";
import { ResponsiveImage } from "../components/elements/responsiveimage";
import { Navbar } from "../components/main/navbar";
import { Links } from "../components/elements/links";

const Organizations: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>404</h1>;
  }

  return (
    <>
      <Head>
        <title>Konduit. - Organizations</title>
        <meta name="description" content="Konduit. - Organizations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar elements={data.settings[0]["main_navigation"]} />

      <PageHeader title={data.page[0].header.title} />
      <SectionContainer>
        <div className={styles.organizationWrapper}>
          {data.organizations.map((organization: any) => (
            <div key={organization._id} className={styles.organization}>
              <div className={styles.meta}>
                <div>
                  <h2>{organization.name}</h2>
                  <h3>{organization.subtitle}</h3>
                </div>
                <div className={styles.logo}>
                  {organization.logo ? <ResponsiveImage image={organization.logo} /> : null}
                </div>
              </div>
              <div className={styles.description}>
                <h2 className={styles.oneliner}>{organization.oneliner}</h2>
                <PortableText blocks={organization.content}></PortableText>

                <h2>Les mer:</h2>
                <Links links={organization.links} />
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
  "page": *[_type == "organizations"] {
    header
  },
  "organizations": *[_type == "organization"] {
    _id,
    name,
    subtitle,
    oneliner,
    logo,
    content,
    links
  }
}
`;

Organizations.layout = Layout;
export default Organizations;

function useNextSanityImage(configuredSanityClient: any, image: any) {
  throw new Error("Function not implemented.");
}
