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
import { FetchFundraiserResult } from "../studio/sanity.types";
import { ConsentState } from "../middleware.page";
import { FundraiserHeader } from "../components/main/layout/FundraiserHeader/FundraiserHeader";
import styles from "../styles/Fundraisers.module.css";
import { FundraiserProgressBar } from "../components/main/blocks/FundraiserProgressBar/FundraiserProgressBar";
import { FundraiserGiftActivity } from "../components/main/blocks/FundraiserGiftActivity/FundraiserGiftActivity";
import { FundraiserWidget } from "../components/main/blocks/FundraiserWidget/FundraiserWidget";
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

    const fundraiserData: {
      totalSum: number;
      donationCount: number;
      transactions: {
        name: string | null;
        message: string | null;
        amount: number;
        date: string;
      }[];
    } = await fetch(`${API_URL}/fundraisers/${fundraiserId}`)
      .then((res) => res.json())
      .then((data) => data.content);

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
      fundraiserData,
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
        crop: image.crop || undefined,
        hotspot: image.hotspot || undefined,
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

  const content = page.content;

  return (
    <>
      <SEO
        title={page.title || data.result.settings[0].title || ""}
        titleTemplate={`%s | ${data.result.settings[0].title}`}
        description={""} // TODO
        imageAssetUrl={page.header_image ? page.header_image.asset?.url : undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${[
          ...fundraisersPath,
          page.slug ? page.slug.current : "",
        ].join("/")}`}
        keywords={""} // TODO
        siteName={data.result.settings[0].title || ""}
      />

      <MainHeader
        hideOnScroll={true}
        alwaysShrink={true}
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
            currentAmount={
              fundraiserData.totalSum +
              (page.fundraiser_goal_config?.additional_external_contributions ?? 0)
            }
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
    header_image { 
      crop,
      hotspot,
      asset-> {
        _id,
        url,
        metadata {
          lqip
        }
      }
    },
    fundraiser_image { 
      crop,
      hotspot,
      asset-> {
        _id,
        url,
        metadata {
          lqip
        }
      }
    },
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
