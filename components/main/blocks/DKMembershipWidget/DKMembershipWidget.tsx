import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./DKMembershipWidget.module.scss";
import { cprChecksumTest } from "./_util";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";

// --- Helper Functions ---
// Basic CPR validation (can be expanded with checksum logic)
interface CprValidationResult {
  isValid: boolean;
  isSuspicious: boolean;
  message?: string;
}

const validateCpr = (cpr: string): CprValidationResult => {
  if (cprChecksumTest(cpr)) {
    return { isValid: true, isSuspicious: false };
  }

  const cleanedCpr = cpr.replace(/-/g, "");
  if (!/^\d{10}$/.test(cleanedCpr)) {
    return { isValid: false, isSuspicious: false, message: "CPR must be 10 digits." };
  }

  return { isValid: false, isSuspicious: true, message: "Suspicious CPR number." };
};

// --- Types ---
interface MembershipFormData {
  country: string;
  name: string;
  email: string;
  address: string;
  postcode: string;
  city: string;
  tin: string; // Tax Identification Number (CPR for Denmark)
  birthday: string; // YYYY-MM-DD, only if country is not Denmark
}

interface MembershipFormTexts {
  countryLabel: string;
  nameLabel: string;
  emailLabel: string;
  addressLabel: string;
  postcodeLabel: string;
  cityLabel: string;
  tinLabel: string;
  tinDenmarkLabel: string;
  birthdayLabel: string;
  submitButtonText: string;
  cprSuspiciousMessage: string;
  cprInvalidMessage: string;
  fieldRequiredMessage: string;
  submittingMessage: string;
}

interface MembershipFormWidgetProps {
  texts?: Partial<MembershipFormTexts>;
  membershipFeeText?: string; // e.g., "Pay 50 DKK per year"
}

const API_ENDPOINT = `/api/proxy?targetUrl=${encodeURIComponent(
  "https://donation-platform-info-giveffektivt-giv-effektivts-projects.vercel.app/api/membership",
)}`;

export const DKMembershipWidget: React.FC<MembershipFormWidgetProps> = ({
  texts = {},
  membershipFeeText = "Become a Member",
}) => {
  const defaultTexts: MembershipFormTexts = {
    countryLabel: "Country",
    nameLabel: "Full name",
    emailLabel: "Email (for receipt)",
    addressLabel: "Address",
    postcodeLabel: "Postcode",
    cityLabel: "City",
    tinLabel: "Tax ID",
    tinDenmarkLabel: "CPR (Tax ID for Denmark)",
    birthdayLabel: "Birthday (yyyy-mm-dd)",
    submitButtonText: "Submit Membership",
    cprSuspiciousMessage: "Kontroller venligst at det er korrekt.",
    cprInvalidMessage: "Invalid CPR number. Please check.",
    fieldRequiredMessage: "This field is required.",
    submittingMessage: "Submitting...",
  };

  const mergedTexts = { ...defaultTexts, ...texts };

  const [formData, setFormData] = useState<MembershipFormData>({
    country: "Norway", // Default country
    name: "Håkon Harnes",
    email: "account@harnes.me",
    address: "Nygata 10A",
    postcode: "7014",
    city: "Trondheim",
    tin: "220696-0000",
    birthday: "1996-06-22",
  });

  const [cprValidation, setCprValidation] = useState<CprValidationResult | null>(null);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof MembershipFormData, string> & { _general: string }>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const isDenmarkSelected = /^(denmark|danmark)$/i.test(formData.country.trim());
  const showBirthdayField = !isDenmarkSelected;

  useEffect(() => {
    // Clear TIN and Birthday if country changes to/from Denmark
    if (isDenmarkSelected) {
      setFormData((prev) => ({ ...prev, birthday: "" }));
    } else {
      setFormData((prev) => ({ ...prev, tin: "" }));
      setCprValidation(null);
    }
  }, [isDenmarkSelected]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof MembershipFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCprChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const digits = value.replace(/\D/g, "");

    let formattedCpr = "";
    if (isDenmarkSelected) {
      if (digits.length > 0) {
        formattedCpr = digits.substring(0, Math.min(6, digits.length));
      }
      if (digits.length > 6) {
        formattedCpr += "-" + digits.substring(6, Math.min(10, digits.length));
      }
    } else {
      formattedCpr = value;
    }

    setFormData((prev) => ({ ...prev, tin: formattedCpr }));

    const finalDigits = formattedCpr.replace(/-/g, "");
    if (finalDigits.length === 10) {
      const validationResult = validateCpr(formattedCpr);
      setCprValidation(validationResult);
    } else if (finalDigits.length > 0) {
      // Clear if not yet 10 digits but user is typing
      setCprValidation(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const payload: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      postcode: formData.postcode.trim(),
      city: formData.city.trim(),
      country: /^(denmark|danmark)$/i.test(formData.country.trim())
        ? "Denmark"
        : formData.country.trim(),
      tin: formData.tin.trim(),
      birthday: formData.birthday.trim(),
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.redirect) {
          window.open(responseData.redirect, "_self");
        } else {
          console.log(
            "Membership submitted successfully, but no redirect URL provided.",
            responseData,
          );
          console.error("Unexpected response format:", responseData);
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Submission failed with status: " + response.status }));
        console.error("Submission error:", errorData);
      }
    } catch (error) {
      console.error("Network or other error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.flag}>{getCountryFlagMap()[formData.country] || "🏳️"}</div>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder={mergedTexts.countryLabel}
            required
            list="country-list"
            style={{ paddingLeft: "1.75rem" }}
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
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={mergedTexts.nameLabel}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={mergedTexts.emailLabel}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={mergedTexts.addressLabel}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            placeholder={mergedTexts.postcodeLabel}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder={mergedTexts.cityLabel}
            required
          />
        </div>

        <div className={styles.formGroup}>
          {/**
           * If the country is Denmark, we use CPR (CPR number) as TIN.
           * We can set a pattern that is impossible to match if the
           * manual CPR validation variable is set to false, and a message
           * to inform the user that the CPR number is invalid
           */}
          <input
            type="text"
            id="tin"
            name="tin"
            value={formData.tin}
            onChange={handleCprChange}
            placeholder={isDenmarkSelected ? mergedTexts.tinDenmarkLabel : mergedTexts.tinLabel}
            maxLength={isDenmarkSelected ? 12 : undefined}
            pattern={isDenmarkSelected ? "\\d{6}-\\d{4}" : undefined}
            title={isDenmarkSelected ? "Format: DDMMYY-SSSS" : undefined}
            required={true}
          />
          {cprValidation && cprValidation.isSuspicious && (
            <div className={styles.warningMessage}>{mergedTexts.cprSuspiciousMessage}</div>
          )}
        </div>

        {showBirthdayField && (
          <div className={styles.formGroup}>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              placeholder="YYYY-MM-DD"
              maxLength={10}
              required={showBirthdayField}
              lang="no-NB"
            />
          </div>
        )}

        <EffektButton disabled={loading} type="submit" className={styles.submitButton}>
          {loading ? <Spinner className={styles.submitSpinner} /> : membershipFeeText}
        </EffektButton>
      </form>
    </div>
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
