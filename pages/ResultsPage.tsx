import { groq } from "next-sanity";
import { linksContentQuery, linksSelectorQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.client";
import styles from "../styles/Results.module.css";
import { withStaticProps } from "../util/withStaticProps";
import { getAppStaticProps } from "./_app.page";
import {
  CumulativeDonations,
  DailyDonations,
} from "../components/shared/components/Graphs/Results/CumulativeDonations/CumulativeDonations";
import {
  ReferralSums,
  ReferralSumsResult,
} from "../components/shared/components/Graphs/Results/ReferralSums/ReferralSums";
import { ResultContentRenderer } from "../components/main/blocks/ResultContentRenderer";
import { MonthlyDonationsPerOutputResult } from "../components/shared/components/Graphs/Results/Outputs/Outputs";
import { token } from "../token";
import { stegaClean } from "@sanity/client/stega";

const fetchResultsPageSlug = groq`
{
  "page": *[_type == "results"] {
    "slug": slug.current,
  }[0]
}
`;

export const getResultsPagePath = async () => {
  const { page } = await getClient().fetch<{ page: { slug: string } }>(fetchResultsPageSlug);
  return stegaClean(page.slug).split("/");
};

export type ResultsGraphData = {
  dailyDonations: DailyDonations;
  referralSums: ReferralSumsResult[];
  monthlyDonationsPerOutput: MonthlyDonationsPerOutputResult[];
};

export const ResultsPage = withStaticProps(
  async ({ draftMode = false }: { draftMode: boolean }) => {
    const appStaticProps = await getAppStaticProps({ draftMode });

    let result = await getClient(draftMode ? token : undefined).fetch(fetchResults);

    const dailyDonationsResult = await fetch(
      `${process.env.NEXT_PUBLIC_EFFEKT_API}/results/donations/daily`,
    );
    const dailyDonations = await dailyDonationsResult.json();

    const referralSumsResult = await fetch(
      `${process.env.NEXT_PUBLIC_EFFEKT_API}/results/referrals/sums`,
    );
    const referralSums = await referralSumsResult.json();

    const monthlyDonationsPerOutputResult = await fetch(
      `${process.env.NEXT_PUBLIC_EFFEKT_API}/results/donations/monthly/outputs`,
    );
    const monthlyDonationsPerOutput = await monthlyDonationsPerOutputResult.json();

    return {
      appStaticProps,
      draftMode,
      navbarData: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      data: {
        result,
        query: fetchResults,
        queryParams: {},
        graphData: {
          dailyDonations: dailyDonations.content as DailyDonations,
          referralSums: referralSums.content as ReferralSumsResult[],
          monthlyDonationsPerOutput:
            monthlyDonationsPerOutput.content as MonthlyDonationsPerOutputResult[],
        },
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, navbarData, draftMode }) => {
  const page = data.result.page;

  if (!page) {
    return <div>Page not found</div>;
  }

  const header = page.header;
  const graphData = data.graphData;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/${page.slug}`}
        titleTemplate={`${data.result.settings[0].title} | %s`}
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <div className={styles.inverted}>
        <MainHeader hideOnScroll={true}>
          <CookieBanner configuration={data.result.settings[0].cookie_banner_configuration} />
          <Navbar {...navbarData} />
        </MainHeader>

        <PageHeader
          title={header.title}
          inngress={header.inngress}
          links={header.links}
          layout={header.centered ? "centered" : "default"}
        />
      </div>

      <ResultContentRenderer content={page.content} graphData={graphData} />
    </>
  );
});

const fetchResults = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    cookie_banner_configuration,
  },
  "page": *[_type == "results"][0] {
    "slug": slug.current,
    content[] {
      ...,
      blocks[] {
        _type == 'reference' => @->,
        _type == 'resultsoutput' => {
          ...,
          organization_links[] {
            ...,
            link {
              ...,
              ${linksSelectorQuery}
            },
          },
          links {
            ...,
            ${linksContentQuery}
          },
        },
        _type != 'resultsoutput' && _type != 'reference' => @,
      },
    },
    header {
      ...,
      seoImage{
        asset->
      },
      ${linksContentQuery}
    },
  },
}
`;
