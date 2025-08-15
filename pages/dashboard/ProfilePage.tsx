import { groq } from "next-sanity";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { DataInfo } from "../../components/profile/details/DataInfo/DataInfo";
import {
  ProfileInfo,
  ProfilePageInfoConfiguration,
} from "../../components/profile/details/ProfileInfo/ProfileInfo";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { getClient } from "../../lib/sanity.client";
import style from "../../styles/Profile.module.css";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";
import { Navbar } from "../../components/shared/components/Navbar/Navbar";
import { token } from "../../token";
import { ConsentState } from "../../middleware.page";

export async function getProfilePagePath() {
  const result = await getClient().fetch<FetchProfilePageResult>(fetchProfilePage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const slug = result?.page?.slug?.current;
  const profilePageEnabled = result?.settings?.[0]?.profile_page_enabled;

  if (!dashboardSlug || !slug || !profilePageEnabled) return null;

  return [dashboardSlug, slug];
}

export const ProfilePage = withStaticProps(
  async ({
    draftMode = false,
    consentState,
  }: {
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({
      draftMode,
      consentState,
      layout: LayoutType.Profile,
    });
    const result = await getClient(draftMode ? token : undefined).fetch<FetchProfilePageResult>(
      fetchProfilePage,
    );

    const profilePageEnabled = result?.settings?.[0]?.profile_page_enabled;

    // If profile page is disabled and not in draft mode, return null to trigger 404
    if (!profilePageEnabled && !draftMode) {
      return null;
    }

    return {
      appStaticProps,
      draftMode,
      profilePageEnabled,
      navbarData: await Navbar.getStaticProps({ dashboard: true, draftMode }),
      data: {
        result: result,
        query: fetchProfilePage,
        queryParams: {},
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, navbarData, draftMode, profilePageEnabled }) => {
  const page = data.result.page;
  const settings = data.result.settings[0];

  if (!data) return <div>Missing data.</div>;
  if (!page) return <div>Missing page data.</div>;
  if (!page.info_configuration) return <div>Missing info configuration.</div>;
  if (!page.title_template) return <div>Missing title template.</div>;

  // Show warning in draft mode when profile page is disabled
  if (draftMode && !settings?.profile_page_enabled) {
    return (
      <>
        <Head>
          <title>{settings?.title} | Profil (Disabled)</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainHeader hideOnScroll={false}>
          <Navbar {...navbarData} />
        </MainHeader>
        <PageContent>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#ffebcc",
              border: "1px solid #ff9900",
              margin: "20px",
              borderRadius: "5px",
            }}
          >
            <h2>⚠️ Profile Page Disabled</h2>
            <p>
              The profile page is currently disabled in the site settings. This page is only visible
              in draft mode.
            </p>
            <p>
              To enable the profile page, go to Site Settings in Sanity Studio and enable
              &quot;Profile page enabled&quot;.
            </p>
          </div>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{data.result.settings[0].title} | Profil</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar {...navbarData} />
      </MainHeader>

      <PageContent>
        <div className={style.gridContainer}>
          <ProfileInfo config={page.info_configuration} titleTemplate={page.title_template} />
          <DataInfo page={page} />
        </div>
      </PageContent>
    </>
  );
});

export type ProfilePage = {
  slug?: { current?: string };
  title_template?: string;
  info_configuration?: ProfilePageInfoConfiguration;
  info_title?: string;
  tax_subtitle?: string;
  tax?: any;
  tax_link?: string;
  data_subtitle?: string;
  data?: any;
  data_link?: string;
  read_more_label?: string;
};

type FetchProfilePageResult = {
  settings: Array<{ title?: string; profile_page_enabled?: boolean }>;
  page: ProfilePage;
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
};

const fetchProfilePage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    profile_page_enabled,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "profile"][0] {
    ...,
    slug {
      current
    },
  },
}
`;
