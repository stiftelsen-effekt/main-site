// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";
import contributor from "./types/contributor";
import keyPoint from "./types/key-point";
import organization from "./types/organization";
import role from "./types/role";
import testimonial from "./types/testimonial";
import teaser from "./types/teaser";
import pointlist from "./types/pointlist";
import introsection from "./types/introsection";
import siteSettings from "./siteSettings";
import link from "./types/link";
import navitem from "./types/navitem";
import navgroup from "./types/navgroup";
import pageheader from "./types/pageheader";
import questionandanswer from "./types/questionandanswer";
import questionandanswergroup from "./types/questionandanswergroup";
import frontpage from "./pages/frontpage";
import organizations from "./pages/organizations";
import about from "./pages/about";
import profile from "./pages/profile";
import support from "./pages/support";
import generic from "./pages/generic";
import contactinfo from "./types/contactinfo";
import videoembed from "./types/videoembed";
import contentsection from "./types/contentsection";
import criteria from "./pages/criteria";
import paragraph from "./types/paragraph";
import pointlistpoint from "./types/pointlistpoint";
import links from "./types/links";
import article from "./pages/article";

export const pages = [
  generic,
  frontpage,
  organizations,
  about,
  profile,
  support,
  criteria,
  article,
];

export const types = [
  teaser,
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
  questionandanswer,
  questionandanswergroup,
  contactinfo,
  videoembed,
  contentsection,
  paragraph,
];

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat(pages, types, [siteSettings]),
});
