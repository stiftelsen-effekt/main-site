import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { linksContentQuery, useAnonymousVippsAgreement, widgetQuery } from "../../_queries";
import styles from "../../styles/Agreements.module.css";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { Navbar } from "../../components/profile/layout/navbar";
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { AgreementDetails } from "../../components/profile/shared/lists/agreementList/AgreementDetails";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";

export async function getVippsAnonymousPagePath() {
  const result = await getClient(false).fetch<FetchVippsAnonymousPageResult>(
    fetchVippsAnonymousPage,
  );

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const slug = result?.vipps?.[0]?.anonymous_page?.slug.current;
  console.log(dashboardSlug, slug, result.vipps);

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}

export const VippsAnonymousPage = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps({
    layout: LayoutType.Profile,
  });
  const result = await getClient(preview).fetch<FetchVippsAnonymousPageResult>(
    fetchVippsAnonymousPage,
  );

  return {
    appStaticProps,
    preview: preview,
    data: {
      result: result,
      query: fetchVippsAnonymousPage,
      queryParams: {},
    },
  };
})(({ data, preview }) => {
  const settings = data.result.settings[0];
  const router = useRouter();
  const agreementUrlCode = router.query.agreementUrlCode as string;
  const {
    loading: vippsLoading,
    data: vipps,
    isValidating: vippsRefreshing,
    error: vippsError,
  } = useAnonymousVippsAgreement(agreementUrlCode);

  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Anonym Vipps-avtale</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} />
      </MainHeader>

      <PageContent>
        <div className={styles.container}>
          <h3 className={styles.header}>Din Vipps-avtale</h3>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {/* {agreement &&
            <AgreementDetails
              type={agreement.type}
              endpoint={agreement.endpoint}
              inputDistribution={}
              inputSum={agreement.amount}
              inputDate={agreement.date}
            />
          } */}
        </div>
      </PageContent>
    </>
  );
});

type FetchVippsAnonymousPageResult = {
  settings: any[];
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
  vipps?: Array<{
    anonymous_page: Record<string, any> & {
      slug: {
        current: string;
      };
    };
  }>;
};

const fetchVippsAnonymousPage = groq`
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
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    }
  },
  ${widgetQuery}
  ${footerQuery}
  "vipps": *[_id == "vipps"] {
    anonymous_page->{
      slug {
        current
      },
      header {
        ...,
        seoImage{
          asset->
        },
        ${linksContentQuery}
      },
      content,
    }
  }
}
`;

// const fetchVippsAnonymousPage = groq`
// {
//   "settings": *[_type == "site_settings"] {
//     logo,
//   },
//   "dashboard": *[_id == "dashboard"] {
//     dashboard_slug {
//       current
//     }
//   },
//   "page": *[_id == "vipps-anonymous"] {
//     slug {
//       current
//     },
//     tax,
//     data
//   },
//   ${footerQuery}
//   ${widgetQuery}
// }`;
