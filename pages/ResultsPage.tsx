import { groq } from "next-sanity";
import { linksContentQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.server";
import styles from "../styles/Results.module.css";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem, getAppStaticProps } from "./_app.page";
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

const fetchResultsPageSlug = groq`
{
  "page": *[_type == "results"] {
    "slug": slug.current,
  }[0]
}
`;

export const getResultsPagePath = async () => {
  const { page } = await getClient(false).fetch<{ page: { slug: string } }>(fetchResultsPageSlug);
  return page.slug.split("/");
};

export type ResultsGraphData = {
  dailyDonations: DailyDonations;
  referralSums: ReferralSumsResult[];
  monthlyDonationsPerOutput: MonthlyDonationsPerOutputResult[];
};

export const ResultsPage = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps({ preview });

  let result = await getClient(preview).fetch(fetchResults);
  result = { ...result, page: filterPageToSingleItem(result, preview) };

  const dailyDonationsResult = await fetch(`http://localhost:5050/results/donations/daily`);
  const dailyDonations = await dailyDonationsResult.json();

  const referralSumsResult = await fetch(`http://localhost:5050/results/referrals/sums`);
  const referralSums = await referralSumsResult.json();

  const monthlyDonationsPerOutputResult = await fetch(
    `http://localhost:5050/results/donations/monthly/outputs`,
  );
  const monthlyDonationsPerOutput = await monthlyDonationsPerOutputResult.json();

  return {
    appStaticProps,
    preview: preview,
    navbarData: await Navbar.getStaticProps({ dashboard: false, preview }),
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
})(({ data, navbarData, preview }) => {
  const page = data.result.page;

  const header = page.header;
  const results = data.result;
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
  "page": *[_type == "results"] {
    "slug": slug.current,
    content[] {
      ...,
      blocks[] {
        _type == 'reference' => @->,
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
  },
}
`;

/*

      <SectionContainer heading="Kumulativt donasjonsvolum per år" ypadded>
        <div className={styles.results}>
          <CumulativeDonations dailyDonations={graphData.dailyDonations}></CumulativeDonations>
        </div>
      </SectionContainer>
      <SectionContainer heading="Donasjonsvolum per år og referanse" ypadded>
        <ReferralSums referralSums={graphData.referralSums}></ReferralSums>
      </SectionContainer>
      <SectionContainer ypadded>
      {
        graphData.monthlyDonationsPerOutput.map((monthlyDonationsPerOrg: MonthlyDonationsPerOutputResult) => {
          return (
            <ResultsOutput key={monthlyDonationsPerOrg.output} graphData={monthlyDonationsPerOrg} description={[]}></ResultsOutput>
          );
        })
      }
      </SectionContainer>

      */
