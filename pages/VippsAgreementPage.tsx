import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { SEO } from "../components/shared/seo/Seo";
import { Navbar } from "../components/main/layout/navbar";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { linksContentQuery, useAnonymousVippsAgreement, widgetQuery } from "../_queries";
import { useAuth0 } from "@auth0/auth0-react";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import LinkButton from "../components/shared/components/EffektButton/LinkButton";
import { withStaticProps } from "../util/withStaticProps";
import { useRouterContext } from "../context/RouterContext";
import { getAppStaticProps } from "./_app.page";
import { AgreementDetails } from "../components/profile/shared/lists/agreementList/AgreementDetails";

export const getVippsAgreementPagePath = async () => {
  const result = await getClient(false).fetch<FetchVippsResult>(fetchVipps);
  const vipps = result.vipps?.[0];
  const slug = vipps?.agreement_page?.slug?.current;
  return slug?.split("/") || null;
};

export const VippsAgreement = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps();
  const result = await getClient(preview).fetch<FetchVippsResult>(fetchVipps);

  return {
    appStaticProps,
    preview: preview,
    data: {
      result: result,
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
  const dashboard = data.result.dashboard[0];
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
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/${page.slug.current}}`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} texts={dashboard} />
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
  dashboard: any[];
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
  "dashboard": *[_id == "dashboard"] {
    my_page_text,
    send_donation_text,
  },
  "settings": *[_type == "site_settings"] {
    logo,
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
  ${widgetQuery}
  ${footerQuery}
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
