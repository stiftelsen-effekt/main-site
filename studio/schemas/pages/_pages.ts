import article from "./article";
import articles from "./articles";
import criteria from "./criteria";
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
] as const;
