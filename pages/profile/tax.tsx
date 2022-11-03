import Head from "next/head";
import { Layout } from "../../components/profile/layout/layout";
import style from "../../styles/Tax.module.css";
import { LayoutPage } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { Navbar } from "../../components/profile/layout/navbar";
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { FacebookTaxWidget } from "../../components/profile/tax/FacebookTaxWidget/FacebookTaxWidget";
import { useContext, useState } from "react";
import { DonorContext } from "../../components/profile/layout/donorProvider";
import { PortableText } from "../../lib/sanity";
import Link from "next/link";
import { widgetQuery } from "../../_queries";
import TaxMenu, { TaxMenuChoices } from "../../components/profile/tax/TaxMenu/TaxMenu";
import { FacebookTab } from "../../components/profile/tax/FacebookTab/FacebookTab";
import { TaxDeductionsTab } from "../../components/profile/tax/TaxDeductionsTab/TaxDeductionsTab";
import { TaxUnitsTab } from "../../components/profile/tax/TaxUnitsTab/TaxUnitsTab";

const Home: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const router = useRouter();
  const settings = data.result.settings[0];
  const page = data.result.page[0];
  const { donor } = useContext(DonorContext);

  const [menuChoice, setMenuChoice] = useState(TaxMenuChoices.TAX_UNITS);

  if ((!router.isFallback && !data) || !donor) {
    return <div>Loading...</div>;
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
          onChange={(selected) => setMenuChoice(selected)}
        ></TaxMenu>
      </MainHeader>

      <PageContent>
        <div className={style.container}>
          <h3 className={style.header}>Skatt</h3>

          <TaxMenu selected={menuChoice} onChange={(selected) => setMenuChoice(selected)}></TaxMenu>

          {menuChoice == TaxMenuChoices.TAX_UNITS && <TaxUnitsTab />}

          {menuChoice == TaxMenuChoices.FACEBOOK_DONATIONS && (
            <FacebookTab
              donor={donor}
              description={page.facebook_description[0]}
              links={page.facebook_description_links.links}
            />
          )}

          {menuChoice == TaxMenuChoices.ABOUT_TAX_DEDUCTIONS && (
            <TaxDeductionsTab
              description={page.about_taxdeductions[0]}
              links={page.about_taxdeductions_links.links}
            ></TaxDeductionsTab>
          )}
        </div>
      </PageContent>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const result = await getClient(preview).fetch(fetchProfilePage);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchProfilePage,
        queryParams: {},
      },
    },
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

Home.layout = Layout;
export default Home;
