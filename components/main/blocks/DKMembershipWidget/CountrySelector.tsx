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
      <div className={styles.flag}>{getCountryFlagMap()[country] || "🏳️"}</div>
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
        <option value="Afghanistan" />
        <option value="Albania" />
        <option value="Algeria" />
        <option value="Andorra" />
        <option value="Angola" />
        <option value="Antigua & Deps" />
        <option value="Argentina" />
        <option value="Armenia" />
        <option value="Australia" />
        <option value="Austria" />
        <option value="Azerbaijan" />
        <option value="Bahamas" />
        <option value="Bahrain" />
        <option value="Bangladesh" />
        <option value="Barbados" />
        <option value="Belarus" />
        <option value="Belgium" />
        <option value="Belize" />
        <option value="Benin" />
        <option value="Bhutan" />
        <option value="Bolivia" />
        <option value="Bosnia Herzegovina" />
        <option value="Botswana" />
        <option value="Brazil" />
        <option value="Brunei" />
        <option value="Bulgaria" />
        <option value="Burkina" />
        <option value="Burundi" />
        <option value="Cambodia" />
        <option value="Cameroon" />
        <option value="Canada" />
        <option value="Cape Verde" />
        <option value="Central African Rep" />
        <option value="Chad" />
        <option value="Chile" />
        <option value="China" />
        <option value="Colombia" />
        <option value="Comoros" />
        <option value="Congo" />
        <option value="Congo {Democratic Rep}" />
        <option value="Costa Rica" />
        <option value="Croatia" />
        <option value="Cuba" />
        <option value="Cyprus" />
        <option value="Czech Republic" />
        <option value="Denmark" />
        <option value="Djibouti" />
        <option value="Dominica" />
        <option value="Dominican Republic" />
        <option value="East Timor" />
        <option value="Ecuador" />
        <option value="Egypt" />
        <option value="El Salvador" />
        <option value="Equatorial Guinea" />
        <option value="Eritrea" />
        <option value="Estonia" />
        <option value="Ethiopia" />
        <option value="Fiji" />
        <option value="Finland" />
        <option value="France" />
        <option value="Gabon" />
        <option value="Gambia" />
        <option value="Georgia" />
        <option value="Germany" />
        <option value="Ghana" />
        <option value="Greece" />
        <option value="Grenada" />
        <option value="Guatemala" />
        <option value="Guinea" />
        <option value="Guinea-Bissau" />
        <option value="Guyana" />
        <option value="Haiti" />
        <option value="Honduras" />
        <option value="Hungary" />
        <option value="Iceland" />
        <option value="India" />
        <option value="Indonesia" />
        <option value="Iran" />
        <option value="Iraq" />
        <option value="Ireland {Republic}" />
        <option value="Israel" />
        <option value="Italy" />
        <option value="Ivory Coast" />
        <option value="Jamaica" />
        <option value="Japan" />
        <option value="Jordan" />
        <option value="Kazakhstan" />
        <option value="Kenya" />
        <option value="Kiribati" />
        <option value="Korea North" />
        <option value="Korea South" />
        <option value="Kosovo" />
        <option value="Kuwait" />
        <option value="Kyrgyzstan" />
        <option value="Laos" />
        <option value="Latvia" />
        <option value="Lebanon" />
        <option value="Lesotho" />
        <option value="Liberia" />
        <option value="Libya" />
        <option value="Liechtenstein" />
        <option value="Lithuania" />
        <option value="Luxembourg" />
        <option value="Macedonia" />
        <option value="Madagascar" />
        <option value="Malawi" />
        <option value="Malaysia" />
        <option value="Maldives" />
        <option value="Mali" />
        <option value="Malta" />
        <option value="Marshall Islands" />
        <option value="Mauritania" />
        <option value="Mauritius" />
        <option value="Mexico" />
        <option value="Micronesia" />
        <option value="Moldova" />
        <option value="Monaco" />
        <option value="Mongolia" />
        <option value="Montenegro" />
        <option value="Morocco" />
        <option value="Mozambique" />
        <option value="Myanmar, {Burma}" />
        <option value="Namibia" />
        <option value="Nauru" />
        <option value="Nepal" />
        <option value="Netherlands" />
        <option value="New Zealand" />
        <option value="Nicaragua" />
        <option value="Niger" />
        <option value="Nigeria" />
        <option value="Norway" />
        <option value="Oman" />
        <option value="Pakistan" />
        <option value="Palau" />
        <option value="Panama" />
        <option value="Papua New Guinea" />
        <option value="Paraguay" />
        <option value="Peru" />
        <option value="Philippines" />
        <option value="Poland" />
        <option value="Portugal" />
        <option value="Qatar" />
        <option value="Romania" />
        <option value="Russian Federation" />
        <option value="Rwanda" />
        <option value="St Kitts & Nevis" />
        <option value="St Lucia" />
        <option value="Saint Vincent & the Grenadines" />
        <option value="Samoa" />
        <option value="San Marino" />
        <option value="Sao Tome & Principe" />
        <option value="Saudi Arabia" />
        <option value="Senegal" />
        <option value="Serbia" />
        <option value="Seychelles" />
        <option value="Sierra Leone" />
        <option value="Singapore" />
        <option value="Slovakia" />
        <option value="Slovenia" />
        <option value="Solomon Islands" />
        <option value="Somalia" />
        <option value="South Africa" />
        <option value="South Sudan" />
        <option value="Spain" />
        <option value="Sri Lanka" />
        <option value="Sudan" />
        <option value="Suriname" />
        <option value="Swaziland" />
        <option value="Sweden" />
        <option value="Switzerland" />
        <option value="Syria" />
        <option value="Taiwan" />
        <option value="Tajikistan" />
        <option value="Tanzania" />
        <option value="Thailand" />
        <option value="Togo" />
        <option value="Tonga" />
        <option value="Trinidad & Tobago" />
        <option value="Tunisia" />
        <option value="Turkey" />
        <option value="Turkmenistan" />
        <option value="Tuvalu" />
        <option value="Uganda" />
        <option value="Ukraine" />
        <option value="United Arab Emirates" />
        <option value="United Kingdom" />
        <option value="United States" />
        <option value="Uruguay" />
        <option value="Uzbekistan" />
        <option value="Vanuatu" />
        <option value="Vatican City" />
        <option value="Venezuela" />
        <option value="Vietnam" />
        <option value="Yemen" />
        <option value="Zambia" />
        <option value="Zimbabwe" />
      </datalist>
    </>
  );
};

