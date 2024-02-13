// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";
import contributor from "./types/contributor";
import keyPoint from "./types/key-point";
import organization from "./types/organization";
import role from "./types/role";
import testimonial from "./types/testimonial";
import teasers from "./types/teasers";
import teasersitem from "./types/teasersitem";
import pointlist from "./types/pointlist";
import introsection from "./types/introsection";
import siteSettings from "./siteSettings";
import link from "./types/link";
import navitem from "./types/navitem";
import navgroup from "./types/navgroup";
import pageheader from "./types/pageheader";
import questionandanswer from "./types/questionandanswer";
import questionandanswergroup from "./types/questionandanswergroup";
import support from "./pages/support";
import generic from "./pages/generic";
import contactinfo from "./types/contactinfo";
import videoembed from "./types/videoembed";
import contentsection from "./types/contentsection";
import criteria from "./pages/criteria";
import paragraph from "./types/paragraph";
import pointlistpoint from "./types/pointlistpoint";
import links from "./types/links";
import splitview from "./types/splitview";
import fullimage from "./types/fullimage";
import column from "./types/column";
import columns from "./types/columns";
import intervention from "./types/intervention";
import interventionwidget from "./types/interventionwidget";
import testimonials from "./types/testimonials";
import articleheader from "./types/articleheader";
import article from "./pages/article";
import articles from "./pages/articles";
import normalimage from "./types/normalimage";
import fullvideo from "./types/fullvideo";
import htmlembed from "./types/htmlembed";
import donationwidget from "./types/donationwidget";
import quote from "./types/quote";
import vippsagreement from "./pages/vippsagreement";
import citation from "./types/citation";
import newslettersignup from "./types/newslettersignup";
import wealthcalculator from "./types/wealthcalculator";
import wealthcalculatorteaser from "./types/wealthcalculatorteaser";
import contributorlist from "./types/contributorlist";
import inngress from "./types/inngress";
import giveblock from "./types/giveblock";
import givewellstamp from "./types/givewellstamp";
import organizationslist from "./types/organizationslist";
import vipps from "./types/paymentmethods/vipps";
import vippsAnonymous from "./dashboard/vipps-anonymous";
import aggregateestimatedimpact from "./types/aggregateestimatedimpact";
import donationstableconfiguration from "./types/donationstableconfiguration";
import donations from "./dashboard/donations";
import agreements from "./dashboard/agreements";
import profile from "./dashboard/profile";
import dashboard from "./dashboard";
import tax from "./dashboard/tax";
import taxunits from "./dashboard/tax/taxunits";
import metareceipt from "./dashboard/tax/metareceipt";
import taxdeduction from "./dashboard/tax/taxdeduction";
import taxstatements from "./dashboard/tax/taxstatements";
import donationstabledetailsconfiguration from "./types/donationstabledetailsconfiguration";
import bank from "./types/paymentmethods/bank";
import swish from "./types/paymentmethods/swish";
import autogiro from "./types/paymentmethods/autogiro";
import splitviewhtml from "./types/splitviewhtml";
import category from "./types/category";
import giftcardteaser from "./types/giftcardteaser";
import avtalegiro from "./types/paymentmethods/avtalegiro";
import agreementlistconfiguration from "./types/lists/agreements/agreementlistconfiguration";
import agreementlistdetailsconfiguration from "./types/lists/agreements/agreementlistdetailsconfiguration";
import dateselectorconfig from "./types/dateselectorconfig";
import blocktable from "./types/blocktable";

export const pages = [generic, support, criteria, article, articles, vippsagreement] as const;
export const dashboardpages = [donations, agreements, profile, tax] as const;

const paymentMethods = [vipps, bank, swish, autogiro, avtalegiro] as const;

export const types = [
  category,
  teasers,
  teasersitem,
  testimonial,
  contributor,
  introsection,
  keyPoint,
  pointlist,
  pointlistpoint,
  link,
  links,
  organization,
  role,
  navitem,
  navgroup,
  pageheader,
  articleheader,
  questionandanswer,
  questionandanswergroup,
  contactinfo,
  videoembed,
  contentsection,
  paragraph,
  splitview,
  splitviewhtml,
  fullimage,
  blocktable,
  normalimage,
  column,
  columns,
  intervention,
  interventionwidget,
  testimonials,
  fullvideo,
  newslettersignup,
  htmlembed,
  donationwidget,
  quote,
  citation,
  wealthcalculator,
  wealthcalculatorteaser,
  contributorlist,
  inngress,
  giveblock,
  givewellstamp,
  organizationslist,
  vippsAnonymous,
  aggregateestimatedimpact,
  donationstableconfiguration,
  donationstabledetailsconfiguration,
  agreementlistconfiguration,
  agreementlistdetailsconfiguration,
  taxunits,
  metareceipt,
  taxdeduction,
  taxstatements,
  giftcardteaser,
  dateselectorconfig,
] as const;

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat(
    pages,
    dashboardpages,
    types,
    paymentMethods,
    [siteSettings],
    [dashboard],
  ),
});
