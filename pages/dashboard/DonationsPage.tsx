import { useAuth0, User } from "@auth0/auth0-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import DonationsChart from "../../components/profile/donations/DonationsChart/DonationsChart";
import DonationsTotals from "../../components/profile/donations/DonationsTotal/DonationsTotal";
import DonationYearMenu from "../../components/profile/donations/YearMenu/YearMenu";
import { DonationList } from "../../components/profile/shared/lists/donationList/DonationList";
import { AggregatedDonations, Distribution, Donation, Donor } from "../../models";
import style from "../../styles/Donations.module.css";
import DonationsDistributionTable from "../../components/profile/donations/DonationsDistributionTable/DonationsDistributionTable";
import { DonorContext } from "../../components/profile/layout/donorProvider";
import {
  useAggregatedDonations,
  useAllOrganizations,
  useDistributions,
  useDonations,
  widgetQuery,
} from "../../_queries";
import { ActivityContext } from "../../components/profile/layout/activityProvider";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { Navbar } from "../../components/profile/layout/navbar";
import { DonationsYearlyGraph } from "../../components/profile/donations/DonationsYearlyChart/DonationsYearlyChart";
import { Spinner } from "../../components/shared/components/Spinner/Spinner";
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { withStaticProps } from "../../util/withStaticProps";
import { getAppStaticProps, LayoutType } from "../_app.page";

export async function getDashboardPagePath() {
  const result = await getClient(false).fetch<FetchDonationsPageResult>(fetchDonationsPage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;

  if (!dashboardSlug) throw new Error("Dashboard slug not found");

  return dashboardSlug.split("/");
}

export async function getDonationsPagePath() {
  const result = await getClient(false).fetch<FetchDonationsPageResult>(fetchDonationsPage);
  const dashboardPath = await getDashboardPagePath();

  const donationsSlug = result?.page?.[0]?.slug?.current;

  if (!donationsSlug) return null;

  return [...dashboardPath, ...donationsSlug.split("/")];
}

export async function getDonationsPageSubpaths() {
  const donationsPagePath = await getDonationsPagePath();

  if (!donationsPagePath) return [];

  const years = getYearPaths();

  return years.map((year) => [...donationsPagePath, year]);
}

const getYearPaths = () => {
  const currentYear = new Date().getFullYear();
  const yearPaths = [];
  for (let year = 2016; year <= currentYear + 1; year++) {
    yearPaths.push(year.toString());
  }

  return yearPaths;
};

export const DonationsPage = withStaticProps(
  async ({ preview, path }: { preview: boolean; path: string[] }) => {
    const appStaticProps = await getAppStaticProps({
      layout: LayoutType.Profile,
    });
    const result = await getClient(preview).fetch<FetchDonationsPageResult>(fetchDonationsPage);

    const donationsPagePath = await getDonationsPagePath();

    const filterYear =
      (donationsPagePath && donationsPagePath.length < path.length && path.at(-1)) || null;

    return {
      appStaticProps,
      preview: preview,
      filterYear,
      data: {
        result: result,
        query: fetchDonationsPage,
        queryParams: {},
      },
    };
  },
)(({ data, filterYear }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const settings = data.result.settings[0];
  const dashboard = data.result.dashboard[0];
  const { donor } = useContext(DonorContext);

  const {
    loading: aggregatedLoading,
    data: aggregatedDonations,
    isValidating: aggregatedDonationsValidating,
    error: aggregatedError,
  } = useAggregatedDonations(user as User, getAccessTokenSilently);

  const {
    loading: donationsLoading,
    data: donations,
    isValidating: donationsIsValidating,
    error: donationsError,
  } = useDonations(user as User, getAccessTokenSilently);

  const kids = new Set<string>();
  donations?.map((donation: Donation) => kids.add(donation.KID));

  const {
    loading: distributionsLoading,
    data: distributions,
    isValidating: distributionsValidating,
    error: distributionsError,
  } = useDistributions(user as User, getAccessTokenSilently, !donationsLoading, Array.from(kids));

  const {
    data: organizations,
    loading: organizationsloading,
    isValidating: organizationsValidation,
    error: organizationsError,
  } = useAllOrganizations(user as User, getAccessTokenSilently);

  const dataAvailable = donations && distributions && aggregatedDonations && donor && organizations;
  const loading =
    aggregatedLoading || donationsLoading || distributionsLoading || organizationsloading;

  if (!dataAvailable || loading)
    return (
      <>
        <Head>
          <title>Gi Effektivt. | Donasjoner</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainHeader hideOnScroll={false}>
          <Navbar logo={settings.logo} elements={dashboard.main_navigation} />
        </MainHeader>

        <PageContent>
          <h3 className={style.header}>Donasjoner</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "10vh",
              paddingBottom: "40vh",
            }}
          >
            <Spinner />
          </div>
        </PageContent>
      </>
    );

  const isTotal = filterYear === null;

  const years = getYears(donor, donations);
  const firstYear = Math.min(...years);
  const sum = getDonationSum(aggregatedDonations, filterYear || undefined);
  const distributionsMap = new Map<string, Distribution>();
  distributions.map((dist: Distribution) => distributionsMap.set(dist.kid, dist));

  const periodText = !isTotal ? `I ${filterYear} har du gitt` : `Siden ${firstYear} har du gitt`;

  let distribution = !isTotal
    ? getYearlyDistribution(aggregatedDonations, parseInt(filterYear))
    : getTotalDistribution(aggregatedDonations);

  const donationList = !isTotal ? (
    <DonationList
      donations={donations
        .filter(
          (donation: Donation) =>
            new Date(donation.timestamp).getFullYear() === parseInt(filterYear),
        )
        .sort(
          (a: Donation, b: Donation) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )}
      distributions={distributionsMap}
      year={filterYear}
      firstOpen={false}
    />
  ) : (
    years
      .sort((a, b) => b - a)
      .map((year) => (
        <DonationList
          key={year}
          donations={donations
            .filter((donation: Donation) => new Date(donation.timestamp).getFullYear() === year)
            .sort(
              (a: Donation, b: Donation) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            )}
          distributions={distributionsMap}
          year={year.toString()}
          firstOpen={false}
        />
      ))
  );

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Donasjoner</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} elements={dashboard.main_navigation} />
        <DonationYearMenu years={years} selected={filterYear || "total"} mobile />
      </MainHeader>

      <PageContent>
        <h3 className={style.header}>Donasjoner</h3>

        <DonationYearMenu years={years} selected={filterYear || "total"} />

        <DonationsChart distribution={distribution} organizations={organizations}></DonationsChart>

        <div className={style.details}>
          <DonationsDistributionTable
            donations={
              isTotal
                ? donations
                : donations.filter(
                    (donation: Donation) =>
                      new Date(donation.timestamp).getFullYear() === parseInt(filterYear),
                  )
            }
            distributionMap={distributionsMap}
          ></DonationsDistributionTable>
          <DonationsTotals sum={sum} period={periodText} />
        </div>
        {isTotal && window.innerWidth < 1180 ? (
          <DonationsYearlyGraph data={getYearlySum(aggregatedDonations, years)} />
        ) : (
          donationList
        )}
      </PageContent>
    </>
  );
});

