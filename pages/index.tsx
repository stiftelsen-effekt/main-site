import { Testimonial, Testimony } from "../components/main/blocks/Testemonial/Testemonial";
import styles from "../styles/Home.module.css";
import { LayoutPage } from "../types";
import { groq } from "next-sanity";
import { getClient } from "../lib/sanity.server";
import { useEffect, useState } from "react";
import { SEO } from "../components/shared/seo/Seo";
import { GiveBlock } from "../components/main/blocks/GiveBlock/GiveBlock";
import { ImpactWidget } from "../components/main/blocks/ImpactWidget/ImpactWidget";
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

const Home: LayoutPage<{ data: any }> = ({ data }) => {
  const salespitch = data.result.frontpage[0].salespitch;
  const settings = data.result.settings[0];
  const interventionWidget = data.result.frontpage[0].intervention_widget;
  const { seoTitle, seoDescription, seoImage } = data.result.frontpage[0];

  const [interventionCosts, setInterventionCosts] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    const interventions = interventionWidget.interventions;
    const url = `https://impact.gieffektivt.no/api/evaluations?${interventions
      .map((i: any) => `charity_abbreviation=${i.abbreviation}&`)
      .join("")}currency=NOK`;
    console.log(url);
    fetch(url).then((res) => {
      res.json().then((data) => {
        const costs = new Map();
        const evaluations = data.evaluations;
        interventions.forEach((i: any) => {
          // For each intervention, filter the evaluations for a given charity
          const filtered = evaluations.filter(
            (e: any) => e.charity.abbreviation === i.abbreviation,
          );
          // Then order the list to get the most recent
          const ordered = filtered.sort((a: any, b: any) => a.start_year - b.start_year);
          // Get the most recent evaluation
          const evaluation = ordered[0];
          // Set the cost to the most recent evaluation converted cost (cost in NOK per output)
          costs.set(i.abbreviation, evaluation.converted_cost_per_output);
        });
        setInterventionCosts(costs);
      });
    });
  }, [interventionWidget.interventions]);

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
            <ImpactWidget
              title={interventionWidget.title}
              defaultSum={interventionWidget.default_sum}
              interventions={interventionWidget.interventions.map((i: any) => ({
                title: i.title,
                pricePerOutput: interventionCosts.get(i.abbreviation),
                outputStringTemplate: i.template_string,
                organizationName: i.organization_name,
              }))}
              buttonText={interventionWidget.button_text}
            ></ImpactWidget>
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
