import React, { Suspense } from "react";
import links from "./Links/Links.module.scss";
import {
  SectionContainerProps,
  SectionContainer,
} from "../layout/SectionContainer/sectionContainer";
import { ContactInfo } from "./Contact/Contact";
import { FullImage } from "./FullImage/FullImage";
import { Links } from "./Links/Links";
import { NormalImage } from "./NormalImage/NormalImage";
import { Paragraph } from "./Paragraph/Paragraph";
import { GiveBlock } from "./GiveBlock/GiveBlock";
import { ResultsGraphData } from "../../../pages/ResultsPage";
import dynamic from "next/dynamic";
import { stegaClean } from "@sanity/client/stega";
import { ResultsHeadline } from "../../shared/components/ResultsHeadline/ResultsHeadline";
import { CumulativeDonationsSkeleton } from "../../shared/components/Graphs/Results/CumulativeDonations/CumulativeDonationsSkeleton";
import { Resultstext } from "../../../studio/sanity.types";

/** Dynamic imports */
const CumulativeDonations = dynamic(
  () =>
    import("../../shared/components/Graphs/Results/CumulativeDonations/CumulativeDonations").then(
      (mod) => mod.CumulativeDonations,
    ),
  {
    loading: () => <CumulativeDonationsSkeleton />,
  },
);
const ResultsOutput = dynamic(() =>
  import("../../shared/components/ResultsOutput/ResultsOutput").then((mod) => mod.ResultsOutput),
);
const ReferralSums = dynamic(() =>
  import("../../shared/components/Graphs/Results/ReferralSums/ReferralSums").then(
    (mod) => mod.ReferralSums,
  ),
);

export interface ResultsTextConfig {
  textConfiguration?: Resultstext;
  outputMappings?: Array<{
    sanityKey: string;
    dataKey: string;
  }>;
  organizationMappings?: Array<{
    abbreviation: string;
    fullName: string;
  }>;
  referralTypeMappings?: Array<{
    apiKey: string;
    displayLabel: string;
  }>;
}

export const ResultContentRenderer: React.FC<{
  content: any;
  graphData: ResultsGraphData;
  textConfig: ResultsTextConfig;
}> = ({ content, graphData, textConfig }) => {
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
                          <Paragraph
                            tocKey={block._key}
                            key={block._key}
                            title={block.title}
                            blocks={block.content}
                          />
                        );
                      case "links":
                        return (
                          <div key={block._key} className={links.linksWrapper}>
                            <p className="inngress">
                              {block.title ??
                                (textConfig.textConfiguration?.readMoreDefaultText || "Les mer:")}
                            </p>
                            <Links links={block.links}></Links>
                          </div>
                        );
                      case "resultsheadline":
                        const totalOutputs = block.outputs.map((output: string) => {
                          const data = graphData.monthlyDonationsPerOutput.find(
                            (o) =>
                              o.output ===
                              mapSanityOutputToDataOutput(output, textConfig.outputMappings),
                          );
                          if (!data) {
                            return "Did not find data for output type " + output;
                          }
                          return {
                            name:
                              data.output.indexOf("vitamin") > -1
                                ? data.output
                                : data.output.toLowerCase(),
                            outputs: data.total.numberOfOutputs,
                          };
                        });

                        return (
                          <ResultsHeadline
                            key={block._key || block._id}
                            headlineNumbers={graphData.resultsHeadlineNumbers}
                            totalOutputs={totalOutputs}
                            textConfig={textConfig.textConfiguration}
                          />
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
                            accentColor={stegaClean(block.accent_color)}
                          />
                        );
                      }
                      case "cumulativedonationsgraph":
                        return (
                          <CumulativeDonations
                            key={block._key || block._id}
                            dailyDonations={graphData.dailyDonations}
                            graphContext={block.graphcontext}
                            textConfig={{
                              millionAbbreviation:
                                textConfig.textConfiguration?.millionAbbreviation,
                              locale: textConfig.textConfiguration?.locale,
                              tableText: block.tableText,
                            }}
                          />
                        );
                      case "resultsoutput":
                        const data = graphData.monthlyDonationsPerOutput.find(
                          (o) =>
                            o.output ===
                            mapSanityOutputToDataOutput(
                              block.outputType,
                              textConfig.outputMappings,
                            ),
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
                            graphAnnotations={block.graph_annotations}
                            graphContext={block.graphcontext}
                            organizationLinks={block.organization_links}
                            links={block.links}
                            textConfig={textConfig.textConfiguration}
                          ></ResultsOutput>
                        );
                      case "referralgraph":
                        return (
                          <ReferralSums
                            key={block._key || block._id}
                            referralSums={graphData.referralSums}
                            graphContext={block.graphcontext}
                            textConfig={{
                              millionAbbreviation:
                                textConfig.textConfiguration?.millionAbbreviation,
                              referralTypeMappings: textConfig.referralTypeMappings,
                              tableText: block.tableText,
                            }}
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

const mapSanityOutputToDataOutput = (
  output: string,
  mappings?: Array<{ sanityKey: string; dataKey: string }>,
) => {
  if (mappings) {
    const mapping = mappings.find((m) => m.sanityKey === output);
    if (mapping) {
      return mapping.dataKey;
    }
  }

  // Fallback to hardcoded mappings for backwards compatibility
  switch (output) {
    case "Bednets":
      return "Myggnett";
    case "Deworming":
      return "Ormekurer";
    case "Cash":
      return "Dollar mottatt";
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
