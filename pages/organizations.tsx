import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { PortableText } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import styles from '../styles/Organizations.module.css'
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Layout } from "../components/main/layout";

const Organizations: LayoutPage<{ data: any, preview: boolean }>  = ({ data, preview }) => {
  const router = useRouter()

  if (!router.isFallback && !data.description) {
    return <h1>404</h1>
  }

  return (
    <>
      <Head>
        <title>Konduit. - Organizations</title>
        <meta name="description" content="Konduit. - Organizations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Våre anbefalte<br /> organisasjoner</h1>
      
      <div className={styles.grid}>
        {/** Description */}
        <div>
          <PortableText blocks={data.description[0].description}></PortableText>
        </div>
        {/** Organizations */}
        <div>
          {
            data.organizations.map((organization: any) => <>
              <div key={organization._id} className={styles.organization}>
                <div className={styles.meta}>
                  <h2>{organization.name}</h2>
                  <h3>{organization.subtitle}</h3>
                </div>
                <div className={styles.description}>
                  <PortableText blocks={organization.content}></PortableText>
                </div>
              </div>
            </>)
          }
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const data = await getClient(preview).fetch(fetchOrganizationsPage)

  return {
    props: {
      preview,
      data,
    },
  }
}

const fetchOrganizationsPage = groq`
{
  "description": *[_type == "organizations"] {
    description
  },
  "organizations": *[_type == "organization"] {
    _id,
    name,
    subtitle,
    content
  }
}
`

Organizations.layout = Layout
export default Organizations