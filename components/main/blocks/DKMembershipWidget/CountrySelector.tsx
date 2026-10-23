import { ChangeEventHandler } from "react";
import styles from "./CountrySelector.module.scss";

export const MembershipCountrySelector: React.FC<{
  country: string;
  onChange: (country: string) => void;
  countryLabel?: string;
  "data-cy"?: string;
}> = ({ country, onChange, countryLabel = "Country", "data-cy": dataCy }) => {
  return (
    <>
      <div className={styles.flag}>{getCountryFlag(country) || "🏳️"}</div>
      <input
        type="text"
        id="country"
        name="country"
        value={country}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={countryLabel}
        required
        list="country-list"
        style={{ paddingLeft: "1.75rem" }}
        data-cy={dataCy}
      />
      <datalist id="country-list">
        {COUNTRIES.map(([name]) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </>
  );
};

/**
 * The selectable countries with their ISO 3166-1 alpha-2 codes, in the
 * order they are listed. Kept as one table so the datalist and the flag
 * lookup share it.
 */
const COUNTRIES: [name: string, code: string][] = [
  ["Afghanistan", "AF"],
  ["Albania", "AL"],
  ["Algeria", "DZ"],
  ["Andorra", "AD"],
  ["Angola", "AO"],
  ["Antigua & Deps", "AG"],
  ["Argentina", "AR"],
  ["Armenia", "AM"],
  ["Australia", "AU"],
  ["Austria", "AT"],
  ["Azerbaijan", "AZ"],
  ["Bahamas", "BS"],
  ["Bahrain", "BH"],
  ["Bangladesh", "BD"],
  ["Barbados", "BB"],
  ["Belarus", "BY"],
  ["Belgium", "BE"],
  ["Belize", "BZ"],
  ["Benin", "BJ"],
  ["Bhutan", "BT"],
  ["Bolivia", "BO"],
  ["Bosnia Herzegovina", "BA"],
  ["Botswana", "BW"],
  ["Brazil", "BR"],
  ["Brunei", "BN"],
  ["Bulgaria", "BG"],
  ["Burkina", "BF"],
  ["Burundi", "BI"],
  ["Cambodia", "KH"],
  ["Cameroon", "CM"],
  ["Canada", "CA"],
  ["Cape Verde", "CV"],
  ["Central African Rep", "CF"],
  ["Chad", "TD"],
  ["Chile", "CL"],
  ["China", "CN"],
  ["Colombia", "CO"],
  ["Comoros", "KM"],
  ["Congo", "CG"],
  ["Congo {Democratic Rep}", "CD"],
  ["Costa Rica", "CR"],
  ["Croatia", "HR"],
  ["Cuba", "CU"],
  ["Cyprus", "CY"],
  ["Czech Republic", "CZ"],
  ["Denmark", "DK"],
  ["Djibouti", "DJ"],
  ["Dominica", "DM"],
  ["Dominican Republic", "DO"],
  ["East Timor", "TL"],
  ["Ecuador", "EC"],
  ["Egypt", "EG"],
  ["El Salvador", "SV"],
  ["Equatorial Guinea", "GQ"],
  ["Eritrea", "ER"],
  ["Estonia", "EE"],
  ["Ethiopia", "ET"],
  ["Fiji", "FJ"],
  ["Finland", "FI"],
  ["France", "FR"],
  ["Gabon", "GA"],
  ["Gambia", "GM"],
  ["Georgia", "GE"],
  ["Germany", "DE"],
  ["Ghana", "GH"],
  ["Greece", "GR"],
  ["Grenada", "GD"],
  ["Guatemala", "GT"],
  ["Guinea", "GN"],
  ["Guinea-Bissau", "GW"],
  ["Guyana", "GY"],
  ["Haiti", "HT"],
  ["Honduras", "HN"],
  ["Hungary", "HU"],
  ["Iceland", "IS"],
  ["India", "IN"],
  ["Indonesia", "ID"],
  ["Iran", "IR"],
  ["Iraq", "IQ"],
  ["Ireland {Republic}", "IE"],
  ["Israel", "IL"],
  ["Italy", "IT"],
  ["Ivory Coast", "CI"],
  ["Jamaica", "JM"],
  ["Japan", "JP"],
  ["Jordan", "JO"],
  ["Kazakhstan", "KZ"],
  ["Kenya", "KE"],
  ["Kiribati", "KI"],
  ["Korea North", "KP"],
  ["Korea South", "KR"],
  ["Kosovo", "XK"],
  ["Kuwait", "KW"],
  ["Kyrgyzstan", "KG"],
  ["Laos", "LA"],
  ["Latvia", "LV"],
  ["Lebanon", "LB"],
  ["Lesotho", "LS"],
  ["Liberia", "LR"],
  ["Libya", "LY"],
  ["Liechtenstein", "LI"],
  ["Lithuania", "LT"],
  ["Luxembourg", "LU"],
  ["Macedonia", "MK"],
  ["Madagascar", "MG"],
  ["Malawi", "MW"],
  ["Malaysia", "MY"],
  ["Maldives", "MV"],
  ["Mali", "ML"],
  ["Malta", "MT"],
  ["Marshall Islands", "MH"],
  ["Mauritania", "MR"],
  ["Mauritius", "MU"],
  ["Mexico", "MX"],
  ["Micronesia", "FM"],
  ["Moldova", "MD"],
  ["Monaco", "MC"],
  ["Mongolia", "MN"],
  ["Montenegro", "ME"],
  ["Morocco", "MA"],
  ["Mozambique", "MZ"],
  ["Myanmar, {Burma}", "MM"],
  ["Namibia", "NA"],
  ["Nauru", "NR"],
  ["Nepal", "NP"],
  ["Netherlands", "NL"],
  ["New Zealand", "NZ"],
  ["Nicaragua", "NI"],
  ["Niger", "NE"],
  ["Nigeria", "NG"],
  ["Norway", "NO"],
  ["Oman", "OM"],
  ["Pakistan", "PK"],
  ["Palau", "PW"],
  ["Panama", "PA"],
  ["Papua New Guinea", "PG"],
  ["Paraguay", "PY"],
  ["Peru", "PE"],
  ["Philippines", "PH"],
  ["Poland", "PL"],
  ["Portugal", "PT"],
  ["Qatar", "QA"],
  ["Romania", "RO"],
  ["Russian Federation", "RU"],
  ["Rwanda", "RW"],
  ["St Kitts & Nevis", "KN"],
  ["St Lucia", "LC"],
  ["Saint Vincent & the Grenadines", "VC"],
  ["Samoa", "WS"],
  ["San Marino", "SM"],
  ["Sao Tome & Principe", "ST"],
  ["Saudi Arabia", "SA"],
  ["Senegal", "SN"],
  ["Serbia", "RS"],
  ["Seychelles", "SC"],
  ["Sierra Leone", "SL"],
  ["Singapore", "SG"],
  ["Slovakia", "SK"],
  ["Slovenia", "SI"],
  ["Solomon Islands", "SB"],
  ["Somalia", "SO"],
  ["South Africa", "ZA"],
  ["South Sudan", "SS"],
  ["Spain", "ES"],
  ["Sri Lanka", "LK"],
  ["Sudan", "SD"],
  ["Suriname", "SR"],
  ["Swaziland", "SZ"],
  ["Sweden", "SE"],
  ["Switzerland", "CH"],
  ["Syria", "SY"],
  ["Taiwan", "TW"],
  ["Tajikistan", "TJ"],
  ["Tanzania", "TZ"],
  ["Thailand", "TH"],
  ["Togo", "TG"],
  ["Tonga", "TO"],
  ["Trinidad & Tobago", "TT"],
  ["Tunisia", "TN"],
  ["Turkey", "TR"],
  ["Turkmenistan", "TM"],
  ["Tuvalu", "TV"],
  ["Uganda", "UG"],
  ["Ukraine", "UA"],
  ["United Arab Emirates", "AE"],
  ["United Kingdom", "GB"],
  ["United States", "US"],
  ["Uruguay", "UY"],
  ["Uzbekistan", "UZ"],
  ["Vanuatu", "VU"],
  ["Vatican City", "VA"],
  ["Venezuela", "VE"],
  ["Vietnam", "VN"],
  ["Yemen", "YE"],
  ["Zambia", "ZM"],
  ["Zimbabwe", "ZW"],
];

/** Turns an ISO 3166-1 alpha-2 code into its flag emoji, e.g. "CA" into "🇨🇦" */
const codeToFlag = (code: string) =>
  String.fromCodePoint(...Array.from(code, (char) => 0x1f1e6 + char.charCodeAt(0) - 65));

/** Returns the flag emoji for one of the listed country names, if any */
function getCountryFlag(country: string): string | undefined {
  const match = COUNTRIES.find(([name]) => name === country);
  return match ? codeToFlag(match[1]) : undefined;
}
