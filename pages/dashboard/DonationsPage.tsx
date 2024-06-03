import { useAuth0 } from "@auth0/auth0-react";
import style from "../../styles/Donations.module.css";
import { withStaticProps } from "../../util/withStaticProps";
import { getAppStaticProps, LayoutType } from "../_app.page";
import { ErrorMessage } from "../../components/profile/shared/ErrorMessage/ErrorMessage";
import { useDebouncedCallback } from "use-debounce";
import { DonationDetailsConfiguration } from "../../components/profile/shared/lists/donationList/DonationDetails";
import { getClient } from "../../lib/sanity.client";
import { useContext, useEffect, useState } from "react";
import { DonorContext } from "../../components/profile/layout/donorProvider";
import {
  useAggregatedDonations,
  useAllOrganizations,
  useDistributions,
  useDonations,
  useTaxUnits,
} from "../../_queries";
import Head from "next/head";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { Spinner } from "../../components/shared/components/Spinner/Spinner";
import { AggregatedDonations, Distribution, Donation, Donor } from "../../models";
import {
  DonationList,
  DonationsListConfiguration,
} from "../../components/profile/shared/lists/donationList/DonationList";
import DonationYearMenu from "../../components/profile/donations/YearMenu/YearMenu";
import DonationsChart from "../../components/profile/donations/DonationsChart/DonationsChart";
import {
  AggregatedImpactTableConfiguration,
  DonationsAggregateImpactTable,
} from "../../components/profile/donations/DonationsAggregateImpactTable/DonationsAggregateImpactTable";
import DonationsTotals from "../../components/profile/donations/DonationsTotal/DonationsTotal";
import { DonationsYearlyGraph } from "../../components/profile/donations/DonationsYearlyChart/DonationsYearlyChart";
import { groq } from "next-sanity";
import { Navbar } from "../../components/shared/components/Navbar/Navbar";
import { InfoBox } from "../../components/shared/components/Infobox/Infobox";
import { Info } from "react-feather";
import { token } from "../../token";

