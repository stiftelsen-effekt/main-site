import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from '../components/main/layout'
import { Stepwize } from '../components/stepwize/stepwize'
import { Testimonial, Testimony } from '../components/testimonial'
import { SectionContainer } from '../components/sectionContainer'
import styles from '../styles/Home.module.css'
import { LayoutPage } from '../types'
import { Teaser } from '../components/elements/teaser'
import { groq } from 'next-sanity'
import { getClient } from '../lib/sanity.server'
import Link from 'next/link'
import { PointList } from '../components/elements/pointlist'
import { PointListPointProps } from '../components/elements/pointlistpoint'
import { IntroSection } from '../components/elements/introsection'
import { CalculatorTeaser } from '../components/elements/calculatorteaser'
import { Navbar } from '../components/main/navbar'

const Home: LayoutPage<{ data: any }> = ({ data }) => {
  const salespitch = data.frontpage[0].salespitch

  return (
    <>
      <Head>
        <title>Konduit.</title>
        <meta name="description" content="Effektiv bistand" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar elements={data.settings[0]["main_navigation"]} />

      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>{data.frontpage[0].main_heading}</h1>
        </div>
        <div className={styles.action}>
          <Link href={data.frontpage[0].sub_heading_link_target} passHref>{data.frontpage[0].sub_heading}</Link>
        </div>
      </div>

      <SectionContainer nodivider>
        <PointList points={salespitch.map((pitch: PointListPointProps, i: number) => ({
          number: salespitch.numbered ? i+1 : null,
          heading: pitch.heading,
          paragraph: pitch.paragraph
        }))}></PointList>
      </SectionContainer>

      <SectionContainer nodivider inverted>
        <IntroSection 
          heading={data.frontpage[0].introsection.heading} 
          paragraph={data.frontpage[0].introsection.paragraph} 
          slug={data.frontpage[0].introsection.slug}></IntroSection>
      </SectionContainer>

      <SectionContainer>
        <CalculatorTeaser></CalculatorTeaser>
      </SectionContainer>
      
      <SectionContainer heading=''>
        <div className={styles.teasers}>
          {data.frontpage[0].teasers.map(
            ({ _key, title, paragraph, link, image }: Teaser & { _key: string }) =>
            <Teaser 
              key={_key}
              title={title}
              paragraph={paragraph}
              link={link}
              image={image}></Teaser>)
          }
        </div>
      </SectionContainer>
      <SectionContainer heading="Slik fungerer det">
        <Stepwize />
      </SectionContainer>
      <SectionContainer heading="Hva folk sier om oss">
        {data.frontpage[0].testimonials.map(
          ({ _key, quote, quotee, quotee_background: quoteeBackground, image }: Testimony & { _key: string, quotee_background: string }) =>
            <Testimonial
              key={_key}
              quote={quote}
              quotee={quotee}
              quoteeBackground={quoteeBackground}
              image={image}
            />)
        }
      </SectionContainer>
    </>
  )
}


export async function getStaticProps({ preview = false }) {
  const data = await getClient(preview).fetch(fetchFrontpage)

  return {
    props: {
      preview,
      data,
    },
  }
}

const fetchFrontpage = groq`
{
  "settings": *[_type == "site_settings"] {
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
  "frontpage": *[_type == "frontpage"] {
    main_heading,
    sub_heading, 
    sub_heading_link_target,
    salespitch,
    introsection,
    key_points,
    testimonials,
    teasers
  },
}
`

Home.layout = Layout
export default Home
