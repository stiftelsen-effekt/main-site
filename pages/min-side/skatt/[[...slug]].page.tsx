import Head from "next/head";
import style from "../../../styles/Tax.module.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getClient } from "../../../lib/sanity.server";
import { groq } from "next-sanity";
import { PageContent } from "../../../components/profile/layout/PageContent/PageContent";
import { Navbar } from "../../../components/profile/layout/navbar";
import { footerQuery } from "../../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../../components/shared/layout/Header/Header";
import { FacebookTaxWidget } from "../../../components/profile/tax/FacebookTaxWidget/FacebookTaxWidget";
import { useContext, useState } from "react";
import { DonorContext } from "../../../components/profile/layout/donorProvider";
import { PortableText } from "../../../lib/sanity";
import Link from "next/link";
import { widgetQuery } from "../../../_queries";
import TaxMenu, { TaxMenuChoices } from "../../../components/profile/tax/TaxMenu/TaxMenu";
import { FacebookTab } from "../../../components/profile/tax/FacebookTab/FacebookTab";
import { TaxDeductionsTab } from "../../../components/profile/tax/TaxDeductionsTab/TaxDeductionsTab";
import { TaxUnitsTab } from "../../../components/profile/tax/TaxUnitsTab/TaxUnitsTab";
import { YearlyReportsTab } from "../../../components/profile/tax/YearlyReportsTab/YearlyReportsTab";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { LayoutType, getAppStaticProps } from "../../_app.page";

const Page: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ data, preview }) => {
  const router = useRouter();
  const settings = data.result.settings[0];
  const page = data.result.page[0];
  const { donor } = useContext(DonorContext);

  if ((!router.isFallback && !data) || !donor) {
    return <div>Loading...</div>;
  }
  let menuChoice = TaxMenuChoices.TAX_UNITS;

  let slug = router.query.slug ? router.query.slug[0] : "";
  switch (slug) {
    case TaxMenuChoices.ABOUT_TAX_DEDUCTIONS:
      menuChoice = TaxMenuChoices.ABOUT_TAX_DEDUCTIONS;
      break;
    case TaxMenuChoices.FACEBOOK_DONATIONS:
      menuChoice = TaxMenuChoices.FACEBOOK_DONATIONS;
      break;
    case TaxMenuChoices.YEARLY_REPORTS:
      menuChoice = TaxMenuChoices.YEARLY_REPORTS;
  }

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Skatt</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} />
        <TaxMenu
          mobile
          selected={menuChoice}
          onChange={(selected) => router.push("/min-side/skatt/" + selected)}
        ></TaxMenu>
      </MainHeader>

      <PageContent>
        <div className={style.container}>
          <h3 className={style.header}>Skatt</h3>

          <TaxMenu
            selected={menuChoice}
            onChange={(selected) => router.push("/min-side/skatt/" + selected)}
          ></TaxMenu>

          {menuChoice == TaxMenuChoices.TAX_UNITS && <TaxUnitsTab />}

          {menuChoice == TaxMenuChoices.YEARLY_REPORTS && <YearlyReportsTab />}

          {menuChoice == TaxMenuChoices.FACEBOOK_DONATIONS && (
            <FacebookTab
              donor={donor}
              description={page.facebook_description}
              links={page.facebook_description_links ? page.facebook_description_links.links : []}
            />
          )}

          {menuChoice == TaxMenuChoices.ABOUT_TAX_DEDUCTIONS && (
            <TaxDeductionsTab
              description={page.about_taxdeductions}
              links={page.about_taxdeductions_links ? page.about_taxdeductions_links.links : []}
            ></TaxDeductionsTab>
          )}
        </div>
      </PageContent>
    </>
  );
};

export const getStaticProps = async ({
  preview = false,
}: GetStaticPropsContext<{ slug: string[] }>) => {
  const appStaticProps = await getAppStaticProps({
    layout: LayoutType.Profile,
  });
  const result = await getClient(preview).fetch(fetchProfilePage);

  return {
    props: {
      appStaticProps,
      preview: preview,
      data: {
        result: result,
        query: fetchProfilePage,
        queryParams: {},
      },
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: [""] } },
      { params: { slug: [TaxMenuChoices.ABOUT_TAX_DEDUCTIONS] } },
      { params: { slug: [TaxMenuChoices.FACEBOOK_DONATIONS] } },
      { params: { slug: [TaxMenuChoices.TAX_UNITS] } },
      { params: { slug: [TaxMenuChoices.YEARLY_REPORTS] } },
    ],
    fallback: false,
  };
}
const fetchProfilePage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
  },
  "page": *[_type == "tax"] {
    facebook_description,
    facebook_description_links,
    about_taxdeductions,
    about_taxdeductions_links,
  },
  ${footerQuery}
  ${widgetQuery}
}
`;

export default Page;
