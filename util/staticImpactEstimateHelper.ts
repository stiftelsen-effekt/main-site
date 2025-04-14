import { stegaClean } from "next-sanity";

/**
 * This function looks at page content and looks for docs with type organization
 * We find the impact estimates with the impact estimate API, and augment the content with the impact estimates
 */
export const augmentStaticImpactEstimates = async (
  content: ({ _type?: string } & any)[] | ({ _type?: string } & any),
  currency: string,
  locale: string,
) => {
  // Recursively loop over every single property in the content
  if (Array.isArray(content)) {
    for (const item of content) {
      if (item && typeof item === "object") {
        await augmentStaticImpactEstimates(item, currency, locale);
      }
    }
  } else if (content && typeof content === "object") {
    const keys = Object.keys(content);
    for (const key of keys) {
      if (content[key] && typeof content[key] === "object") {
        await augmentStaticImpactEstimates(content[key], currency, locale);
      } else if (key === "_type" && content[key] === "organization") {
        // We found an organization, let's get the impact estimate
        if (content["intervention"]) {
          const organizationAbreviation = content["intervention"]["abbreviation"];
          const impactEstimate = await getImpactEstimate(organizationAbreviation, currency, locale);
          content["impact_estimate"] = impactEstimate;
        }
      }
    }
  }

  return content;
};

const getImpactEstimate = async (
  organizationAbreviation: string,
  currency: string,
  language: string,
) => {
  const currentDate = new Date();

  const url = `https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=${stegaClean(
    organizationAbreviation,
  )}&currency=${stegaClean(currency)}&language=${stegaClean(
    language,
  )}&conversion_year=${currentDate.getFullYear()}&conversion_month=${currentDate.getMonth() + 1}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // If there are evaluations, sort them by start_year to get the most recent
    if (data.evaluations && data.evaluations.length > 0) {
      const orderedEvaluations = data.evaluations.sort(
        (a: any, b: any) => b.start_year - a.start_year,
      );
      return {
        evaluation: orderedEvaluations[0], // Return only the most recent evaluation
      };
    }

    // Return empty evaluations array if no evaluations found
    return null;
  } catch (error) {
    console.error("Error fetching impact estimate:", error);
    return null;
  }
};