type FetchDonationsPageResult = {
  settings: any[];
  dashboard: Array<{ dashboard_slug?: { current?: string }; main_navigation: any[] }>;
  page?: Array<{ slug?: { current?: string } }>;
  footer: any[];
  widget: any[];
};

const fetchDonationsPage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
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
  "page": *[_id == "donations"] {
    slug {
      current
    }
  },
  ${footerQuery}
  ${widgetQuery}
}
`;

const getTotalDistribution = (
  aggregated: AggregatedDonations[],
): { org: string; sum: number }[] => {
  const distribution = [];

  const summed = aggregated.reduce((acc: { [key: string]: number }, curr) => {
    if (curr.organization in acc) {
      acc[curr.organization] += parseFloat(curr.value);
    } else {
      acc[curr.organization] = parseFloat(curr.value);
    }
    return acc;
  }, {});

  for (const key in summed) {
    distribution.push({ org: key, sum: summed[key] });
  }

  return distribution;
};

const getYearlyDistribution = (
  aggregated: AggregatedDonations[],
  year: number,
): { org: string; sum: number }[] => {
  return aggregated
    .filter((el) => el.year === year)
    .map((el) => ({ org: el.organization, sum: parseFloat(el.value) }));
};

const getYearlySum = (
  aggregated: AggregatedDonations[],
  years: number[],
): { year: string; sum: number }[] => {
  return years.map((year) => ({
    year: year.toString(),
    sum: aggregated.reduce(
      (acc, curr) => (curr.year == year ? acc + parseFloat(curr.value) : acc),
      0,
    ),
  }));
};

const getYears = (donor: Donor, donations: Donation[]) => {
  const registeredYear = new Date(donor.registered).getFullYear();
  const minimumDonationYear = Math.min(
    ...donations.map((donation) => new Date(donation.timestamp).getFullYear()),
  );
  const minYear = Math.min(registeredYear, minimumDonationYear);
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = minYear; i <= currentYear; i++) {
    years.push(i);
  }
  return years;
};

const getDonationSum = (aggregatedDonations: AggregatedDonations[], year?: string) => {
  return Math.round(
    aggregatedDonations.reduce(
      (acc, curr) => (year === curr.year.toString() || !year ? acc + parseFloat(curr.value) : acc),
      0,
    ),
  );
};
