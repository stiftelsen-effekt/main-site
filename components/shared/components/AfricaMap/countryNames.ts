// Country name translations for African countries
export const countryNames: Record<string, Record<string, string>> = {
  ao: { no: "Angola", dk: "Angola", sv: "Angola" },
  bf: { no: "Burkina Faso", dk: "Burkina Faso", sv: "Burkina Faso" },
  bi: { no: "Burundi", dk: "Burundi", sv: "Burundi" },
  bj: { no: "Benin", dk: "Benin", sv: "Benin" },
  bw: { no: "Botswana", dk: "Botswana", sv: "Botswana" },
  cd: {
    no: "Den demokratiske republikken Kongo",
    dk: "Den Demokratiske Republik Congo",
    sv: "Demokratiska republiken Kongo",
  },
  cf: {
    no: "Den sentralafrikanske republikk",
    dk: "Den Centralafrikanske Republik",
    sv: "Centralafrikanska republiken",
  },
  cg: {
    no: "Republikken Kongo",
    dk: "Republikken Congo",
    sv: "Republiken Kongo",
  },
  ci: {
    no: "Elfenbenskysten",
    dk: "Elfenbenskysten",
    sv: "Elfenbenskusten",
  },
  cm: { no: "Kamerun", dk: "Cameroun", sv: "Kamerun" },
  cv: { no: "Kapp Verde", dk: "Kap Verde", sv: "Kap Verde" },
  dj: { no: "Djibouti", dk: "Djibouti", sv: "Djibouti" },
  dz: { no: "Algerie", dk: "Algeriet", sv: "Algeriet" },
  eg: { no: "Egypt", dk: "Egypten", sv: "Egypten" },
  er: { no: "Eritrea", dk: "Eritrea", sv: "Eritrea" },
  et: { no: "Etiopia", dk: "Etiopien", sv: "Etiopien" },
  ga: { no: "Gabon", dk: "Gabon", sv: "Gabon" },
  gh: { no: "Ghana", dk: "Ghana", sv: "Ghana" },
  gm: { no: "Gambia", dk: "Gambia", sv: "Gambia" },
  gn: { no: "Guinea", dk: "Guinea", sv: "Guinea" },
  gq: {
    no: "Ekvatorial-Guinea",
    dk: "Ækvatorialguinea",
    sv: "Ekvatorialguinea",
  },
  gw: { no: "Guinea-Bissau", dk: "Guinea-Bissau", sv: "Guinea-Bissau" },
  ke: { no: "Kenya", dk: "Kenya", sv: "Kenya" },
  km: { no: "Komorene", dk: "Comorerne", sv: "Komorerna" },
  lr: { no: "Liberia", dk: "Liberia", sv: "Liberia" },
  ls: { no: "Lesotho", dk: "Lesotho", sv: "Lesotho" },
  ly: { no: "Libya", dk: "Libyen", sv: "Libyen" },
  mg: { no: "Madagaskar", dk: "Madagaskar", sv: "Madagaskar" },
  ml: { no: "Mali", dk: "Mali", sv: "Mali" },
  mr: { no: "Mauritania", dk: "Mauretanien", sv: "Mauretanien" },
  mu: { no: "Mauritius", dk: "Mauritius", sv: "Mauritius" },
  mw: { no: "Malawi", dk: "Malawi", sv: "Malawi" },
  mz: { no: "Mosambik", dk: "Mozambique", sv: "Moçambique" },
  na: { no: "Namibia", dk: "Namibia", sv: "Namibia" },
  ne: { no: "Niger", dk: "Niger", sv: "Niger" },
  ng: { no: "Nigeria", dk: "Nigeria", sv: "Nigeria" },
  rw: { no: "Rwanda", dk: "Rwanda", sv: "Rwanda" },
  sc: { no: "Seychellene", dk: "Seychellerne", sv: "Seychellerna" },
  sd: { no: "Sudan", dk: "Sudan", sv: "Sudan" },
  sl: { no: "Sierra Leone", dk: "Sierra Leone", sv: "Sierra Leone" },
  sn: { no: "Senegal", dk: "Senegal", sv: "Senegal" },
  so: { no: "Somalia", dk: "Somalia", sv: "Somalia" },
  ss: { no: "Sør-Sudan", dk: "Sydsudan", sv: "Sydsudan" },
  st: {
    no: "São Tomé og Príncipe",
    dk: "São Tomé og Príncipe",
    sv: "São Tomé och Príncipe",
  },
  sz: { no: "Eswatini", dk: "Eswatini", sv: "Eswatini" },
  td: { no: "Tsjad", dk: "Tchad", sv: "Tchad" },
  tg: { no: "Togo", dk: "Togo", sv: "Togo" },
  tn: { no: "Tunisia", dk: "Tunesien", sv: "Tunisien" },
  tz: { no: "Tanzania", dk: "Tanzania", sv: "Tanzania" },
  ug: { no: "Uganda", dk: "Uganda", sv: "Uganda" },
  za: { no: "Sør-Afrika", dk: "Sydafrika", sv: "Sydafrika" },
  zm: { no: "Zambia", dk: "Zambia", sv: "Zambia" },
  zw: { no: "Zimbabwe", dk: "Zimbabwe", sv: "Zimbabwe" },
  _somaliland: { no: "Somaliland", dk: "Somaliland", sv: "Somaliland" },
};

/**
 * Converts full locale string (e.g., "no-NB", "sv-SE", "da-DK") to main locale code ("no", "sv", "dk")
 */
export const getMainLocale = (locale: string | undefined | null): "no" | "dk" | "sv" => {
  if (!locale) return "no";

  if (locale.startsWith("no")) return "no";
  if (locale.startsWith("da") || locale.startsWith("dk")) return "dk";
  if (locale.startsWith("sv")) return "sv";

  return "no"; // Default fallback
};

/**
 * Gets the localized country name for a given country code
 */
export const getCountryName = (countryCode: string, locale: string | undefined | null): string => {
  const mainLocale = getMainLocale(locale);
  const translations = countryNames[countryCode];

  if (!translations) {
    // Fallback: return the country code if translation not found
    return countryCode;
  }

  return translations[mainLocale] || translations.no || countryCode;
};
