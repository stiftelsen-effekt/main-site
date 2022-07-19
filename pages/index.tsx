import { Testimonial } from "../components/main/blocks/Testemonial/Testemonial";
import styles from "../styles/Home.module.css";
import { LayoutPage } from "../types";
import { groq } from "next-sanity";
import { getClient } from "../lib/sanity.server";
import dynamic from 'next/dynamic'
import { SEO } from "../components/shared/seo/Seo";
import { GiveBlock } from "../components/main/blocks/GiveBlock/GiveBlock";
import { IntroSection } from "../components/main/blocks/IntroSection/IntroSection";
import { PointList } from "../components/main/blocks/PointList/PointList";
import { PointListPointProps } from "../components/main/blocks/PointList/PointListPoint";
import { Stepwize } from "../components/main/blocks/StepWize/Stepwize";
import { Teaser } from "../components/main/blocks/Teaser/Teaser";
import { Navbar } from "../components/main/layout/navbar";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { Layout } from "../components/main/layout/layout";
import { ImpactWidgetProps } from "../components/main/blocks/ImpactWidget/ImpactWidget";

const ImpactWidget = dynamic<ImpactWidgetProps>(
  () => import("../components/main/blocks/ImpactWidget/ImpactWidget").then((mod) => mod.ImpactWidget),
  {
    ssr: false,
  },
);

const Home: LayoutPage<{ data: any }> = ({ data }) => {
  const salespitch = data.result.frontpage[0].salespitch;
  const settings = data.result.settings[0];
  const interventionWidget = data.result.frontpage[0].intervention_widget;
  const { seoTitle, seoDescription, seoImage } = data.result.frontpage[0];

  return (
    <>
      <SEO
        title={seoTitle || data.result.frontpage[0].main_heading}
        description={seoDescription || data.result.frontpage[0].sub_heading}
        imageAsset={seoImage ? seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>{data.result.frontpage[0].main_heading}</h1>
        </div>
        <p className={styles.subheading + " inngress"}>{data.result.frontpage[0].sub_heading}</p>
      </div>

      <div className={styles.salespitchWrapper}>
        <PointList
          points={salespitch.points.map((pitch: PointListPointProps, i: number) => ({
            number: salespitch.numbered ? i + 1 : null,
            heading: pitch.heading,
            paragraph: pitch.paragraph,
          }))}
        ></PointList>
      </div>

      <SectionContainer nodivider inverted>
        <IntroSection
          heading={data.result.frontpage[0].introsection.heading}
          paragraph={data.result.frontpage[0].introsection.paragraph}
          slug={data.result.frontpage[0].introsection.slug}
        ></IntroSection>
      </SectionContainer>

      {/** 
       * <SectionContainer>
        <CalculatorTeaser></CalculatorTeaser>
      </SectionContainer>
       * 
      */}
      {interventionWidget.interventions && (
        <div style={{ marginTop: "45px" }}>
          <SectionContainer>
            <ImpactWidget data={data} />
          </SectionContainer>
        </div>
      )}

      <SectionContainer heading="">
        <div className={styles.teasers}>
          {data.result.frontpage[0].teasers.map(
            ({ _key, title, paragraph, disclaimer, link, image }: Teaser & { _key: string }) => (
              <Teaser
                key={_key}
                title={title}
                paragraph={paragraph}
                disclaimer={disclaimer}
                link={link}
                image={image}
              ></Teaser>
            ),
          )}
        </div>
      </SectionContainer>
      <SectionContainer heading="Slik fungerer det" padded>
        <Stepwize steps={data.result.frontpage[0].key_points.map((p: any) => p)} />
      </SectionContainer>

      {data.result.frontpage[0].testimonials && (
        <SectionContainer heading="Hva folk sier om oss">
          <Testimonial testimonies={data.result.frontpage[0].testimonials} />
        </SectionContainer>
      )}

      <SectionContainer nodivider>
        <GiveBlock></GiveBlock>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const result = await getClient(preview).fetch(fetchFrontpage);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchFrontpage,
        queryParams: {},
      },
    },
  };
}

const fetchFrontpage = groq`
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
    },
  },
  ${footerQuery}
  "frontpage": *[_type == "frontpage"] {
    seoTitle, 
    seoDescription, 
    seoImage{
      asset->
    },
    main_heading,
    sub_heading, 
    sub_heading_link_target,
    salespitch,
    introsection,
    intervention_widget,
    key_points,
    testimonials[]->,
    teasers
  },
}
`;

Home.layout = Layout;
export default Home;
