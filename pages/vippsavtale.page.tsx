import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { SEO } from "../components/shared/seo/Seo";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { linksContentQuery, widgetQuery } from "../_queries";
import { filterPageToSingleItem, getAppStaticProps } from "./_app.page";
import { Paragraph } from "../components/main/blocks/Paragraph/Paragraph";
import {
  EffektButton,
  EffektButtonType,
} from "../components/shared/components/EffektButton/EffektButton";
import { useAuth0 } from "@auth0/auth0-react";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import LinkButton from "../components/shared/components/EffektButton/LinkButton";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

const VippsAgreement: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
  preview,
}) => {
  const { loginWithRedirect } = useAuth0();

  const page = data.result.page;

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
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/vippsavtale`}
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
            url={`/min-side?screen_hint=signup&prompt=login`}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <LinkButton title={"Logg inn"} type={"primary"} url={`/min-side`} />
        </div>
      </SectionContainer>
      <BlockContentRenderer content={page.content} />
    </>
  );
};

export const getStaticProps = async ({
  preview = false,
  params,
}: GetStaticPropsContext<{ slug: string[] }>) => {
  const appStaticProps = await getAppStaticProps({
    filterPage: true,
  });
  let result = await getClient(preview).fetch(fetchVippsAgreementPage);
  result = { ...result, page: filterPageToSingleItem(result, preview) };

  return {
    props: {
      appStaticProps,
      preview: preview,
      data: {
        result: result,
        query: fetchVippsAgreementPage,
        queryParams: {},
      },
    },
  };
};

const fetchVippsAgreementPage = groq`
{
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
  "page": *[_type == "vippsagreement"] {
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
`;

export default VippsAgreement;
