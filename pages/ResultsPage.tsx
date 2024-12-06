import { groq } from "next-sanity";
import { linksContentQuery, linksSelectorQuery, pageBannersContentQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { Navbar, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.client";
import styles from "../styles/Results.module.css";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { DailyDonations } from "../components/shared/components/Graphs/Results/CumulativeDonations/CumulativeDonations";
import { ReferralSumsResult } from "../components/shared/components/Graphs/Results/ReferralSums/ReferralSums";
import { ResultContentRenderer } from "../components/main/blocks/ResultContentRenderer";
import { MonthlyDonationsPerOutputResult } from "../components/shared/components/Graphs/Results/Outputs/Outputs";
import { token } from "../token";
import { stegaClean } from "@sanity/client/stega";
import { ResultsHadlineNumbers } from "../components/shared/components/ResultsHeadline/ResultsHeadline";
import { ConsentState } from "../middleware.page";

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
  resultsHeadlineNumbers: ResultsHadlineNumbers;
};

type ResultsPageProps = GeneralPageProps & {
  data: {
    graphData: ResultsGraphData;
  };
};

export const ResultsPage = withStaticProps(
  async ({
    draftMode = false,
    consentState,
  }: {
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, consentState });

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

    const resultsHeadlineNumbersResult = await fetch(
      `${process.env.NEXT_PUBLIC_EFFEKT_API}/results/headline`,
    );
    const resultsHeadlineNumbers = await resultsHeadlineNumbersResult.json();

    return {
      appStaticProps,
      draftMode,
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      data: {
        result,
        query: fetchResults,
        queryParams: {},
        graphData: {
          dailyDonations: dailyDonations.content as DailyDonations,
          referralSums: referralSums.content as ReferralSumsResult[],
          monthlyDonationsPerOutput:
            monthlyDonationsPerOutput.content as MonthlyDonationsPerOutputResult[],
          resultsHeadlineNumbers: resultsHeadlineNumbers.content as ResultsHadlineNumbers,
        },
      },
    } satisfies ResultsPageProps;
  },
)(({ data, navbar, draftMode }) => {
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
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}`}
        titleTemplate={`${data.result.settings[0].title} | %s`}
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <div className={styles.inverted}>
        <MainHeader
          hideOnScroll={true}
          cookieBannerConfig={data.result.settings[0].cookie_banner_configuration}
          generalBannerConfig={data.result.settings[0].general_banner}
        >
          {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
        </MainHeader>

        <PageHeader
          title={header.title}
          inngress={header.inngress}
          links={header.links}
          layout={header.layout}
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
    ${pageBannersContentQuery}
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
