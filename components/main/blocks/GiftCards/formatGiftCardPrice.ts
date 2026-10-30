import { getFormattingLocale, thousandize } from "../../../../util/formatting";

/**
 * Formats a gift card price with the site's locale and currency (site_settings
 * main_locale / main_currency), e.g. "1 500 kr" (NO/SE), "1.500 kr." (DK).
 * Falls back to "<number> kr" when the currency is missing or not a valid code.
 */
export const formatGiftCardPrice = (
  price: number,
  mainLocale?: string | null,
  currency?: string | null,
): string => {
  const locale = getFormattingLocale(mainLocale);
  if (currency) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(price);
    } catch {
      // Invalid currency code: fall through to the default.
    }
  }
  return `${thousandize(price, locale)} kr`;
};
