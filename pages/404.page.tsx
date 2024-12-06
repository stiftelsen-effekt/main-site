import { groq } from "next-sanity";
import { pageBannersContentQuery } from "../_queries";
import { Navbar, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.client";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { ConsentState } from "../middleware.page";
import { GetStaticProps } from "next";
import { CustomLink } from "../components/shared/components/CustomLink/CustomLink";
import styles from "../styles/404.module.css";

const fetch404Page = groq`{
  "settings": *[_type == "site_settings"] {
    title,
    not_found_title,
    ${pageBannersContentQuery}
  }
}`;

interface Custom404Props extends GeneralPageProps {
  data: {
    result: {
      settings: Array<{
        title: string;
        not_found_title?: string;
        cookie_banner_configuration: any;
        general_banner: any;
      }>;
    };
    queryParams: {};
    query: string;
  };
  navbar: Awaited<ReturnType<typeof Navbar.getStaticProps>>;
}

export const getStaticProps: GetStaticProps<Custom404Props> = async () => {
  const draftMode = false;
  const consentState = "undecided" as ConsentState;

  const appStaticProps = await getAppStaticProps({ draftMode, consentState });
  const client = getClient();
  const result = await client.fetch(fetch404Page);

  return {
    props: {
      appStaticProps,
      draftMode,
      consentState,
      preview: draftMode,
      token: null,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      data: {
        result,
        queryParams: {},
        query: fetch404Page,
      },
      pageType: "404",
    },
  };
};

export default function Custom404({ data, navbar, draftMode, consentState }: Custom404Props) {
  const settings = data.result.settings[0];

  const navigationItems = navbar.data.result.settings.main_navigation;

  /** Create a table based on the main navigation */
  const columnCount = navigationItems.length;
  const columns = navigationItems.map((item) =>
    item._type === "navgroup"
      ? [
          { title: item.title },
          ...item.items.map((subItem) => ({
            title: subItem.title,
            slug: subItem.slug || "",
            type: subItem._type,
          })),
        ]
      : [
          null,
          {
            title: item.title,
            slug: item.slug || "",
            type: item._type,
          },
        ],
  );

  return (
    <>
      <SEO
        title={settings.not_found_title || "Page not found"}
        description="404 - Page not found"
        titleTemplate={`${settings.title} | %s`}
        siteName={settings.title}
      />

      <MainHeader
        initialConsentState={consentState}
        hideOnScroll={true}
        cookieBannerConfig={settings.cookie_banner_configuration}
        generalBannerConfig={settings.general_banner}
      >
        {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
      </MainHeader>

      <SectionContainer nodivider>
        <div className={styles.container}>
          <h1 className={styles.header}>{settings.not_found_title || "Page not found"}</h1>
          <div className={styles.table}>
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className={styles.column}>
                {column.map((item, rowIndex) => {
                  if (!item) {
                    return (
                      <div key={`${columnIndex}-${rowIndex}`} className={styles.cell}>
                        &nbsp;
                      </div>
                    );
                  }
                  if ("slug" in item) {
                    return (
                      <div key={`${columnIndex}-${rowIndex}`} className={styles.cell}>
                        <CustomLink href={item.slug} type={item.type}>
                          {item.title}
                        </CustomLink>
                      </div>
                    );
                  }
                  return (
                    <div key={`${columnIndex}-${rowIndex}`} className={styles.cell}>
                      <span>{item.title}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