export async function getDashboardPagePath() {
  const result = await getClient().fetch<FetchDonationsPageResult>(fetchDonationsPage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;

  if (!dashboardSlug) throw new Error("Dashboard slug not found");

  return dashboardSlug.split("/");
}

export async function getDonationsPagePath() {
  let result = await getClient().fetch<FetchDonationsPageResult>(fetchDonationsPage);

  const dashboardPath = await getDashboardPagePath();

  const donationsSlug = result.page?.slug?.current;

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
  async ({ draftMode = false, path }: { draftMode: boolean; path: string[] }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, layout: LayoutType.Profile });
    const result = await getClient(draftMode ? token : undefined).fetch<FetchDonationsPageResult>(
      fetchDonationsPage,
    );

    const donationsPagePath = await getDonationsPagePath();

    const filterYear =
      (donationsPagePath && donationsPagePath.length < path.length && path.at(-1)) || null;

    return {
      appStaticProps,
      draftMode,
      filterYear,
      navbarData: await Navbar.getStaticProps({ dashboard: true, draftMode }),
      data: {
        result: result,
        query: fetchDonationsPage,
        queryParams: {},
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, navbarData, filterYear }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const settings = data.result.settings[0];

  if (!data.result.dashboard || !data.result.dashboard[0]) {
    return (
      <ErrorMessage>
        <p>Missing dashboard configuration</p>
      </ErrorMessage>
    );
  }

  const dashboard = data.result.dashboard[0];
  const page = data.result.page;

  if (!page)
    return (
      <ErrorMessage>
        <p>Missing page configuration</p>
      </ErrorMessage>
    );

  /**
   * We listen for window changes to determine if we should render the mobile or desktop version of the page.
   * We use a debounced callback to listen for the resize event, and then set the state accordingly.
   * TODO: Refactor this to a custom hook
   * This logic is used a couple of places, could be centralized
   */
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 1180,
  );

  const debouncedMobileCheck = useDebouncedCallback(
    () => {
      typeof window !== "undefined" && window.innerWidth <= 1180
        ? setIsMobile(true)
        : setIsMobile(false);
    },
    500,
    { trailing: true },
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedMobileCheck);
    }
  }, []);

  const { donor } = useContext(DonorContext);

  /**
   * Load the required data from the REST API
   */
  const {
    loading: aggregatedLoading,
    data: aggregatedDonations,
    isValidating: aggregatedDonationsValidating,
    error: aggregatedError,
  } = useAggregatedDonations(user, getAccessTokenSilently);

  const {
    loading: donationsLoading,
    data: donations,
    isValidating: donationsIsValidating,
    error: donationsError,
  } = useDonations(user, getAccessTokenSilently);

  const kids = new Set<string>();
  donations?.map((donation: Donation) => kids.add(donation.KID));

  const {
    loading: distributionsLoading,
    data: distributions,
    isValidating: distributionsValidating,
    error: distributionsError,
  } = useDistributions(user, getAccessTokenSilently, !donationsLoading, Array.from(kids));

  const {
    data: organizations,
    loading: organizationsloading,
    isValidating: organizationsValidation,
    error: organizationsError,
  } = useAllOrganizations(getAccessTokenSilently);

  const {
    data: taxUnits,
    loading: taxUnitsLoading,
    isValidating: taxUnitsValidation,
    error: taxUnitsError,
  } = useTaxUnits(user, getAccessTokenSilently);

  /**
   * While data is loading, we show a spinner
   * In the future, we probably want to move this to a server side fetch
   */

  const dataAvailable =
    donations && distributions && aggregatedDonations && donor && organizations && taxUnits;
  const loading =
    aggregatedLoading ||
    donationsLoading ||
    distributionsLoading ||
    organizationsloading ||
    taxUnitsLoading;

  if (!dataAvailable || loading)
    return (
      <>
        <Head>
          <title>
            {settings.title} | {page.title}
          </title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainHeader hideOnScroll={false}>
          <Navbar {...navbarData} />
        </MainHeader>

        <PageContent>
          <h3 className={style.header}>{page.title}</h3>
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

  /**
   * We have two states for the page, either we are showing the total donations over all years, or we are showing the donations for a given year
   */
  const isTotal = filterYear === null;

  const years = getYears(donor, donations);
  const firstYear = Math.min(...years);
  const sum = getDonationSum(aggregatedDonations, filterYear || undefined);

  /**
   * We create a hashmap to make it easier to find the distribution for a given donation
   */
  const distributionsMap = new Map<string, Distribution>();
  distributions.map((dist: Distribution) => distributionsMap.set(dist.kid, dist));

  let periodText = "";
  if (isTotal) {
    if (page.sum_all_times_template_string) {
      periodText = page.sum_all_times_template_string.replace("{{year}}", firstYear.toString());
    }
  } else {
    if (page.sum_year_template_string) {
      periodText = page.sum_year_template_string.replace("{{year}}", filterYear.toString());
    }
  }

  let distribution = !isTotal
    ? getYearlyDistribution(aggregatedDonations, parseInt(filterYear))
    : getTotalDistribution(aggregatedDonations);

  const tableConfiguration = isMobile
    ? page.mobile_donations_table_configuration
    : page.desktop_donations_table_configuration;

  let donationList: JSX.Element | JSX.Element[];
  if (!tableConfiguration) {
    donationList = (
      <ErrorMessage>
        <p>Missing Sanity configuration for donation list.</p>
      </ErrorMessage>
    );
  } else if (isTotal) {
    /**
     * When we are showing the total view, we list all the years in descending order
     */
    donationList = years
      .sort((a, b) => b - a)
      .map((year) =>
        tableConfiguration ? (
          <DonationList
            key={year}
            donations={donations
              .filter((donation: Donation) => new Date(donation.timestamp).getFullYear() === year)
              .sort(
                (a: Donation, b: Donation) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
              )}
            distributions={distributionsMap}
            taxUnits={taxUnits}
            year={year.toString()}
            configuration={tableConfiguration}
            detailsConfiguration={page.donations_details_configuration}
            firstOpen={false}
          />
        ) : (
          <ErrorMessage key={year}>
            <p>Missing Sanity configuration for donation list.</p>
          </ErrorMessage>
        ),
      );
  } else {
    /**
     * When we are showing the yearly view, we only show the donations for the given year
     */
    donationList = (
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
        taxUnits={taxUnits}
        year={filterYear}
        configuration={tableConfiguration}
        detailsConfiguration={page.donations_details_configuration}
        firstOpen={false}
      />
    );
  }

  return (
    <>
      <Head>
        <title>
          {settings.title} | {page.title}
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar {...navbarData} />
        <DonationYearMenu
          totalTitle={page.year_menu_total_title}
          years={years}
          selected={filterYear || "total"}
          mobile
        />
      </MainHeader>

      <PageContent>
        <h3 className={style.header}>{page.title}</h3>

        {settings.main_locale === "sv" && (
          <div style={{ margin: "2rem 0" }}>
            <InfoBox>
              <div style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                <Info size={"1.4rem"} style={{ marginRight: "1rem" }} />
                <span>
                  Ännu är inte alla donationer registrerade i vår databas. Vi arbetar med att
                  importera donationer från före 2023. Om du saknar en donation, vänligen kontakta
                  oss på <a href="mailto:donationer@geeffektivt.se">donationer@geeffektivt.se</a>.
                </span>
              </div>
            </InfoBox>
          </div>
        )}

        <DonationYearMenu
          totalTitle={page.year_menu_total_title}
          years={years}
          selected={filterYear || "total"}
        />

        <DonationsChart distribution={distribution} organizations={organizations}></DonationsChart>

        <div className={style.details}>
          {page.aggregate_estimated_impact ? (
            <DonationsAggregateImpactTable
              donations={
                isTotal
                  ? donations
                  : donations.filter(
                      (donation: Donation) =>
                        new Date(donation.timestamp).getFullYear() === parseInt(filterYear),
                    )
              }
              distributionMap={distributionsMap}
              configuration={page.aggregate_estimated_impact}
            ></DonationsAggregateImpactTable>
          ) : (
            <div>Aggregate donations impact texts are missing in Sanity</div>
          )}
          <DonationsTotals sum={sum} period={periodText} />
        </div>
        {isTotal && isMobile ? (
          <DonationsYearlyGraph data={getYearlySum(aggregatedDonations, years)} />
        ) : (
          donationList
        )}
      </PageContent>
    </>
  );
});

