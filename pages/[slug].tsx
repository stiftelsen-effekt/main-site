import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Links } from "../components/main/blocks/Links/Links";
import { Paragraph } from "../components/main/blocks/Paragraph/Paragraph";
import { Testimonial } from "../components/main/blocks/Testemonial/Testemonial";
import { ContactInfo } from "../components/main/blocks/Contact/Contact";
import { FullImage } from "../components/main/blocks/FullImage/FullImage";
import { FullVideo } from "../components/main/blocks/FullVideo/FullVideo";
import { HTMLEmbed } from "../components/main/blocks/HTMLEmbed/HTMLEmbed";
import { NormalImage } from "../components/main/blocks/NormalImage/NormalImage";
import { PointList } from "../components/main/blocks/PointList/PointList";
import { PointListPointProps } from "../components/main/blocks/PointList/PointListPoint";
import { PointListSectionWrapper } from "../components/main/blocks/PointList/PointListSectionWrapper";
import { QuestionsAndAnswersGroup } from "../components/main/blocks/QuestionAndAnswers/QuestionAndAnswers";
import { SplitView } from "../components/main/blocks/SplitView/SplitView";
import { VideoEmbed } from "../components/main/blocks/VideoEmbed/VideoEmbed";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import {
  SectionContainerProps,
  SectionContainer,
} from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { Columns } from "../components/main/blocks/Columns/Columns";
import { Layout } from "../components/main/layout/layout";
import { usePreviewSubscription } from "../lib/sanity";

const GenericPage: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.result,
    enabled: preview,
  });

  const page = filterPageToSingleItem(previewData, preview);

  const header = page.header;
  const content = page.content;
  const settings = previewData.settings[0];

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/about`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader
        title={header.title}
        inngress={header.inngress}
        links={header.links}
        centered={header.centered}
      />

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
                case "normalimage":
                  return (
                    <NormalImage
                      key={block._key || block._id}
                      image={block.image}
                      alt={block.alt}
                      grayscale={block.grayscale}
                      caption={block.caption}
                    />
                  );
                case "fullvideo":
                  return (
                    <FullVideo
                      key={block._key || block._id}
                      video={block.video.asset}
                      alt={block.alt}
                    />
                  );
                case "htmlembed":
                  return (
                    <HTMLEmbed
                      key={block._key || block._id}
                      code={block.code}
                      grayscale={block.grayscale}
                    />
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
    </>
  );
};

export async function getStaticProps({ preview = false, params = { slug: "" } }) {
  const { slug } = params;
  let result = await getClient(preview).fetch(fetchGenericPage, { slug });
  result = { ...result, page: filterPageToSingleItem(result.page, preview) };

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchGenericPage,
        queryParams: { slug },
      },
    },
  };
}

export async function getStaticPaths() {
  const data = await getClient(false).fetch(fetchGenericPages);

  return {
    paths: data.pages.map((page: { slug: { current: string } }) => ({
      params: { slug: page.slug.current },
    })),
    fallback: false,
  };
}

const fetchGenericPages = groq`
{
  "pages": *[_type == "generic_page"] {
    slug { current }
  }
}
`;

const fetchGenericPage = groq`
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
  "page": *[_type == "generic_page" && slug.current == $slug] {
    header {
      ...,
      seoImage{
        asset->,
      },
      links[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      }
    },
    content[] {
      ...,
      blocks[] {
        _type == 'reference' => @->,
        _type == 'testimonials' =>  {
          ...,
          testimonials[]->,
        },
        _type == 'fullvideo' =>  {
          ...,
          video{
            asset->,
          },
        },
        _type != 'reference' && _type != 'testimonials' && _type != 'fullvideo' => @,
      }
    }
  },
}
`;

const filterPageToSingleItem = (data: any, preview: boolean) => {
  if (!Array.isArray(data.page)) {
    return data;
  }

  if (data.page.length === 1) {
    return data.page[0];
  }

  if (preview) {
    return data.page.find((item: any) => item._id.startsWith("drafts.")) || data.page[0];
  }

  return data.page[0];
};

GenericPage.layout = Layout;
export default GenericPage;
