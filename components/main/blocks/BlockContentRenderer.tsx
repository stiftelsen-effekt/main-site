import React from "react";
import links from "./Links/Links.module.scss";
import {
  SectionContainerProps,
  SectionContainer,
} from "../layout/SectionContainer/sectionContainer";
import { Columns } from "./Columns/Columns";
import { ContactInfo } from "./Contact/Contact";
import { FullImage } from "./FullImage/FullImage";
import { FullVideo } from "./FullVideo/FullVideo";
import { HTMLEmbed } from "./HTMLEmbed/HTMLEmbed";
import { Links } from "./Links/Links";
import { NormalImage } from "./NormalImage/NormalImage";
import { Paragraph } from "./Paragraph/Paragraph";
import { PointList } from "./PointList/PointList";
import { PointListPointProps } from "./PointList/PointListPoint";
import { PointListSectionWrapper } from "./PointList/PointListSectionWrapper";
import { QuestionsAndAnswersGroup } from "./QuestionAndAnswers/QuestionAndAnswers";
import { Quote } from "./Quote/Quote";
import { SplitView } from "./SplitView/SplitView";
import { Testimonial } from "./Testemonial/Testemonial";
import { VideoEmbed } from "./VideoEmbed/VideoEmbed";
import { NewsletterSignup } from "./NewsletterSignup/NewsletterSignup";

export const BlockContentRenderer: React.FC<{ content: any }> = ({ content }) => {
  return (
    <>
      {content &&
        content.map((section: SectionContainerProps & { _key: string; blocks: any }) => (
          <SectionContainer
            key={section._key}
            heading={section.heading}
            inverted={section.inverted}
            nodivider={section.nodivider}
            padded={section.padded}
          >
            {section.blocks &&
              section.blocks.map((block: any) => {
                switch (block._type) {
                  case "paragraph":
                    return (
                      <Paragraph key={block._key} title={block.title} blocks={block.content} />
                    );
                  case "videoembed":
                    return (
                      <VideoEmbed key={block._key} id={block.url} thumbnail={block.thumbnail} />
                    );
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
                      <div key={block._key} className={links.linksWrapper}>
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
                      <FullImage
                        key={block._key || block._id}
                        image={block.image}
                        alt={block.alt}
                      />
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
                  case "newslettersignup":
                    return (
                      <NewsletterSignup
                        key={block._key || block._id}
                        header={block.header}
                      ></NewsletterSignup>
                    );
                  case "htmlembed":
                    return (
                      <HTMLEmbed
                        key={block._key || block._id}
                        code={block.htmlcode}
                        grayscale={block.grayscale}
                      />
                    );
                  case "columns":
                    return <Columns key={block._key || block._id} columns={block.columns} />;
                  case "testimonials":
                    return (
                      <Testimonial key={block._key || block._id} testimonies={block.testimonials} />
                    );
                  case "quote":
                    return (
                      <Quote
                        key={block._key || block._id}
                        quote={block.quote}
                        offset={block.offset}
                        quotationMarks={block.quotation_marks}
                      />
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
