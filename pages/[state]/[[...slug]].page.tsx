import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { fetchRouterContext } from "../../context/RouterContext";
import { ArticlePage, getArticlePaths } from "../ArticlePage";
import { GenericPage, getGenericPagePaths } from "../GenericPage";
import { ArticlesPage } from "../ArticlesPage";
import { VippsAgreementPage } from "../VippsAgreementPage";
import { DonationsPage, getDonationsPageSubpaths } from "../dashboard/DonationsPage";
import { AgreementsPage } from "../dashboard/AgreementsPage";
import { ProfilePage } from "../dashboard/ProfilePage";
import { TaxPage, getTaxPageSubPaths } from "../dashboard/TaxPage";
import { VippsAnonymousPage } from "../dashboard/VippsAnonymousPage";
import { ResultsPage } from "../ResultsPage";
import { useLiveQuery } from "next-sanity/preview";
import { ConsentState } from "../../middleware.page";
import NotFoundPage from "../404.page";
import { FundraiserPage, getFundraiserPagePaths } from "../FundraiserPage";

enum PageType {
  GenericPage = "generic",
  ArticlesPage = "articles",
  ResultsPage = "results",
  ArticlePage = "article",
  FundraiserPage = "fundraiser",
  VippsAgreementPage = "vipps-agreement",
  VippsAnonymousPage = "vipps-anonymous",
  AgreementsPage = "agreements",
  DonationsPage = "donations",
  ProfilePage = "profile",
  TaxPage = "tax",
}

const Page: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  if (props.appStaticProps?.layoutProps?.draftMode || true) {
    switch (props.pageType as PageType) {
      case PageType.GenericPage:
        return <PreviewGenericPage {...(props as any)} />;
      case PageType.ArticlesPage:
        return <PreviewArticlesPage {...(props as any)} />;
      case PageType.ArticlePage:
        return <PreviewArticlePage {...(props as any)} />;
      case PageType.ResultsPage:
        return <PreviewResultsPage {...(props as any)} />;
      case PageType.FundraiserPage:
        return <PreviewFundraiserPage {...(props as any)} />;
    }
  }

  switch (props.pageType as PageType) {
    case PageType.GenericPage:
      return <GenericPage {...(props as any)} />;
    case PageType.ArticlesPage:
      return <ArticlesPage {...(props as any)} />;
    case PageType.ArticlePage:
      return <ArticlePage {...(props as any)} />;
    case PageType.ResultsPage:
      return <ResultsPage {...(props as any)} />;
    case PageType.FundraiserPage:
      return <FundraiserPage {...(props as any)} />;
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

const PreviewArticlesPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query, { ...props.data.queryParams });

  if (result) {
    props.data.result = result;
  }

  return <ArticlesPage {...(props as any)} />;
};

const PreviewArticlePage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query, { ...props.data.queryParams });

  if (result) {
    props.data.result = result;
  }

  return <ArticlePage {...(props as any)} />;
};

const PreviewResultsPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query, { ...props.data.queryParams });

  if (result) {
    props.data.result = result;
  }

  return <ResultsPage {...(props as any)} />;
};

const PreviewFundraiserPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query, { ...props.data.queryParams });

  if (result) {
    props.data.result = result;
  }

  return <FundraiserPage {...(props as any)} />;
};

function compareArrays<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const inferPageTypeFromPath = async (path: string[]) => {
  const {
    articlesPagePath,
    fundraisersPath,
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

  const isFundraiser =
    compareArrays(path.slice(0, fundraisersPath.length), fundraisersPath) &&
    path.length > fundraisersPath.length;
  if (isFundraiser) return PageType.FundraiserPage;

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

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{
    slug: string[];
    state: ConsentState;
  }>,
) => {
  const path = ctx.params?.slug ?? [];
  const draftMode = ctx.draftMode ?? false;
  const consentState = ctx.params?.state ?? "undecided";

  const pageType = await inferPageTypeFromPath(path);

  switch (pageType) {
    case PageType.GenericPage: {
      const props = await GenericPage.getStaticProps({ draftMode, consentState, path });
      if (!props.data.result.page && !draftMode) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.ArticlesPage: {
      const props = await ArticlesPage.getStaticProps({ draftMode, consentState });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.ArticlePage: {
      const slug = path.slice(1).join("/");
      const props = await ArticlePage.getStaticProps({ draftMode, consentState, slug });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.FundraiserPage: {
      const slug = path.slice(1).join("/");
      const props = await FundraiserPage.getStaticProps({ draftMode, consentState, slug });
      if (!props.data.result.page && !draftMode) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.ResultsPage: {
      const props = await ResultsPage.getStaticProps({ draftMode, consentState });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.VippsAgreementPage: {
      const props = await VippsAgreementPage.getStaticProps({ draftMode, consentState });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.VippsAnonymousPage: {
      const props = await VippsAnonymousPage.getStaticProps({ draftMode, consentState });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.DonationsPage: {
      const props = await DonationsPage.getStaticProps({ draftMode, consentState, path });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.AgreementsPage: {
      const props = await AgreementsPage.getStaticProps({ draftMode, consentState, slug: path });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.ProfilePage: {
      const props = await ProfilePage.getStaticProps({ draftMode, consentState });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
    case PageType.TaxPage: {
      const props = await TaxPage.getStaticProps({ draftMode, path, consentState });
      return {
        props: {
          ...props,
          pageType,
          consentState,
        },
        revalidate: draftMode ? 1 : 3600,
      } as const;
    }
  }
};

export async function getStaticPaths() {
  const routerContext = await fetchRouterContext();

  const basePaths = await Promise.all([
    getGenericPagePaths(),
    getArticlePaths(routerContext.articlesPagePath),
    getFundraiserPagePaths(routerContext.fundraisersPath),
    getDonationsPageSubpaths(),
    getTaxPageSubPaths(),
  ]).then(([genericPagePaths, articlePaths, donationsPageSubpaths, taxPageSubPaths]) => [
    ...genericPagePaths,
    ...articlePaths,
    ...donationsPageSubpaths,
    ...taxPageSubPaths,
    ...(Object.values(routerContext).filter((path) => path !== null) as string[][]),
  ]);

  const consentStates: ConsentState[] = ["accepted", "rejected", "undecided"];

  return {
    paths: basePaths.flatMap((path) =>
      consentStates.map((state) => ({
        params: {
          slug: path,
          state,
        },
      })),
    ),
    fallback: "blocking",
  };
}

export default Page;
