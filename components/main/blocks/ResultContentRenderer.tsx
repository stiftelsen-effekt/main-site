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
import { GiftCard } from "./GiftCard/GiftCard";
import { BlockTables } from "./BlockTable/BlockTables";
import { DiscountRateComparison } from "./DiscountRateComparison/DiscountRateComparison";
import { ResultsGraphData } from "../../../pages/ResultsPage";
import { CumulativeDonations } from "../../shared/components/Graphs/Results/CumulativeDonations/CumulativeDonations";
import graphcontext from "../../../studio/schemas/types/results/graphcontext";
import { ResultsOutput } from "../../shared/components/ResultsOutput/ResultsOutput";
import { ReferralSums } from "../../shared/components/Graphs/Results/ReferralSums/ReferralSums";

export const ResultContentRenderer: React.FC<{ content: any; graphData: ResultsGraphData }> = ({
  content,
  graphData,
}) => {
  return (
    <>
      {content &&
        content.map(
          (section: SectionContainerProps & { _key?: string; _id?: string; blocks: any }) =>
            section &&
            !section.hidden && (
              <SectionContainer
                key={section._key || section._id}
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
                      case "links":
                        return (
                          <div key={block._key} className={links.linksWrapper}>
                            <p className="inngress">{block.title ?? "Les mer:"}</p>
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
                      case "giveblock": {
                        return (
                          <GiveBlock
                            key={block._key || block._id}
                            heading={block.heading}
                            paragraph={block.paragraph}
                            donateLabel={block.donate_label_short}
                            accentColor={block.accent_color}
                          />
                        );
                      }
                      case "cumulativedonationsgraph":
                        return (
                          <CumulativeDonations
                            key={block._key || block._id}
                            dailyDonations={graphData.dailyDonations}
                          />
                        );
                      case "resultsoutput":
                        const data = graphData.monthlyDonationsPerOutput.find(
                          (o) => o.output === mapSanityOutputToDataOutput(block.outputType),
                        );
                        if (!data) {
                          return "Did not find data for output type " + block.outputType;
                        }
                        return (
                          <ResultsOutput
                            key={block._key || block._id}
                            graphData={data}
                            outputCountries={block.output_countries}
                            description={block.description}
                          ></ResultsOutput>
                        );
                      case "referralgraph":
                        return (
                          <ReferralSums
                            key={block._key || block._id}
                            referralSums={graphData.referralSums}
                          />
                        );
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

const mapSanityOutputToDataOutput = (output: string) => {
  switch (output) {
    case "Bednets":
      return "Myggnett";
    case "Deworming":
      return "Ormekurer";
    case "Cash":
      return "Dollar mottatt";
    case "Cash zakat":
      return "Dollar mottatt som zakat";
    case "Vitamin A":
      return "A-vitamintilskudd";
    case "Malaria treatment":
      return "Malariabehandlinger";
    case "Vaccinations":
      return "Vaksinasjoner";
    case "Years of food fortification":
      return "År med næringstilsetting";
    default:
      return output;
  }
};
