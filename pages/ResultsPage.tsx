import { groq } from "next-sanity";
import { linksContentQuery, linksSelectorQuery, pageBannersContentQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { Navbar, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
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
import { FetchResultsResult } from "../studio/sanity.types";

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
    graphData: ResultsGraphData | null;
  };
};

type ApiResponse<T> = {
  status: number;
  content: T;
};
async function fetchApiData<T>(endpoint: string): Promise<T | undefined> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_EFFEKT_API}${endpoint}`);
    const data = (await response.json()) as ApiResponse<T>;

    // Check if the response is successful and contains content
    if (data.status === 200 && data.content) {
      return data.content;
    }

    console.warn(`Failed to fetch data from ${endpoint}: Invalid response format or status`);
    return undefined;
  } catch (error) {
    console.warn(`Failed to fetch data from ${endpoint}:`, error);
    return undefined;
  }
}

// Function to fetch all graph data in parallel
async function fetchResultsGraphData(): Promise<ResultsGraphData | null> {
  const [dailyDonations, referralSums, monthlyDonationsPerOutput, resultsHeadlineNumbers] =
    await Promise.all([
      fetchApiData<DailyDonations>("/results/donations/daily"),
      fetchApiData<ReferralSumsResult[]>("/results/referrals/sums"),
      fetchApiData<MonthlyDonationsPerOutputResult[]>("/results/donations/monthly/outputs"),
      fetchApiData<ResultsHadlineNumbers>("/results/headline"),
    ]);

  // Validate all data is present
  if (dailyDonations && referralSums && monthlyDonationsPerOutput && resultsHeadlineNumbers) {
    return {
      dailyDonations,
      referralSums,
      monthlyDonationsPerOutput,
      resultsHeadlineNumbers,
    };
  }

  return null;
}

export const ResultsPage = withStaticProps(
  async ({
    draftMode = false,
    consentState,
  }: {
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, consentState });

    // Fetch Sanity data
    const result = await getClient(draftMode ? token : undefined).fetch<FetchResultsResult>(
      fetchResults,
    );

    // Fetch graph data
    const graphData = await fetchResultsGraphData();

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
        graphData,
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
        title={(header?.seoTitle || header?.title) ?? ""}
        description={(header?.seoDescription || header?.inngress) ?? ""}
        imageAssetUrl={header?.seoImage?.asset?.url ?? undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug ?? ""}`}
        titleTemplate={`${data.result.settings[0]?.title ?? ""} | %s`}
        keywords={header?.seoKeywords ?? undefined}
        siteName={data.result.settings[0]?.title ?? ""}
      />

      <div className={styles.inverted}>
        <MainHeader
          hideOnScroll={true}
          cookieBannerConfig={data.result.settings[0]?.cookie_banner_configuration ?? null}
          generalBannerConfig={data.result.settings[0]?.general_banner ?? null}
        >
          {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
        </MainHeader>

        <PageHeader
          title={header?.title ?? ""}
          inngress={header?.inngress ?? ""}
          links={(header?.links as any) ?? []}
          layout={header?.layout ?? "default"}
        />
      </div>

      {graphData && (
        <ResultContentRenderer
          content={page.content}
          graphData={graphData}
          textConfig={{
            textConfiguration: page.textConfiguration ?? undefined,
            outputMappings:
              page.outputMappings?.filter(
                (m): m is { sanityKey: string; dataKey: string } =>
                  m.sanityKey !== null && m.dataKey !== null,
              ) ?? undefined,
            organizationMappings:
              page.organizationMappings?.filter(
                (m): m is { abbreviation: string; fullName: string } =>
                  m.abbreviation !== null && m.fullName !== null,
              ) ?? undefined,
            referralTypeMappings:
              page.referralTypeMappings?.filter(
                (m): m is { apiKey: string; displayLabel: string } =>
                  m.apiKey !== null && m.displayLabel !== null,
              ) ?? undefined,
          }}
        />
      )}
      {!graphData && <span>No results data available</span>}
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
        _type == 'cumulativedonationsgraph' => {
          ...,
          "table_headers": *[_type == "results"][0].textConfiguration.table_headers.cumulative_donations_table_headers,
        },
        _type == 'referralgraph' => {
          ...,
          tableText {
            yearColumnHeader,
            typeColumnHeader,
            donationSumColumnHeader,
            donationCountColumnHeader
          }
        },
        _type == 'resultsoutput' => {
          ...,
          "table_headers": *[_type == "results"][0].textConfiguration.table_headers.output_donations_table_headers,
        },
        _type != 'reference' => @,
      },
    },
    header {
      ...,
      seoImage{
        asset->
      },
      ${linksContentQuery}
    },
    textConfiguration,
    outputMappings[] {
      sanityKey,
      dataKey
    },
    organizationMappings[] {
      abbreviation,
      fullName
    },
    referralTypeMappings[] {
      apiKey,
      displayLabel
    },
  },
}
`;
