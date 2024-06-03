import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { fetchRouterContext } from "../context/RouterContext";
import ArticlePage, { getArticlePaths } from "./ArticlePage";
import { GenericPage, getGenericPagePaths } from "./GenericPage";
import { getAppStaticProps } from "./_app.page";
import { ArticlesPage } from "./ArticlesPage";
import VippsAgreementPage, { getVippsAgreementPagePath } from "./VippsAgreementPage";
import { DonationsPage, getDonationsPageSubpaths } from "./dashboard/DonationsPage";
import { AgreementsPage } from "./dashboard/AgreementsPage";
import { ProfilePage } from "./dashboard/ProfilePage";
import { TaxPage, getTaxPageSubPaths } from "./dashboard/TaxPage";
import { VippsAnonymousPage } from "./dashboard/VippsAnonymousPage";
import { ResultsPage } from "./ResultsPage";
import { useLiveQuery } from "next-sanity/preview";
import { useIsEnabled } from "@sanity/preview-kit";

enum PageType {
  GenericPage = "generic",
  ArticlesPage = "articles",
  ResultsPage = "results",
  ArticlePage = "article",
  VippsAgreementPage = "vipps-agreement",
  VippsAnonymousPage = "vipps-anonymous",
  AgreementsPage = "agreements",
  DonationsPage = "donations",
  ProfilePage = "profile",
  TaxPage = "tax",
}

const Page: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  if (props.appStaticProps?.layoutProps?.draftMode || true) {
    if (props.pageType === PageType.GenericPage) {
      return <PreviewGenericPage {...props} />;
    }
  }

  switch (props.pageType as PageType) {
    case PageType.GenericPage:
      return <GenericPage {...(props as any)} />;
    case PageType.ArticlesPage:
      return <ArticlesPage {...props} />;
    case PageType.ArticlePage:
      return <ArticlePage {...(props as any)} />;
    case PageType.ResultsPage:
      return <ResultsPage {...(props as any)} />;
    case PageType.VippsAgreementPage:
      return <VippsAgreementPage {...(props as any)} />;
    case PageType.AgreementsPage:
      return <AgreementsPage {...(props as any)} />;
    case PageType.VippsAnonymousPage:
      return <VippsAnonymousPage {...(props as any)} />;
    case PageType.DonationsPage:
      return <DonationsPage {...(props as any)} />;
    case PageType.ProfilePage:
      return <ProfilePage {...(props as any)} />;
    case PageType.TaxPage:
      return <TaxPage {...(props as any)} />;
  }
};

const PreviewGenericPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query, { ...props.data.queryParams });

  if (result) {
    props.data.result = result;
  }

  return <GenericPage {...(props as any)} />;
};

function compareArrays<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const inferPageTypeFromPath = async (path: string[]) => {
  const {
    articlesPagePath,
    resultsPagePath,
    vippsAgreementPagePath,
    dashboardPath,
    agreementsPagePath,
    taxPagePath,
    profilePagePath,
    vippsAnonymousPagePath,
  } = await fetchRouterContext();

  const isVippsAgreementPage =
    vippsAgreementPagePath &&
    compareArrays(path.slice(0, vippsAgreementPagePath.length), vippsAgreementPagePath);
  if (isVippsAgreementPage) return PageType.VippsAgreementPage;

  const isArticle =
    compareArrays(path.slice(0, articlesPagePath.length), articlesPagePath) &&
    path.length > articlesPagePath.length;
  if (isArticle) return PageType.ArticlePage;

  const isArticlesPage = compareArrays(path.slice(0, articlesPagePath.length), articlesPagePath);
  if (isArticlesPage) return PageType.ArticlesPage;

  const isResultsPage = compareArrays(path.slice(0, resultsPagePath.length), resultsPagePath);
  if (isResultsPage) return PageType.ResultsPage;

  const isDashboard = dashboardPath
    ? compareArrays(path.slice(0, dashboardPath.length), dashboardPath)
    : false;

  if (isDashboard) {
    const isAgreementsPage = agreementsPagePath
      ? compareArrays(path.slice(0, agreementsPagePath.length), agreementsPagePath)
      : false;
    if (isAgreementsPage) return PageType.AgreementsPage;

    const isVippsAnonymousPage = vippsAnonymousPagePath
      ? compareArrays(path.slice(0, vippsAnonymousPagePath.length), vippsAnonymousPagePath)
      : false;
    if (isVippsAnonymousPage) return PageType.VippsAnonymousPage;

    const isTaxPage = taxPagePath
      ? compareArrays(path.slice(0, taxPagePath.length), taxPagePath)
      : false;
    if (isTaxPage) return PageType.TaxPage;

    const isProfilePage = profilePagePath
      ? compareArrays(path.slice(0, profilePagePath.length), profilePagePath)
      : false;
    if (isProfilePage) return PageType.ProfilePage;

    return PageType.DonationsPage;
  }
  return PageType.GenericPage;
};

export const getStaticProps = async ({
  draftMode = false,
  params,
}: GetStaticPropsContext<{ slug: string[] }>) => {
  const path = params?.slug ?? [];

  const pageType = await inferPageTypeFromPath(path);

  switch (pageType) {
    case PageType.GenericPage: {
      const props = await GenericPage.getStaticProps({ draftMode, path });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlesPage: {
      const props = await ArticlesPage.getStaticProps({ draftMode });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlePage: {
      const slug = path.slice(1).join("/");
      const props = await ArticlePage.getStaticProps({ draftMode, slug });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ResultsPage: {
      const props = await ResultsPage.getStaticProps({ draftMode });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.VippsAgreementPage: {
      const props = await VippsAgreementPage.getStaticProps({ draftMode });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.VippsAnonymousPage: {
      const props = await VippsAnonymousPage.getStaticProps({ draftMode });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.DonationsPage: {
      const props = await DonationsPage.getStaticProps({ draftMode, path });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.AgreementsPage: {
      const props = await AgreementsPage.getStaticProps({ draftMode });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ProfilePage: {
      const props = await ProfilePage.getStaticProps({ draftMode });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.TaxPage: {
      const props = await TaxPage.getStaticProps({ draftMode, path });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
  }
};

export async function getStaticPaths() {
  const routerContext = await fetchRouterContext();

  const paths = await Promise.all([
    getGenericPagePaths(),
    getArticlePaths(routerContext.articlesPagePath),
    getDonationsPageSubpaths(),
    getTaxPageSubPaths(),
  ]).then(([genericPagePaths, articlePaths, donationsPageSubpaths, taxPageSubPaths]) => [
    ...genericPagePaths,
    ...articlePaths,
    ...donationsPageSubpaths,
    ...taxPageSubPaths,
    ...(Object.values(routerContext).filter((path) => path !== null) as string[][]),
  ]);

  return {
    paths: paths.map((path) => {
      return {
        params: { slug: path },
      };
    }),
    fallback: false,
  };
}

export default Page;