/**
 * Returns a map of specified country names to their corresponding flag emojis.
 * The country list is based on a predefined set of 195 countries.
 *
 * @returns A Record<string, string> where keys are country names (e.g., "Canada")
 * and values are their flag emojis (e.g., "🇨🇦").
 */
function getCountryFlagMap(): Record<string, string> {
  return {
    Afghanistan: "🇦🇫", // AF
    Albania: "🇦🇱", // AL
    Algeria: "🇩🇿", // DZ
    Andorra: "🇦🇩", // AD
    Angola: "🇦🇴", // AO
    "Antigua & Deps": "🇦🇬", // AG
    Argentina: "🇦🇷", // AR
    Armenia: "🇦🇲", // AM
    Australia: "🇦🇺", // AU
    Austria: "🇦🇹", // AT
    Azerbaijan: "🇦🇿", // AZ
    Bahamas: "🇧🇸", // BS
    Bahrain: "🇧🇭", // BH
    Bangladesh: "🇧🇩", // BD
    Barbados: "🇧🇧", // BB
    Belarus: "🇧🇾", // BY
    Belgium: "🇧🇪", // BE
    Belize: "🇧🇿", // BZ
    Benin: "🇧🇯", // BJ
    Bhutan: "🇧🇹", // BT
    Bolivia: "🇧🇴", // BO
    "Bosnia Herzegovina": "🇧🇦", // BA
    Botswana: "🇧🇼", // BW
    Brazil: "🇧🇷", // BR
    Brunei: "🇧🇳", // BN
    Bulgaria: "🇧🇬", // BG
    Burkina: "🇧🇫", // BF
    Burundi: "🇧🇮", // BI
    Cambodia: "🇰🇭", // KH
    Cameroon: "🇨🇲", // CM
    Canada: "🇨🇦", // CA
    "Cape Verde": "🇨🇻", // CV
    "Central African Rep": "🇨🇫", // CF
    Chad: "🇹🇩", // TD
    Chile: "🇨🇱", // CL
    China: "🇨🇳", // CN
    Colombia: "🇨🇴", // CO
    Comoros: "🇰🇲", // KM
    Congo: "🇨🇬", // CG
    "Congo {Democratic Rep}": "🇨🇩", // CD
    "Costa Rica": "🇨🇷", // CR
    Croatia: "🇭🇷", // HR
    Cuba: "🇨🇺", // CU
    Cyprus: "🇨🇾", // CY
    "Czech Republic": "🇨🇿", // CZ
    Denmark: "🇩🇰", // DK
    Djibouti: "🇩🇯", // DJ
    Dominica: "🇩🇲", // DM
    "Dominican Republic": "🇩🇴", // DO
    "East Timor": "🇹🇱", // TL
    Ecuador: "🇪🇨", // EC
    Egypt: "🇪🇬", // EG
    "El Salvador": "🇸🇻", // SV
    "Equatorial Guinea": "🇬🇶", // GQ
    Eritrea: "🇪🇷", // ER
    Estonia: "🇪🇪", // EE
    Ethiopia: "🇪🇹", // ET
    Fiji: "🇫🇯", // FJ
    Finland: "🇫🇮", // FI
    France: "🇫🇷", // FR
    Gabon: "🇬🇦", // GA
    Gambia: "🇬🇲", // GM
    Georgia: "🇬🇪", // GE
    Germany: "🇩🇪", // DE
    Ghana: "🇬🇭", // GH
    Greece: "🇬🇷", // GR
    Grenada: "🇬🇩", // GD
    Guatemala: "🇬🇹", // GT
    Guinea: "🇬🇳", // GN
    "Guinea-Bissau": "🇬🇼", // GW
    Guyana: "🇬🇾", // GY
    Haiti: "🇭🇹", // HT
    Honduras: "🇭🇳", // HN
    Hungary: "🇭🇺", // HU
    Iceland: "🇮🇸", // IS
    India: "🇮🇳", // IN
    Indonesia: "🇮🇩", // ID
    Iran: "🇮🇷", // IR
    Iraq: "🇮🇶", // IQ
    "Ireland {Republic}": "🇮🇪", // IE
    Israel: "🇮🇱", // IL
    Italy: "🇮🇹", // IT
    "Ivory Coast": "🇨🇮", // CI
    Jamaica: "🇯🇲", // JM
    Japan: "🇯🇵", // JP
    Jordan: "🇯🇴", // JO
    Kazakhstan: "🇰🇿", // KZ
    Kenya: "🇰🇪", // KE
    Kiribati: "🇰🇮", // KI
    "Korea North": "🇰🇵", // KP
    "Korea South": "🇰🇷", // KR
    Kosovo: "🇽🇰", // XK (Note: Kosovo's flag emoji might not render on all platforms)
    Kuwait: "🇰🇼", // KW
    Kyrgyzstan: "🇰🇬", // KG
    Laos: "🇱🇦", // LA
    Latvia: "🇱🇻", // LV
    Lebanon: "🇱🇧", // LB
    Lesotho: "🇱🇸", // LS
    Liberia: "🇱🇷", // LR
    Libya: "🇱🇾", // LY
    Liechtenstein: "🇱🇮", // LI
    Lithuania: "🇱🇹", // LT
    Luxembourg: "🇱🇺", // LU
    Macedonia: "🇲🇰", // MK (North Macedonia)
    Madagascar: "🇲🇬", // MG
    Malawi: "🇲🇼", // MW
    Malaysia: "🇲🇾", // MY
    Maldives: "🇲🇻", // MV
    Mali: "🇲🇱", // ML
    Malta: "🇲🇹", // MT
    "Marshall Islands": "🇲🇭", // MH
    Mauritania: "🇲🇷", // MR
    Mauritius: "🇲🇺", // MU
    Mexico: "🇲🇽", // MX
    Micronesia: "🇫🇲", // FM
    Moldova: "🇲🇩", // MD
    Monaco: "🇲🇨", // MC
    Mongolia: "🇲🇳", // MN
    Montenegro: "🇲🇪", // ME
    Morocco: "🇲🇦", // MA
    Mozambique: "🇲🇿", // MZ
    "Myanmar, {Burma}": "🇲🇲", // MM
    Namibia: "🇳🇦", // NA
    Nauru: "🇳🇷", // NR
    Nepal: "🇳🇵", // NP
    Netherlands: "🇳🇱", // NL
    "New Zealand": "🇳🇿", // NZ
    Nicaragua: "🇳🇮", // NI
    Niger: "🇳🇪", // NE
    Nigeria: "🇳🇬", // NG
    Norway: "🇳🇴", // NO
    Oman: "🇴🇲", // OM
    Pakistan: "🇵🇰", // PK
    Palau: "🇵🇼", // PW
    Panama: "🇵🇦", // PA
    "Papua New Guinea": "🇵🇬", // PG
    Paraguay: "🇵🇾", // PY
    Peru: "🇵🇪", // PE
    Philippines: "🇵🇭", // PH
    Poland: "🇵🇱", // PL
    Portugal: "🇵🇹", // PT
    Qatar: "🇶🇦", // QA
    Romania: "🇷🇴", // RO
    "Russian Federation": "🇷🇺", // RU
    Rwanda: "🇷🇼", // RW
    "St Kitts & Nevis": "🇰🇳", // KN
    "St Lucia": "🇱🇨", // LC
    "Saint Vincent & the Grenadines": "🇻🇨", // VC
    Samoa: "🇼🇸", // WS
    "San Marino": "🇸🇲", // SM
    "Sao Tome & Principe": "🇸🇹", // ST
    "Saudi Arabia": "🇸🇦", // SA
    Senegal: "🇸🇳", // SN
    Serbia: "🇷🇸", // RS
    Seychelles: "🇸🇨", // SC
    "Sierra Leone": "🇸🇱", // SL
    Singapore: "🇸🇬", // SG
    Slovakia: "🇸🇰", // SK
    Slovenia: "🇸🇮", // SI
    "Solomon Islands": "🇸🇧", // SB
    Somalia: "🇸🇴", // SO
    "South Africa": "🇿🇦", // ZA
    "South Sudan": "🇸🇸", // SS
    Spain: "🇪🇸", // ES
    "Sri Lanka": "🇱🇰", // LK
    Sudan: "🇸🇩", // SD
    Suriname: "🇸🇷", // SR
    Swaziland: "🇸🇿", // SZ (Eswatini)
    Sweden: "🇸🇪", // SE
    Switzerland: "🇨🇭", // CH
    Syria: "🇸🇾", // SY
    Taiwan: "🇹🇼", // TW
    Tajikistan: "🇹🇯", // TJ
    Tanzania: "🇹🇿", // TZ
    Thailand: "🇹🇭", // TH
    Togo: "🇹🇬", // TG
    Tonga: "🇹🇴", // TO
    "Trinidad & Tobago": "🇹🇹", // TT
    Tunisia: "🇹🇳", // TN
    Turkey: "🇹🇷", // TR
    Turkmenistan: "🇹🇲", // TM
    Tuvalu: "🇹🇻", // TV
    Uganda: "🇺🇬", // UG
    Ukraine: "🇺🇦", // UA
    "United Arab Emirates": "🇦🇪", // AE
    "United Kingdom": "🇬🇧", // GB
    "United States": "🇺🇸", // US
    Uruguay: "🇺🇾", // UY
    Uzbekistan: "🇺🇿", // UZ
    Vanuatu: "🇻🇺", // VU
    "Vatican City": "🇻🇦", // VA
    Venezuela: "🇻🇪", // VE
    Vietnam: "🇻🇳", // VN
    Yemen: "🇾🇪", // YE
    Zambia: "🇿🇲", // ZM
    Zimbabwe: "🇿🇼", // ZW
  };
}
