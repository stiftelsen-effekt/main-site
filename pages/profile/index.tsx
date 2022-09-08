import { useAuth0, User } from "@auth0/auth0-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import DonationsChart from "../../components/profile/donations/DonationsChart/DonationsChart";
import DonationsTotals from "../../components/profile/donations/DonationsTotal/DonationsTotal";
import DonationYearMenu from "../../components/profile/donations/YearMenu/YearMenu";
import { DonationList } from "../../components/profile/shared/lists/donationList/DonationList";
import { Layout } from "../../components/profile/layout/layout";
import { AggregatedDonations, Distribution, Donation, Donor } from "../../models";
import { LayoutPage } from "../../types";
import style from "../../styles/Donations.module.css";
import DonationsDistributionTable from "../../components/profile/donations/DonationsDistributionTable/DonationsDistributionTable";
import { DonorContext } from "../../components/profile/layout/donorProvider";
import {
  useAggregatedDonations,
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

const Home: LayoutPage<{ data: any }> = ({ data }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const router = useRouter();
  const settings = data.result.settings[0];
  const { donor } = useContext(DonorContext);
  const { setActivity } = useContext(ActivityContext);

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

  const dataAvailable = donations && distributions && aggregatedDonations && donor;
  const loading = aggregatedLoading || donationsLoading || distributionsLoading;
  const validating =
    aggregatedDonationsValidating || donationsIsValidating || distributionsValidating;
  if (!dataAvailable || loading)
    return (
      <>
        <PageContent>
          <h3 className={style.header}>Donasjoner</h3>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner />
          </div>
        </PageContent>
      </>
    );

  if (validating) setActivity(true);
  else setActivity(false);

  const isTotal = typeof router.query.year === "undefined";
  const years = getYears(donor, donations);
  const firstYear = Math.min(...years);
  const sum = getDonationSum(aggregatedDonations, router.query.year as string);
  const distributionsMap = new Map<string, Distribution>();
  distributions.map((dist: Distribution) => distributionsMap.set(dist.kid, dist));

  const periodText = !isTotal
    ? `I ${router.query.year} har du gitt`
    : `Siden ${firstYear} har du gitt`;

  let distribution = !isTotal
    ? getYearlyDistribution(aggregatedDonations, parseInt(router.query.year as string))
    : getTotalDistribution(aggregatedDonations);

  const donationList = !isTotal ? (
    <DonationList
      donations={donations
        .filter(
          (donation: Donation) =>
            new Date(donation.timestamp).getFullYear() === parseInt(router.query.year as string),
        )
        .sort(
          (a: Donation, b: Donation) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )}
      distributions={distributionsMap}
      year={router.query.year as string}
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
        <Navbar logo={settings.logo} />
        <DonationYearMenu
          years={years}
          selected={(router.query.year as string) || "total"}
          mobile
        />
      </MainHeader>

      <PageContent>
        <h3 className={style.header}>Donasjoner</h3>

        <DonationYearMenu years={years} selected={(router.query.year as string) || "total"} />

        <DonationsChart distribution={distribution}></DonationsChart>

        <div className={style.details}>
          <DonationsDistributionTable distribution={distribution}></DonationsDistributionTable>
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
};

Home.layout = Layout;

export async function getStaticProps({ preview = false }) {
  const result = await getClient(preview).fetch(fetchProfilePage);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchProfilePage,
        queryParams: {},
      },
    },
  };
}

const fetchProfilePage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
  },
  ${footerQuery}
  ${widgetQuery}
}
`;

export default Home;

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
