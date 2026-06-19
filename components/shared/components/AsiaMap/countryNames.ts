// Country name translations for Asian countries
export const countryNames: Record<string, Record<string, string>> = {
  af: { no: "Afghanistan", dk: "Afghanistan", sv: "Afghanistan" },
  am: { no: "Armenia", dk: "Armenien", sv: "Armenien" },
  az: { no: "Aserbajdsjan", dk: "Aserbajdsjan", sv: "Azerbajdzjan" },
  bh: { no: "Bahrain", dk: "Bahrain", sv: "Bahrain" },
  bd: { no: "Bangladesh", dk: "Bangladesh", sv: "Bangladesh" },
  bn: { no: "Brunei", dk: "Brunei", sv: "Brunei" },
  bt: { no: "Bhutan", dk: "Bhutan", sv: "Bhutan" },
  cn: { no: "Kina", dk: "Kina", sv: "Kina" },
  cy: { no: "Kypros", dk: "Cypern", sv: "Cypern" },
  ge: { no: "Georgia", dk: "Georgien", sv: "Georgien" },
  id: { no: "Indonesia", dk: "Indonesien", sv: "Indonesien" },
  il: { no: "Israel", dk: "Israel", sv: "Israel" },
  in: { no: "India", dk: "Indien", sv: "Indien" },
  iq: { no: "Irak", dk: "Irak", sv: "Irak" },
  ir: { no: "Iran", dk: "Iran", sv: "Iran" },
  jp: { no: "Japan", dk: "Japan", sv: "Japan" },
  jo: { no: "Jordan", dk: "Jordan", sv: "Jordanien" },
  kz: { no: "Kasakhstan", dk: "Kasakhstan", sv: "Kazakstan" },
  kp: { no: "Nord-Korea", dk: "Nordkorea", sv: "Nordkorea" },
  kr: { no: "Sør-Korea", dk: "Sydkorea", sv: "Sydkorea" },
  kw: { no: "Kuwait", dk: "Kuwait", sv: "Kuwait" },
  kg: { no: "Kirgisistan", dk: "Kirgisistan", sv: "Kirgizistan" },
  la: { no: "Laos", dk: "Laos", sv: "Laos" },
  lb: { no: "Libanon", dk: "Libanon", sv: "Libanon" },
  my: { no: "Malaysia", dk: "Malaysia", sv: "Malaysia" },
  mv: { no: "Maldivene", dk: "Maldiverne", sv: "Maldiverna" },
  mn: { no: "Mongolia", dk: "Mongoliet", sv: "Mongoliet" },
  mm: { no: "Myanmar", dk: "Myanmar", sv: "Myanmar" },
  np: { no: "Nepal", dk: "Nepal", sv: "Nepal" },
  om: { no: "Oman", dk: "Oman", sv: "Oman" },
  pk: { no: "Pakistan", dk: "Pakistan", sv: "Pakistan" },
  ph: { no: "Filippinene", dk: "Filippinerne", sv: "Filippinerna" },
  qa: { no: "Qatar", dk: "Qatar", sv: "Qatar" },
  ru: { no: "Russland", dk: "Rusland", sv: "Ryssland" },
  sa: { no: "Saudi-Arabia", dk: "Saudi-Arabien", sv: "Saudiarabien" },
  sg: { no: "Singapore", dk: "Singapore", sv: "Singapore" },
  lk: { no: "Sri Lanka", dk: "Sri Lanka", sv: "Sri Lanka" },
  sy: { no: "Syria", dk: "Syrien", sv: "Syrien" },
  tj: { no: "Tadsjikistan", dk: "Tadsjikistan", sv: "Tadzjikistan" },
  th: { no: "Thailand", dk: "Thailand", sv: "Thailand" },
  tl: { no: "Øst-Timor", dk: "Østtimor", sv: "Östtimor" },
  tm: { no: "Turkmenistan", dk: "Turkmenistan", sv: "Turkmenistan" },
  tr: { no: "Tyrkia", dk: "Tyrkiet", sv: "Turkiet" },
  tw: { no: "Taiwan", dk: "Taiwan", sv: "Taiwan" },
  ae: {
    no: "De forente arabiske emirater",
    dk: "De Forenede Arabiske Emirater",
    sv: "Förenade Arabemiraten",
  },
  uz: { no: "Usbekistan", dk: "Usbekistan", sv: "Uzbekistan" },
  vn: { no: "Vietnam", dk: "Vietnam", sv: "Vietnam" },
  ye: { no: "Jemen", dk: "Yemen", sv: "Jemen" },
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
