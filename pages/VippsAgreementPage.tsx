import { groq } from "next-sanity";
import { linksContentQuery, pageBannersContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import LinkButton from "../components/shared/components/EffektButton/LinkButton";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.client";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";
import { ConsentState } from "../middleware.page";
import { CookieBannerQueryResult, GeneralBannerQueryResult } from "../studio/sanity.types";

export const getVippsAgreementPagePath = async () => {
  const result = await getClient().fetch<FetchVippsResult>(fetchVipps);
  const vipps = result.vipps?.[0];
  const slug = vipps?.agreement_page?.slug?.current;
  return slug?.split("/") || null;
};

export const VippsAgreementPage = withStaticProps(
  async ({
    draftMode = false,
    consentState,
  }: {
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, consentState });
    const result = await getClient(draftMode ? token : undefined).fetch<FetchVippsResult>(
      fetchVipps,
    );

    return {
      appStaticProps,
      draftMode: draftMode,
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      data: {
        result,
        query: fetchVipps,
        queryParams: {},
      },
    } satisfies GeneralPageProps;
  },
)(({ data, draftMode, navbar }) => {
  const { dashboardPath } = useRouterContext();
  const page = data.result.vipps?.[0].agreement_page;

  if (!page) {
    return <div>404{draftMode ? " - Attempting to load preview" : null}</div>;
  }

  const header = page.header;

  let email;
  if (typeof window !== "undefined") {
    let urlParams = new URLSearchParams(window.location.search);
    email = urlParams.get("email");
  }

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAssetUrl={header.seoImage?.url ? header.seoImage.asset.url : undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug.current}}`}
        titleTemplate={`${data.result.settings[0].title} | %s`}
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <MainHeader
        hideOnScroll={true}
        cookieBannerConfig={data.result.settings[0].cookie_banner_configuration}
        generalBannerConfig={data.result.settings[0].general_banner}
      >
        {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
      </MainHeader>

      <SectionContainer>
        <h2 style={{ marginTop: "10vh" }}>{header.title}</h2>
        <p className="inngress" style={{ maxWidth: 740, textAlign: "center" }}>
          {header.inngress}
        </p>
        <p style={{ maxWidth: 740, width: "100%", textAlign: "center" }}>
          Registrer en bruker med eposten knyttet til din avtale, {email}.<br /> Har du alt
          registrert en bruker kan du logge inn.
        </p>
        <div style={{ marginTop: 20 }}>
          <LinkButton
            title={"Registrer bruker"}
            type={"primary"}
            url={`/${dashboardPath.join("/")}?screen_hint=signup&prompt=login`}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <LinkButton title={"Logg inn"} type={"primary"} url={`/${dashboardPath.join("/")}`} />
        </div>
      </SectionContainer>
      <BlockContentRenderer content={page.content} />
    </>
  );
});

type FetchVippsResult = {
  settings: Array<{
    title: string;
    cookie_banner_configuration: CookieBannerQueryResult;
    general_banner: GeneralBannerQueryResult;
  }>;
  vipps?: Array<{
    agreement_page: Record<string, any> & {
      slug: {
        current: string;
      };
    };
  }>;
};

const fetchVipps = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    ${pageBannersContentQuery}
  },
  "vipps": *[_id == "vipps"] {
    agreement_page->{
      slug {
        current
      },
      header {
        ...,
        seoImage{
          asset->
        },
        ${linksContentQuery}
      },
      content,
    }
  }
}
`;
