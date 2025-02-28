import { groq } from "next-sanity";
import { pageBannersContentQuery, pageContentQuery } from "../_queries";
import {
  BlockContentRenderer,
  SectionBlockContentRenderer,
} from "../components/main/blocks/BlockContentRenderer";
import { Navbar, NavLink, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBannerConfiguration } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.client";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";
import { stegaClean } from "@sanity/client/stega";
import { Generalbanner } from "../studio/sanity.types";
import { ConsentState } from "../middleware.page";
import { FundraiserHeader } from "../components/main/layout/FundraiserHeader/FundraiserHeader";
import styles from "../styles/Fundraisers.module.css";
import { FundraiserProgressBar } from "../components/main/blocks/FundraiserProgressBar/FundraiserProgressBar";
import { FundraiserGiftActivity } from "../components/main/blocks/FundraiserGiftActivity/FundraiserGiftActivity";
import FundraiserWidget from "../components/main/blocks/FundraiserWidget/FundraiserWidget";

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

    /** Will fetch data from API later */
    let fakeDonations = [
      {
        // Random amount rounded to nearest 100 between 0 and 1000
        amount: Math.round(Math.random() * 10) * 100,
        name: "John Doe",
        message: "Great cause!",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "Jane Doe",
        message: "I love this organization",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "John Smith",
        message: "Keep up the good work!",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "Jane Smith",
        message: "I'm so happy to donate",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "John Johnson",
        message: "I'm so happy to donate",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "Jane Johnson",
        message: "I'm so happy to donate",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "John Jackson",
        message: "I'm so happy to donate",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "Jane Jackson",
        message: "I'm so happy to donate",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "John Brown",
        message: "I'm so happy to donate",
      },
      {
        amount: Math.round(Math.random() * 10) * 100,
        name: "Jane Brown",
        message: "I'm so happy to donate",
      },
    ];
    // Duplicate the array 20 times
    fakeDonations = Array(30).fill(fakeDonations).flat();

    const fakeFundraiserDataResponse = {
      currentAmount: fakeDonations.reduce((acc, donation) => acc + donation.amount, 0),
      donations: fakeDonations,
    };

    let result = await getClient(draftMode ? token : undefined).fetch<{
      page: any;
      settings: {
        title: string;
        cookie_banner_configuration: CookieBannerConfiguration;
        general_banner: Generalbanner & { link: NavLink };
        donate_label: string;
        accent_color?: string;
      }[];
    }>(fetchFundraiser, { slug });

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
      fundraiserData: fakeFundraiserDataResponse,
    } satisfies GeneralPageProps;
  },
)(({ data, fundraiserData, navbar, draftMode }) => {
  const { fundraisersPath } = useRouterContext();
  const page = data.result.page;

  if (!page) {
    return <div>404{draftMode ? " - Attempting to load preview" : null}</div>;
  }

  const content = page.content;

  return (
    <>
      <SEO
        title={page.title}
        titleTemplate={`%s | ${data.result.settings[0].title}`}
        description={""} // TODO
        imageAsset={page.headerImage ? page.headerImage.asset : undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${[
          ...fundraisersPath,
          page.slug.current,
        ].join("/")}`}
        keywords={""} // TODO
        siteName={data.result.settings[0].title}
      />

      <MainHeader
        hideOnScroll={true}
        alwaysShrink={true}
        cookieBannerConfig={data.result.settings[0].cookie_banner_configuration}
        generalBannerConfig={data.result.settings[0].general_banner}
      >
        {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
      </MainHeader>

      <FundraiserHeader
        headerImage={page.header_image}
        fundraiserImage={page.fundraiser_image}
      ></FundraiserHeader>

      <h3 className={styles.mobiletitle}>{page.title}</h3>
      <div className={styles.fundraisercontainer}>
        <div className={styles.fundraiserdescription}>
          <h3>{page.title}</h3>
          <SectionBlockContentRenderer blocks={page.description} />
        </div>

        <div className={styles.fundraiserdata}>
          <FundraiserProgressBar
            config={page.fundraiser_goal_config}
            currentAmount={fundraiserData.currentAmount}
          ></FundraiserProgressBar>

          <FundraiserWidget
            organizationInfo={{
              name: page.fundraiser_organization.name,
              logo: page.fundraiser_organization.logo,
              textTemplate: page.fundraiser_organization_text_template,
              organizationSlug: page.fundraiser_organization.organization_page.slug.current,
            }}
          ></FundraiserWidget>

          <FundraiserGiftActivity
            donations={fundraiserData.donations}
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
    accent_color
  },
  "page": *[_type == "fundraiser_page"  && slug.current == $slug][0] {
    ...,
    header_image { asset-> {
      _id,
    }},
    fundraiser_image { asset-> },
    fundraiser_organization -> {
      name,
      logo { asset-> },
      organization_page -> {
        slug { current }
      }
    },
    ${pageContentQuery}
    slug { current },
  },
}
`;
