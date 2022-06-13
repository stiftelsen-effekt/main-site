import Head from "next/head";
import React from "react";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../../types";
import { Layout } from "../../components/main/layout";
import { Navbar } from "../../components/main/navbar";
import { PageHeader } from "../../components/elements/pageheader";
import { SectionContainer, SectionContainerProps } from "../../components/sectionContainer";
import { VideoEmbed } from "../../components/elements/videoembed";
import { PointListPointProps } from "../../components/elements/pointlistpoint";
import { PointList } from "../../components/elements/pointlist";
import { Links } from "../../components/elements/links";
import { ContactInfo } from "../../components/elements/contact-info";
import { Paragraph } from "../../components/elements/paragraph";
import { footerQuery } from "../../components/footer";
import { QuestionsAndAnswersGroup } from "../../components/elements/questionsandanswers";
import { SplitView } from "../../components/elements/splitview";
import { FullImage } from "../../components/elements/fullimage";
import { Columns } from "../../components/elements/columns";
import { MainHeader } from "../../components/main/header";
import { CookieBanner } from "../../components/elements/cookiebanner";
import { Testimonial } from "../../components/testimonial";
import { ArticleHeader } from "../../components/elements/articleheader";
import { RelatedArticles } from "../../components/elements/relatedarticles";
import { PointListSectionWrapper } from "../../components/elements/pointlistsectionwrapper";

const ArticlePage: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const header = data.page[0].header;
  const content = data.page[0].content;
  const settings = data.settings[0];
  const relatedArticles = data.relatedArticles;

  return (
    <>
      <Head>
        <title>Konduit. - {header.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader>
        {/*<CookieBanner />*/}
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <ArticleHeader title={header.title} inngress={header.inngress} published={header.published} />

      {content &&
        content.map((section: SectionContainerProps & { _key: string; blocks: any }) => (
          <SectionContainer
            key={section._key}
            heading={section.heading}
            inverted={section.inverted}
            nodivider={section.nodivider}
            padded={section.padded}
          >
            {section.blocks.map((block: any) => {
              switch (block._type) {
                case "paragraph":
                  return <Paragraph key={block._key} title={block.title} blocks={block.content} />;
                case "videoembed":
                  return <VideoEmbed key={block._key} id={block.url} />;
                case "pointlist":
                  return (
                    <PointListSectionWrapper key={block._key}>
                      <PointList
                        points={block.points.map((point: PointListPointProps, i: number) => ({
                          number: block.numbered ? i + 1 : null,
                          heading: point.heading,
                          paragraph: point.paragraph,
                        }))}
                      ></PointList>
                    </PointListSectionWrapper>
                  );
                case "links":
                  return (
                    <div key={block._key} style={{ width: "100%", maxWidth: "760px" }}>
                      <p className="inngress">Les mer:</p>
                      <Links links={block.links}></Links>
                    </div>
                  );
                case "contactinfo":
                  return (
                    <ContactInfo
                      key={block._key || block._id}
                      title={block.title}
                      description={block.description}
                      phone={block.phone}
                      email={block.email}
                    />
                  );
                case "questionandanswergroup":
                  return <QuestionsAndAnswersGroup key={block._key} group={block} />;
                case "splitview":
                  return (
                    <SplitView
                      key={block._key || block._id}
                      title={block.title}
                      swapped={block.swapped}
                      paragraph={block.paragraph}
                      link={block.link}
                      image={block.image}
                    />
                  );
                case "fullimage":
                  return (
                    <FullImage key={block._key || block._id} image={block.image} alt={block.alt} />
                  );
                case "columns":
                  return <Columns key={block._key || block._id} columns={block.columns} />;
                case "testimonials":
                  return (
                    <Testimonial key={block._key || block._id} testimonies={block.testimonials} />
                  );
                default:
                  return block._type;
              }
            })}
          </SectionContainer>
        ))}
      <RelatedArticles relatedArticles={relatedArticles} />
    </>
  );
};

export async function getStaticProps(context: any) {
  const { slug = "" } = context.params;
  const data = await getClient(false).fetch(fetchArticle, { slug });

  return {
    props: {
      preview: false,
      data,
    },
  };
}

export async function getStaticPaths() {
  const data = await getClient(false).fetch(fetchArticles);

  return {
    paths: data.pages.map((page: { slug: { current: string } }) => ({
      params: { slug: page.slug.current },
    })),
    fallback: false,
  };
}

const fetchArticles = groq`
{
  "pages": *[_type == "article_page"] {
    slug { current }
  }
}
`;

const fetchArticle = groq`
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
  ${footerQuery}
  "page": *[_type == "article_page"  && slug.current == $slug] {
    header,
    content[] {
      ...,
      blocks[] {
        _type == 'reference' => @->,
        _type == 'testimonials' =>  {
          ...,
          testimonials[]->,
        },
        _type != 'reference' && _type != 'testimonials' => @,
      }
    }
  },
  "relatedArticles": *[_type == "article_page" && slug.current != $slug] | order(date desc) [0..3] {
    header,
    "slug": slug.current,
  }
}
`;

ArticlePage.layout = Layout;
export default ArticlePage;
