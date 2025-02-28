import article from "./article";
import articles from "./articles";
import criteria from "./criteria";
import fundraiser from "./fundraiser";
import generic from "./generic";
import results from "./results";
import support from "./support";
import vippsagreement from "./vippsagreement";

export const pages = [
  generic,
  support,
  criteria,
  article,
  articles,
  results,
  vippsagreement,
  fundraiser,
] as const;
