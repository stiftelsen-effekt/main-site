import { groq } from "next-sanity";
import { pageBannersContentQuery, pageContentQuery } from "../_queries";
import {
  BlockContentRenderer,
  SectionBlockContentRenderer,
} from "../components/main/blocks/BlockContentRenderer";
import { Navbar, NavLink, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.client";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";
import { stegaClean } from "@sanity/client/stega";
import { FetchFundraiserResult, Navitem } from "../studio/sanity.types";
import { ConsentState } from "../middleware.page";
import { FundraiserHeader } from "../components/main/layout/FundraiserHeader/FundraiserHeader";
import styles from "../styles/Fundraisers.module.css";
import { FundraiserProgressBar } from "../components/main/blocks/FundraiserProgressBar/FundraiserProgressBar";
import { FundraiserGiftActivity } from "../components/main/blocks/FundraiserGiftActivity/FundraiserGiftActivity";
import FundraiserWidget, {
  FundraiserWidgetMatchingConfig,
} from "../components/main/blocks/FundraiserWidget/FundraiserWidget";
import { API_URL } from "../components/shared/components/Widget/config/api";

export const getFundraiserPagePaths = async (fundraisersPagePath: string[]) => {
  const data = await getClient().fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchFundraisers,
  );

  return data.pages.map((page) => [
    ...fundraisersPagePath.map((component) => stegaClean(component)),
    stegaClean(page.slug.current),
  ]);
};

const fetchFundraisersSlug = groq`
{
  "settings": *[_type == "site_settings"][0] {
    fundraiser_page_slug
  }
}
`;

export const getFundraisersPath = async () => {
  const { settings } = await getClient().fetch<{ settings: { fundraiser_page_slug: string } }>(
    fetchFundraisersSlug,
  );
  return stegaClean(settings.fundraiser_page_slug).split("/");
};

