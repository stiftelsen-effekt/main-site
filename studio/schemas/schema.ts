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
import contactinfo from "./types/contactinfo";
import videoembed from "./types/videoembed";
import contentsection from "./types/contentsection";
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
import normalimage from "./types/normalimage";
import fullvideo from "./types/fullvideo";
import htmlembed from "./types/htmlembed";
import donationwidget from "./types/donationwidget";
import quote from "./types/quote";
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
import dashboard from "./dashboard";
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
import blocktables from "./types/blocktable";
import discountratecomparison from "./types/discountratecomparison";
import wealthcalculatorconfiguration from "./types/wealthcalculatorconfiguration";
import interventionwidgetoutputconfiguration from "./types/interventionwidgetoutputconfiguration";
import graphcontext from "./types/results/graphcontext";
import cumulativedonationsgraph from "./types/results/cumulativedonationsgraph";
import resultsoutput from "./types/results/resultsoutput";
import resultssection from "./types/results/resultssection";
import referralgraph from "./types/results/referralgraph";
import latex from "./types/latex";
import accordion from "./types/accordion";
import philantropicteaser from "./types/philantropicteaser";
import itncoverage from "./types/itncoverage";
import { pages } from "./pages/_pages";
import { dashboardpages } from "./dashboard/_dashboardPages";
import plausiblerevenuetracker from "./types/plausiblerevenuetracker";
import opendistributionbutton from "./types/opendistributionbutton";
import resultsheadline from "./types/results/resultsheadline";
import fundraiserchart from "./types/fundraiserchart";
import generalbanner from "./types/generalbanner";
import teamintroduction from "./types/teamintroduction";
import resultsteaser from "./types/resultsteaser";
import taxdeductionwidget from "./types/taxdeductionwidget";

const paymentMethods = [vipps, bank, swish, autogiro, avtalegiro] as const;

export const types = [
  category,
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
  generalbanner,
  splitview,
  splitviewhtml,
  teamintroduction,
  fullimage,
  blocktables,
  normalimage,
  column,
  columns,
  intervention,
  interventionwidget,
  interventionwidgetoutputconfiguration,
  taxdeductionwidget,
  testimonials,
  fullvideo,
  newslettersignup,
  htmlembed,
  donationwidget,
  quote,
  resultsteaser,
  citation,
  wealthcalculator,
  wealthcalculatorteaser,
  wealthcalculatorconfiguration,
  contributorlist,
  inngress,
  fundraiserchart,
  giveblock,
  givewellstamp,
  organizationslist,
  opendistributionbutton,
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
  discountratecomparison,
  graphcontext,
  cumulativedonationsgraph,
  resultsoutput,
  resultsheadline,
  resultssection,
  referralgraph,
  latex,
  accordion,
  philantropicteaser,
  itncoverage,
  plausiblerevenuetracker,
  teasers,
  teasersitem,
] as const;

// Then we give our schema to the builder and provide the result to Sanity
export const schemas: any[] = [
  ...pages,
  ...dashboardpages,
  ...types,
  ...paymentMethods,
  siteSettings,
  dashboard,
];
