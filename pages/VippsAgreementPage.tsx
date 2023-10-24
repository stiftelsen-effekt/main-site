import { groq } from "next-sanity";
import { linksContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar } from "../components/main/layout/navbar";
import LinkButton from "../components/shared/components/EffektButton/LinkButton";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.server";
import { withStaticProps } from "../util/withStaticProps";
import { getAppStaticProps } from "./_app.page";

export const getVippsAgreementPagePath = async () => {
  const result = await getClient(false).fetch<FetchVippsResult>(fetchVipps);
  const vipps = result.vipps?.[0];
  const slug = vipps?.agreement_page?.slug?.current;
  return slug?.split("/") || null;
};

export const VippsAgreement = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps({ preview });
  const result = await getClient(preview).fetch<FetchVippsResult>(fetchVipps);

  return {
    appStaticProps,
    preview: preview,
    data: {
      result,
      query: fetchVipps,
      queryParams: {},
    },
  };
})(({ data, preview }) => {
  const { dashboardPath } = useRouterContext();
  const page = data.result.vipps?.[0].agreement_page;

  if (!page) {
    return <div>404{preview ? " - Attempting to load preview" : null}</div>;
  }

  const settings = data.result.settings[0];
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
        titleTemplate={`${settings.title} | %s`}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/${page.slug.current}}`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
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
  settings: any[];
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
    logo,
    title,
    main_navigation[] {
      _type == 'navgroup' => {
        _type,
        _key,
        title,
        items[]->{
          title,
          "slug": page->slug.current
        },
      },
      _type != 'navgroup' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
    }
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

export default VippsAgreement;