export const FundraiserPage = withStaticProps(
  async ({
    slug,
    draftMode = false,
    consentState,
  }: {
    slug: string;
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({
      draftMode,
      consentState,
      showGiveButton: false,
    });

    let result = await getClient(draftMode ? token : undefined).fetch<FetchFundraiserResult>(
      fetchFundraiser,
      { slug },
    );

    if (!result.page) {
      return {
        appStaticProps,
        navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
        draftMode,
        preview: draftMode,
        token: draftMode ? token ?? null : null,
        data: {
          result,
          query: fetchFundraiser,
          queryParams: { slug },
        },
        fundraiserData: null,
      } satisfies GeneralPageProps;
    }

    const fundraiserId = result.page.fundraiser_database_id;

    let fundraiserData: {
      totalSum: number;
      donationCount: number;
      transactions: {
        id: number;
        name: string | null;
        message: string | null;
        amount: number;
        date: string;
      }[];
    } = await fetch(`${API_URL}/fundraisers/${fundraiserId}`)
      .then((res) => res.json())
      .then((data) => data.content);

    let augmentedData = {
      ...fundraiserData,
      matchingSum: 0,
      donationsSum: fundraiserData.totalSum,
    };
    if (result.page?.fundraiser_matching_config) {
      let nonExcludedTransactions = fundraiserData.transactions;

      if (result.page.fundraiser_matching_config.excluded) {
        nonExcludedTransactions = fundraiserData.transactions.filter(
          (transaction) =>
            !result.page?.fundraiser_matching_config?.excluded?.includes(transaction.id),
        );
      }

      const factor: number | undefined = result.page.fundraiser_matching_config.factor;
      if (factor) {
        let matchingSum = nonExcludedTransactions.reduce(
          (sum, transaction) => sum + transaction.amount * factor,
          0,
        );

        augmentedData = {
          ...augmentedData,
          matchingSum: matchingSum,
          totalSum: fundraiserData.totalSum + matchingSum,
        };
      }
    }

    return {
      appStaticProps,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      draftMode,
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      data: {
        result,
        query: fetchFundraiser,
        queryParams: { slug },
      },
      fundraiserData: augmentedData,
    } satisfies GeneralPageProps;
  },
)(({ data, fundraiserData, navbar, draftMode }) => {
  const { fundraisersPath } = useRouterContext();
  const page = data.result.page;

  if (!page) {
    return <div>404{draftMode ? " - Attempting to load preview" : null}</div>;
  }

  if (!fundraiserData) {
    return <div>Failed to fetch fundraiser data</div>;
  }

  if (!page.fundraiser_database_id) {
    return <div>Missing fundraiser database ID</div>;
  }

  if (!page.fundraiser_organization?.organization_page?.slug?.current) {
    return <div>Missing fundraiser organization page slug</div>;
  }

  if (!page.fundraiser_organization?.widget_button) {
    return <div>Missing fundraiser organization widget button</div>;
  }

  if (!page.fundraiser_organization?.widget_button?.cause_area_id) {
    return <div>Missing fundraiser organization cause area ID</div>;
  }

  if (!page.fundraiser_organization?.widget_button?.organization_id) {
    return <div>Missing fundraiser organization ID</div>;
  }

  function getValidImage(image: any) {
    if (image !== null && image.asset !== null) {
      return {
        asset: {
          _id: image.asset._id,
          url: image.asset.url || undefined,
        },
      };
    }
    return null;
  }
  const headerImage = getValidImage(page.header_image);
  const fundraiserImage = getValidImage(page.fundraiser_image);

  let matchingConfig: FundraiserWidgetMatchingConfig | undefined = undefined;
  if (page.fundraiser_matching_config && page.fundraiser_matching_config.factor) {
    matchingConfig = {
      maxMatching: page.fundraiser_matching_config.ceiling
        ? Math.max(page.fundraiser_matching_config.ceiling - fundraiserData.matchingSum, 0)
        : undefined,
      factor: page.fundraiser_matching_config.factor,
    };
  }

  const content = page.content;

  return (
    <>
      <SEO
        title={page.title || data.result.settings[0].title || ""}
        titleTemplate={`%s | ${data.result.settings[0].title}`}
        description={""}
        imageAssetUrl={page.header_image ? page.header_image.asset?.url : undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${[
          ...fundraisersPath,
          page.slug ? page.slug.current : "",
        ].join("/")}`}
        keywords={""}
        siteName={data.result.settings[0].title || ""}
      />

      <MainHeader
        hideOnScroll={true}
        alwaysShrink={true}
        cookieBannerConfig={data.result.settings[0].cookie_banner_configuration}
        generalBannerConfig={data.result.settings[0].general_banner}
      >
        {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
      </MainHeader>

      {headerImage && fundraiserImage && (
        <FundraiserHeader
          headerImage={headerImage}
          fundraiserImage={fundraiserImage}
        ></FundraiserHeader>
      )}

      <h1 className={styles.mobiletitle}>{page.title}</h1>
      <div className={styles.fundraisercontainer}>
        <div className={styles.fundraiserdescription}>
          <h1>{page.title}</h1>
          <SectionBlockContentRenderer blocks={page.description} />
        </div>

        <div className={styles.fundraiserdata}>
          <FundraiserProgressBar
            config={page.fundraiser_goal_config}
            currentAmount={fundraiserData.totalSum}
            matchingAmount={fundraiserData.matchingSum}
            matchingCeiling={page.fundraiser_matching_config?.ceiling}
          ></FundraiserProgressBar>

          <FundraiserWidget
            fundraiserId={page.fundraiser_database_id}
            organizationInfo={{
              organization: page.fundraiser_organization,
              textTemplate: page.fundraiser_organization_text_template || "{org}",
              organizationPageSlug: page.fundraiser_organization.organization_page.slug.current,
              databaseIds: {
                causeAreaId: page.fundraiser_organization.widget_button.cause_area_id,
                organizationId: page.fundraiser_organization.widget_button.organization_id,
              },
            }}
            suggestedSums={page.fundraiser_widget_config?.suggested_amounts}
            privacyPolicyUrl={
              data.result.settings[0].cookie_banner_configuration
                ?.privacy_policy_link as unknown as NavLink
            }
            matchingConfig={matchingConfig}
          ></FundraiserWidget>

          <FundraiserGiftActivity
            donations={fundraiserData.transactions}
            config={page.gift_activity_config}
          ></FundraiserGiftActivity>
        </div>
      </div>

      <BlockContentRenderer content={content} />
    </>
  );
});

const fetchFundraisers = groq`
{
  "pages": *[_type == "fundraiser_page"] {
    slug { current }
  }
}
`;

const fetchFundraiser = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    ${pageBannersContentQuery},
    donate_label,
    accent_color,
  },
  "page": *[_type == "fundraiser_page"  && slug.current == $slug][0] {
    ...,
    header_image { asset-> {
      _id,
      url,
    }},
    fundraiser_image { asset-> },
    fundraiser_organization -> {
      name,
      logo { asset-> },
      widget_button {
        cause_area_id,
        organization_id,
      },
      organization_page -> {
        slug { current }
      }
    },
    ${pageContentQuery}
    slug { current },
  },
}
`;
