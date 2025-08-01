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
import { WealthCalculatorPeriodAdjustment } from "../../shared/components/Graphs/Area/AreaGraph";
import { Accordion } from "./Accordion/Accordion";
import { PhilantropicTeaser } from "./PhilantropicTeaser/PhilantropicTeaser";
import { stegaClean } from "@sanity/client/stega";
import dynamic from "next/dynamic";
import { PlausibleRevenueTracker } from "./PlausibleRevenueTracker/PlausibleRevenueTracker";
import { OpenDistributionButton } from "./OpenDistributionButton/OpenDistributionButton";
import { Fundraiserchart, Opendistributionbutton } from "../../../studio/sanity.types";
import { FundraiserChart } from "./FundraiserChart/FundraiserChart";
import { TeamIntroduction } from "./TeamIntroduction/TeamIntroduction";
import { ResultsTeaser } from "./ResultsTeaser/ResultsTeaser";
import { TaxDeductionWidget } from "./TaxDeductionWidget/TaxDeductionWidget";
import { DonationWidgetBlock } from "./DonationWidgetBlock/DonationWidgetBlock";
import { DKMembershipWidget } from "./DKMembershipWidget/DKMembershipWidget";
import { DKMembershipDisplay } from "./DKMembershipDisplay/DKMemberShipDisplay";
import { DKRenewPayment } from "./DKRenewPayment/DKRenewPayment";
import { MediaCoverageTeaser } from "./MediaCoverageTeaser/MediaCoverageTeaser";
import { FormsparkForm } from "./FormSparkForm/FormSparkForm";

/* Dynamic imports */
const WealthCalculator = dynamic(() =>
  import("./WealthCalculator/WealthCalculator").then((mod) => mod.WealthCalculator),
);
const WealthCalculatorTeaser = dynamic(() =>
  import("./WealthCalculatorTeaser/WealthCalculatorTeaser").then(
    (mod) => mod.WealthCalculatorTeaser,
  ),
);
const DiscountRateComparison = dynamic(() =>
  import("./DiscountRateComparison/DiscountRateComparison").then(
    (mod) => mod.DiscountRateComparison,
  ),
);
const ITNCoverage = dynamic(() =>
  import("./ITNCoverage/ITNCoverage").then((mod) => mod.ITNCoverage),
);

export const BlockContentRenderer: React.FC<{ content: any }> = ({ content }) => {
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
                <SectionBlockContentRenderer blocks={section.blocks} />
              </SectionContainer>
            ),
        )}
    </>
  );
};

