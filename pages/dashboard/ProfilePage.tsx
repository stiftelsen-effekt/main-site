import { groq } from "next-sanity";
import Head from "next/head";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { DataInfo } from "../../components/profile/details/DataInfo/DataInfo";
import { ProfileInfo } from "../../components/profile/details/ProfileInfo/ProfileInfo";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { getClient } from "../../lib/sanity.server";
import style from "../../styles/Profile.module.css";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";
import { Navbar } from "../../components/shared/components/Navbar/Navbar";

export async function getProfilePagePath() {
  const result = await getClient(false).fetch<FetchProfilePageResult>(fetchProfilePage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const slug = result?.page?.[0]?.slug?.current;

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}

export const ProfilePage = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps({ preview, layout: LayoutType.Profile });
  const result = await getClient(preview).fetch<FetchProfilePageResult>(fetchProfilePage);

  return {
    appStaticProps,
    preview: preview,
    navbarData: await Navbar.getStaticProps({ dashboard: true, preview }),
    data: {
      result: result,
      query: fetchProfilePage,
      queryParams: {},
    },
  }; // satisfies GeneralPageProps (requires next@13);;
})(({ data, navbarData, preview }) => {
  const router = useRouter();

  if (!router.isFallback && !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{data.result.settings[0].title} | Profil</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar {...navbarData} />
      </MainHeader>

      <PageContent>
        <div className={style.gridContainer}>
          <ProfileInfo />
          <DataInfo page={data.result.page} />
        </div>
      </PageContent>
    </>
  );
});

type FetchProfilePageResult = {
  settings: Array<{ title?: string }>;
  page: Array<{ slug?: { current?: string }; tax?: any; data?: any }>;
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
    slug {
      current
    },
    tax,
    data
  },
}
`;