type DonationsPageData = {
  title: string;
  year_menu_total_title: string;
  sum_all_times_template_string?: string;
  sum_year_template_string?: string;
  aggregate_estimated_impact?: AggregatedImpactTableConfiguration;
  desktop_donations_table_configuration?: DonationsListConfiguration;
  mobile_donations_table_configuration?: DonationsListConfiguration;
  donations_details_configuration?: DonationDetailsConfiguration;
  slug?: { current?: string };
};

type FetchDonationsPageResult = {
  settings: {
    main_currency: string;
    main_locale: string;
    title: string;
  }[];
  dashboard?: Array<{ dashboard_slug?: { current?: string } }>;
  page: DonationsPageData | null;
  footer: any[];
  widget: any[];
};

const fetchDonationsPage = groq`
{
  "settings": *[_type == "site_settings"] {
    main_currency,
    main_locale,
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    }
  },
  "page": *[_id == "donations"] {
    ...,
    aggregate_estimated_impact->{
      ...,
      "currency": *[ _type == "site_settings"][0].main_currency,
      "locale": *[ _type == "site_settings"][0].main_locale,
    },
    desktop_donations_table_configuration,
    mobile_donations_table_configuration,
    donations_details_configuration {
      ...,
      impact_items_configuration {
        ...,
        "currency": *[ _type == "site_settings"][0].main_currency,
        "locale": *[ _type == "site_settings"][0].main_locale,
        impact_item_configuration {
          ...,
          "currency": *[ _type == "site_settings"][0].main_currency,
          "locale": *[ _type == "site_settings"][0].main_locale,
        }
      }
    },
    slug {
      current
    }
  },
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
