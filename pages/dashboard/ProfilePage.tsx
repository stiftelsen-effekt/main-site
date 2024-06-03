import { groq } from "next-sanity";
import Head from "next/head";
import { useRouter } from "next/router";
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

export async function getProfilePagePath() {
  const result = await getClient().fetch<FetchProfilePageResult>(fetchProfilePage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const slug = result?.page?.slug?.current;

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}

export const ProfilePage = withStaticProps(
  async ({ draftMode = false }: { draftMode: boolean }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, layout: LayoutType.Profile });
    const result = await getClient(draftMode ? token : undefined).fetch<FetchProfilePageResult>(
      fetchProfilePage,
    );

    return {
      appStaticProps,
      draftMode,
      navbarData: await Navbar.getStaticProps({ dashboard: true, draftMode }),
      data: {
        result: result,
        query: fetchProfilePage,
        queryParams: {},
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, navbarData, draftMode }) => {
  const page = data.result.page;

  if (!data) return <div>Missing data.</div>;
  if (!page) return <div>Missing page data.</div>;
  if (!page.info_configuration) return <div>Missing info configuration.</div>;
  if (!page.title_template) return <div>Missing title template.</div>;

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
  settings: Array<{ title?: string }>;
  page: ProfilePage;
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
};

const fetchProfilePage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "profile"] {
    ...,
    slug {
      current
    },
  },
}
`;