export const SectionBlockContentRenderer: React.FC<{ blocks: any }> = ({ blocks }) => {
  if (!blocks) return null;

  return (
    <>
      {blocks.map((block: any) => {
        switch (block._type) {
          case "paragraph":
            return (
              <Paragraph
                key={block._key}
                tocKey={block._key}
                title={block.title}
                blocks={block.content}
              />
            );
          case "accordion":
            return <Accordion key={block._key} title={block.title} blocks={block.blocks} />;
          case "videoembed":
            return <VideoEmbed key={block._key} id={block.url} thumbnail={block.thumbnail} />;
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
          case "questionandanswergroup":
            return <QuestionsAndAnswersGroup key={block._key} group={block} />;
          case "splitview":
            return (
              <SplitView
                key={block._key || block._id}
                title={block.title}
                swapped={block.swapped}
                rowSwapped={block.rowSwapped}
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
                rowSwapped={block.rowSwapped}
                paragraph={block.paragraph}
                links={block.links}
                code={block.htmlcode}
                darktext={block.darktext}
                adoveoFundraiserId={block.adoveoFundraiserId}
                vippsNumber={block.vippsNumber}
              />
            );
          case "fullimage":
            return <FullImage key={block._key || block._id} image={block.image} alt={block.alt} />;
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
              <FullVideo key={block._key || block._id} video={block.video.asset} alt={block.alt} />
            );
          case "newslettersignup":
            return (
              <NewsletterSignup
                key={block._key || block._id}
                header={block.header}
                formurl={block.formurl}
                sendlabel={block.sendlabel}
                emailLabel={block.emailLabel}
                locale={stegaClean(block.locale)}
              ></NewsletterSignup>
            );
          case "htmlembed":
            return (
              <HTMLEmbed
                key={block._key || block._id}
                code={block.htmlcode}
                grayscale={block.grayscale}
                fullwidth={block.fullwidth}
              />
            );
          case "columns":
            return <Columns key={block._key || block._id} columns={block.columns} />;
          case "testimonials":
            return <Testimonial key={block._key || block._id} testimonies={block.testimonials} />;
          case "blocktables":
            return (
              <BlockTables
                key={block._key || block._id}
                config={block.configuration}
                tables={block.tables}
                columnWidths={block.columnwidths}
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
            if (!block.configuration) {
              return <span key={block._key}>No configuration for wealth calculator</span>;
            }
            if (!block.configuration.calculator_input_configuration) {
              return <span key={block._key}>No input configuration for wealth calculator</span>;
            }
            let calcPeriod: WealthCalculatorPeriodAdjustment;
            if (
              stegaClean(block.configuration.calculator_input_configuration.period) === "yearly"
            ) {
              calcPeriod = WealthCalculatorPeriodAdjustment.YEARLY;
            } else if (
              stegaClean(block.configuration.calculator_input_configuration.period) === "monthly"
            ) {
              calcPeriod = WealthCalculatorPeriodAdjustment.MONTHLY;
            } else {
              return (
                <span key={block._key}>Unknown period {block.period} for wealth calculation</span>
              );
            }
            return (
              <WealthCalculator
                key={block._key || block._id}
                title={block.title}
                configuration={block.configuration}
                impactConfiguration={block.impact_configuration}
                periodAdjustment={calcPeriod}
                locale={stegaClean(block.locale)}
              />
            );
          case "wealthcalculatorteaser":
            let teaserPeriod: WealthCalculatorPeriodAdjustment;
            if (stegaClean(block.period) === "yearly") {
              teaserPeriod = WealthCalculatorPeriodAdjustment.YEARLY;
            } else if (stegaClean(block.period) === "monthly") {
              teaserPeriod = WealthCalculatorPeriodAdjustment.MONTHLY;
            } else {
              return (
                <span key={block._key}>Unknown period {block.period} for wealth calculation</span>
              );
            }
            return (
              <WealthCalculatorTeaser
                key={block._key || block._id}
                title={block.title}
                description={block.description}
                link={block.button}
                medianIncome={block.median_income}
                xAxisLabel={block.x_axis_label}
                afterDonationPercentileLabelTemplateString={stegaClean(
                  block.income_percentile_after_donation_label_template_string,
                )}
                incomePercentileLabelTemplateString={stegaClean(
                  block.income_percentile_label_template_string,
                )}
                locale={stegaClean(block.locale)}
                periodAdjustment={teaserPeriod}
              />
            );
          case "teamintroduction":
            return (
              <TeamIntroduction
                key={block._key || block._id}
                contributor={block.contributor}
                content={block.content}
                links={block.links}
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
          case "resultsteaser":
            return (
              <ResultsTeaser
                key={block._key || block._id}
                title={block.title}
                sumSubtitle={block.sum_subtitle}
                donorsSubtitle={block.donors_subtitle}
                seeMoreButton={block.see_more_button}
                locale={stegaClean(block.locale)}
              />
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
                description={block.description}
                donationLabel={block.donation_label}
                default_sum={block.default_sum}
                outputConfiguration={block.output_configuration}
                currency={block.currency}
                locale={block.locale}
              />
            );
          case "taxdeductionwidget":
            console.log(block);
            return (
              <TaxDeductionWidget
                key={block._key || block._id}
                title={block.title}
                description={block.description}
                suggestedSums={block.suggested_sums}
                minimumTreshold={block.minimum_treshold}
                maximumTreshold={block.maximum_treshold}
                percentageReduction={block.percentage_reduction}
                donationsLabel={block.donations_label}
                taxDeductionReturnDescriptionTemplate={
                  block.tax_deduction_return_description_template
                }
                belowMinimumTresholdDescriptionTemplate={
                  block.below_minimum_treshold_description_template
                }
                buttonText={block.button_text}
                chartLabels={{
                  maximumThresholdLabel: block.chart_labels?.maximum_threshold,
                  minimumThresholdLabel: block.chart_labels?.minimum_threshold,
                  currentValueLabel: block.chart_labels?.deduction,
                  taxBenefitLabel: block.chart_labels?.tax_benefit,
                }}
                locale={stegaClean(block.locale)}
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
                donateLabel={block.donate_label_short}
                accentColor={stegaClean(block.accent_color)}
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
          case "opendistributionbutton": {
            return (
              <OpenDistributionButton
                key={block._key || block._id}
                {...(block as Opendistributionbutton)}
              />
            );
          }
          case "fundraiserchart": {
            return (
              <FundraiserChart key={block._key || block._id} {...(block as Fundraiserchart)} />
            );
          }
          case "giftcardteaser": {
            return (
              <GiftCard
                key={block._key || block._id}
                title={block.title}
                description={block.description}
                image={block.image}
                links={block.links}
              />
            );
          }
          case "philantropicteaser": {
            return (
              <PhilantropicTeaser
                key={block._key || block._id}
                title={block.title}
                description={block.description}
                links={block.links}
                button={block.button}
                people={block.people}
              />
            );
          }
          case "discountratecomparison":
            return (
              <DiscountRateComparison
                key={block._key || block._id}
                min={block.discount_rate_min}
                max={block.discount_rate_max}
              />
            );
          case "itncoverage":
            return (
              <ITNCoverage
                key={block._key || block._id}
                title={block.title}
                subtitle={block.subtitle}
                images={block.images}
                range={[block.start_year, block.end_year]}
                mapExplenation={block.map_explenation}
                graphExplenation={block.graph_explenation}
                caption={block.caption}
              />
            );
          case "plausiblerevenuetracker":
            return (
              <PlausibleRevenueTracker
                key={block._key}
                enabled={block.enabled}
                type={block.type}
                locale={block.locale}
              />
            );
          case "donationwidgetblock":
            return (
              <DonationWidgetBlock
                key={block._key || block._id}
                widgetConfiguration={block.donationwidget}
                overrides={block.overrides}
                content={block.content}
                contentPosition={block.content_position}
                contentMobilePosition={block.content_mobile_position}
              />
            );
          case "dkmembershipwidget":
            return (
              <DKMembershipWidget key={block._key || block._id} config={block.confituration} />
            );
          case "dkmembershipdisplay":
            return (
              <DKMembershipDisplay
                key={block._key || block._id}
                membership_count_subtitle={block.membership_count_subtitle}
                description={block.description}
              />
            );
          case "dkrenewpayment":
            return <DKRenewPayment />;
          case "mediacoverageteaser":
            return (
              <MediaCoverageTeaser
                key={block._key || block._id}
                title={block.title}
                coverage={block.coverage}
                readMoreButton={block.read_more_button}
              />
            );
          case "formsparkform":
            return <FormsparkForm key={block._key || block._id} formData={block} />;
          default:
            return block._type;
        }
      })}
    </>
  );
};
