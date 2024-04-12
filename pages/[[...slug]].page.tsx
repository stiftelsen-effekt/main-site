import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import { fetchRouterContext } from "../context/RouterContext";
import { getArticlePaths } from "./ArticlePage";
import { getDonationsPageSubpaths } from "./dashboard/DonationsPage";
import { getTaxPageSubPaths } from "./dashboard/TaxPage";
import { getGenericPagePaths } from "./GenericPage";

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
  switch (props.pageType) {
    case PageType.GenericPage:
      const GenericPage = dynamic(() => import("./GenericPage").then((mod) => mod.GenericPage));
      return <GenericPage {...props} />;
    case PageType.ArticlesPage:
      const ArticlesPage = dynamic(() => import("./ArticlesPage").then((mod) => mod.ArticlesPage));
      return <ArticlesPage {...props} />;
    case PageType.ArticlePage:
      const ArticlePage = dynamic(() => import("./ArticlePage").then((mod) => mod.ArticlePage));
      return <ArticlePage {...props} />;
    case PageType.ResultsPage:
      const ResultsPage = dynamic(() => import("./ResultsPage").then((mod) => mod.ResultsPage));
      return <ResultsPage {...props} />;
    case PageType.VippsAgreementPage:
      const VippsAgreementPage = dynamic(() => import("./VippsAgreementPage"));
      return <VippsAgreementPage {...props} />;
    case PageType.AgreementsPage:
      const AgreementsPage = dynamic(() =>
        import("./dashboard/AgreementsPage").then((mod) => mod.AgreementsPage),
      );
      return <AgreementsPage {...props} />;
    case PageType.VippsAnonymousPage:
      const VippsAnonymousPage = dynamic(() =>
        import("./dashboard/VippsAnonymousPage").then((mod) => mod.VippsAnonymousPage),
      );
      return <VippsAnonymousPage {...props} />;
    case PageType.DonationsPage:
      const DonationsPage = dynamic(() =>
        import("./dashboard/DonationsPage").then((mod) => mod.DonationsPage),
      );
      return <DonationsPage {...props} />;
    case PageType.ProfilePage:
      const ProfilePage = dynamic(() =>
        import("./dashboard/ProfilePage").then((mod) => mod.ProfilePage),
      );
      return <ProfilePage {...props} />;
    case PageType.TaxPage:
      const TaxPage = dynamic(() => import("./dashboard/TaxPage").then((mod) => mod.TaxPage));
      return <TaxPage {...props} />;
  }
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
  preview = false,
  params,
}: GetStaticPropsContext<{ slug: string[] }>) => {
  const path = params?.slug ?? [];

  const pageType = await inferPageTypeFromPath(path);

  switch (pageType) {
    case PageType.GenericPage: {
      const GenericPage = await import("./GenericPage").then((mod) => mod.GenericPage);
      const props = await GenericPage.getStaticProps({ preview, path });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlesPage: {
      const ArticlesPage = await import("./ArticlesPage").then((mod) => mod.ArticlesPage);
      const props = await ArticlesPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlePage: {
      const slug = path.slice(1).join("/");
      const ArticlePage = await import("./ArticlePage").then((mod) => mod.default);
      const props = await ArticlePage.getStaticProps({ preview, slug });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ResultsPage: {
      const ResultsPage = await import("./ResultsPage").then((mod) => mod.ResultsPage);
      const props = await ResultsPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.VippsAgreementPage: {
      const VippsAgreementPage = await import("./VippsAgreementPage").then((mod) => mod.default);
      const props = await VippsAgreementPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.VippsAnonymousPage: {
      const VippsAnonymousPage = await import("./dashboard/VippsAnonymousPage").then(
        (mod) => mod.VippsAnonymousPage,
      );
      const props = await VippsAnonymousPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.DonationsPage: {
      const DonationsPage = await import("./dashboard/DonationsPage").then(
        (mod) => mod.DonationsPage,
      );
      const props = await DonationsPage.getStaticProps({ preview, path });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.AgreementsPage: {
      const AgreementsPage = await import("./dashboard/AgreementsPage").then(
        (mod) => mod.AgreementsPage,
      );
      const props = await AgreementsPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ProfilePage: {
      const ProfilePage = await import("./dashboard/ProfilePage").then((mod) => mod.ProfilePage);
      const props = await ProfilePage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.TaxPage: {
      const TaxPage = await import("./dashboard/TaxPage").then((mod) => mod.TaxPage);
      const props = await TaxPage.getStaticProps({ preview, path });
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
