import Head from "next/head";
import { Layout } from "../components/main/layout";
import { Stepwize } from "../components/stepwize/stepwize";
import { Testimonial, Testimony } from "../components/testimonial";
import { SectionContainer } from "../components/sectionContainer";
import styles from "../styles/Home.module.css";
import { LayoutPage } from "../types";
import { Teaser } from "../components/elements/teaser";
import { groq } from "next-sanity";
import { getClient } from "../lib/sanity.server";
import { PointList } from "../components/elements/pointlist";
import { PointListPointProps } from "../components/elements/pointlistpoint";
import { IntroSection } from "../components/elements/introsection";
import { Navbar } from "../components/main/navbar";
import { GiveBlock } from "../components/elements/giveblock";
import { footerQuery } from "../components/footer";
import { ImpactWidget } from "../components/elements/impactwidget";
import { useEffect, useState } from "react";
import { MainHeader } from "../components/main/header";
import { CookieBanner } from "../components/elements/cookiebanner";

const Home: LayoutPage<{ data: any }> = ({ data }) => {
  const salespitch = data.frontpage[0].salespitch;
  const settings = data.settings[0];
  const interventionWidget = data.frontpage[0].intervention_widget;

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
      <Head>
        <title>Konduit.</title>
        <meta name="description" content="Effektiv bistand" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={true}>
        {/*<CookieBanner />*/}
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>{data.frontpage[0].main_heading}</h1>
        </div>
        <p className={styles.subheading + " inngress"}>{data.frontpage[0].sub_heading}</p>
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
          heading={data.frontpage[0].introsection.heading}
          paragraph={data.frontpage[0].introsection.paragraph}
          slug={data.frontpage[0].introsection.slug}
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
          {data.frontpage[0].teasers.map(
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
        <Stepwize steps={data.frontpage[0].key_points.map((p: any) => p)} />
      </SectionContainer>

      {data.frontpage[0].testimonials && (
        <SectionContainer heading="Hva folk sier om oss">
          <Testimonial testimonies={data.frontpage[0].testimonials} />
        </SectionContainer>
      )}

      <SectionContainer nodivider>
        <GiveBlock></GiveBlock>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const data = await getClient(preview).fetch(fetchFrontpage);

  return {
    props: {
      preview,
      data,
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
