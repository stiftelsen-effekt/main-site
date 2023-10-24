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
import { QuestionsAndAnswersGroup } from "./QuestionAndAnswers/QuestionAndAnswers";
import { Quote } from "./Quote/Quote";
import { SplitView } from "./SplitView/SplitView";
import { Testimonial } from "./Testemonial/Testemonial";
import { VideoEmbed } from "./VideoEmbed/VideoEmbed";
import { NewsletterSignup } from "./NewsletterSignup/NewsletterSignup";
import { WealthCalculator } from "./WealthCalculator/WealthCalculator";
import { WealthCalculatorTeaser } from "./WealthCalculatorTeaser/WealthCalculatorTeaser";
import { InterventionWidget } from "./InterventionWidget/InterventionWidget";
import { IntroSection } from "./IntroSection/IntroSection";
import { Contributors } from "./Contributors/Contributors";
import { Inngress } from "./Inngress/Inngress";
import { Teasers } from "./Teasers/Teasers";
import { GiveBlock } from "./GiveBlock/GiveBlock";
import { GiveWellStamp } from "./GiveWellStamp/GiveWellStamp";
import { OrganizationsList } from "./OrganizationsList/OrganizationsList";
import { SplitViewHtml } from "./SplitViewHtml/SplitViewHtml";

export const BlockContentRenderer: React.FC<{ content: any }> = ({ content }) => {
  return (
    <>
      {content &&
        content.map(
          (section: SectionContainerProps & { _key: string; blocks: any }) =>
            !section.hidden && (
              <SectionContainer
                key={section._key}
                heading={section.heading}
                inverted={section.inverted}
                nodivider={section.nodivider}
                padded={section.padded}
                ypadded={section.ypadded}
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
                          <PointList
                            key={block._key}
                            points={block.points}
                            numbered={block.numbered}
                            options={block.options}
                          />
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
                            links={block.links}
                            image={block.image}
                            darktext={block.darktext}
                          />
                        );
                      case "splitviewhtml":
                        return (
                          <SplitViewHtml
                            key={block._key || block._id}
                            title={block.title}
                            swapped={block.swapped}
                            paragraph={block.paragraph}
                            links={block.links}
                            code={block.htmlcode}
                            darktext={block.darktext}
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
                          <Testimonial
                            key={block._key || block._id}
                            testimonies={block.testimonials}
                          />
                        );
                      case "teasers":
                        return <Teasers key={block._key || block._id} teasers={block.teasers} />;
                      case "quote":
                        return (
                          <Quote
                            key={block._key || block._id}
                            quote={block.quote}
                            offset={block.offset}
                            quotationMarks={block.quotation_marks}
                          />
                        );
                      case "wealthcalculator":
                        return (
                          <WealthCalculator
                            key={block._key || block._id}
                            showImpact={block.show_impact}
                            interventions={block.interventions}
                            explanation={block.data_explanation}
                            afterDonationPercentileLabelTemplateString={
                              block.income_percentile_after_donation_label_template_string
                            }
                            incomePercentileLabelTemplateString={
                              block.income_percentile_label_template_string
                            }
                          />
                        );
                      case "wealthcalculatorteaser":
                        return (
                          <WealthCalculatorTeaser
                            key={block._key || block._id}
                            title={block.title}
                            description={block.description}
                            link={block.button}
                            medianIncome={block.median_income}
                            afterDonationPercentileLabelTemplateString={
                              block.income_percentile_after_donation_label_template_string
                            }
                            incomePercentileLabelTemplateString={
                              block.income_percentile_label_template_string
                            }
                          />
                        );
                      case "contributorlist":
                        return (
                          <>
                            <Contributors
                              key={block._key || block._id}
                              title={block.role.title}
                              contributors={block.contributors}
                              displayImages={block.displayimages}
                            />
                          </>
                        );
                      case "inngress":
                        return (
                          <Inngress
                            key={block._key || block._id}
                            header={block.heading}
                            content={block.body}
                            links={block.sidelinks}
                          />
                        );
                      case "interventionwidget":
                        return (
                          <InterventionWidget
                            key={block._key || block._id}
                            title={block.title}
                            default_sum={block.default_sum}
                            interventions={block.interventions}
                          />
                        );
                      case "introsection": {
                        return (
                          <IntroSection
                            key={block._key || block._id}
                            heading={block.heading}
                            paragraph={block.paragraph}
                          />
                        );
                      }
                      case "giveblock": {
                        return (
                          <GiveBlock
                            key={block._key || block._id}
                            heading={block.heading}
                            paragraph={block.paragraph}
                          />
                        );
                      }
                      case "givewellstamp": {
                        return (
                          <GiveWellStamp
                            key={block._key || block._id}
                            links={block.links}
                            quote={block.quote}
                            quotee={block.quotee}
                            quoteePosition={block.quotee_position}
                          />
                        );
                      }
                      case "organizationslist": {
                        return (
                          <OrganizationsList
                            key={block._key || block._id}
                            organizations={block.organizations}
                          />
                        );
                      }
                      default:
                        return block._type;
                    }
                  })}
              </SectionContainer>
            ),
        )}
    </>
  );
};
