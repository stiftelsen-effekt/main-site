import { JsonLdMeta } from "../../../models";

export const JsonLd: React.FC<JsonLdMeta> = ({
  name,
  description,
  url,
  logo,
  email,
  sameAs,
  country,
}) => {
  const ngo = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name,
    description,
    url,
    logo,
    email,
    sameAs,
    areaServed: {
      "@type": "Country",
      name: country || "NO",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ngo).replace(/</g, "\\u003c"),
      }}
    />
  );
};
