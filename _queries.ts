import { User } from "@auth0/auth0-react";
import useSWR from "swr";
import { apiResult, getAccessTokenSilently, useApi } from "./hooks/useApi";
import { DistributionCauseArea, TaxUnit } from "./models";
import { getUserId } from "./lib/user";
import { CauseArea } from "./components/shared/components/Widget/types/CauseArea";

export interface Query<T> {
  (
    user: User,
    fetchToken: getAccessTokenSilently,
    condition?: boolean,
    ...args: any[]
  ): apiResult<T> & {
    refreshing: boolean;
  };
}

const fetcher = async (
  url: string,
  fetchToken: getAccessTokenSilently | null = null,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API;
  const headers: Record<string, string> = {};

  if (fetchToken) {
    const token = await fetchToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(api + url, {
    method: method,
    headers: headers,
  });

  if (!response.ok) {
    let error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    (error as any).info = await response.json();
    (error as any).status = response.status;
    throw error;
  }

  return (await response.json()).content;
};

/**
 * Get total sum donated to each charity
 *
 * @param {User} user - Which user's data to fetch
 * @param {String} fetchToken - Access token
 */
export const useAggregatedDonations = (
  user: User | undefined,
  fetchToken: getAccessTokenSilently,
) => {
  const { data, error, isValidating } = useSWR(
    user ? `/donors/${getUserId(user)}/donations/aggregated` : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

/**
 * Gets entire donation history
 *
 * @param {User} user - Which user's data to fetch
 * @param {String} getAccessTokenSilently - Retrieves access token
 * */
export const useDonations = (user: User | undefined, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    user ? `/donors/${getUserId(user)}/donations/` : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

/**
 * Gets distribution of money between organizations in a donation
 *
 * @param {User} user - Which user's data to fetch
 * @param {String} fetchToken - Access token
 * @param {boolean} condition -
 * @param {kids} string[] -
 * */
export const useDistributions = (
  user: User | undefined,
  fetchToken: getAccessTokenSilently,
  condition: boolean,
  kids: string[],
) => {
  const { data, error, isValidating } = useSWR(
    condition && user
      ? `/donors/${getUserId(user)}/distributions/?kids=${encodeURIComponent(
          Array.from(kids).join(","),
        )}`
      : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useAgreementsDistributions = (
  user: User | undefined,
  fetchToken: getAccessTokenSilently,
  condition: boolean,
  kids: string[],
) => {
  const { data, error, isValidating } = useSWR(
    condition && user
      ? `/donors/${getUserId(user)}/distributions/?kids=${encodeURIComponent(
          Array.from(kids).join(","),
        )}`
      : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useAvtalegiroAgreements = (
  user: User | undefined,
  fetchToken: getAccessTokenSilently,
) => {
  const { data, error, isValidating } = useSWR(
    user ? `/donors/${getUserId(user)}/recurring/avtalegiro/` : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useAutogiroAgreements = (
  user: User | undefined,
  fetchToken: getAccessTokenSilently,
) => {
  const { data, error, isValidating } = useSWR(
    user ? `/donors/${getUserId(user)}/recurring/autogiro/` : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useVippsAgreements = (user: User | undefined, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    user ? `/donors/${getUserId(user)}/recurring/vipps/` : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useAnonymousVippsAgreement = (agreementUrlCode: string) => {
  const { data, error, isValidating } = useSWR(
    `/vipps/agreement/anonymous/${agreementUrlCode}`,
    (url) => fetcher(url),
  );
  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useOrganizations = (fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(`/organizations/active/`, (url) =>
    fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useCauseAreas = (fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR<CauseArea[]>(`/causeareas/active/`, (url) =>
    fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useAllOrganizations = (fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(`/organizations/all/`, (url) =>
    fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useDonor = (user: User | undefined, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(user ? `/donors/${getUserId(user)}/` : null, (url) =>
    fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useTaxUnits = (user: User | undefined, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR<TaxUnit[]>(
    user ? `/donors/${getUserId(user)}/taxunits/` : null,
    (url) => fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const useYearlyTaxReports = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(`/donors/${getUserId(user)}/taxreports/`, (url) =>
    fetcher(url, fetchToken),
  );

  const loading = !data && !error;

  return {
    loading,
    isValidating,
    data,
    error,
  };
};

export const linksSelectorQuery = `
_type == 'navitem' => @ {
  ...,
  "slug": page->slug.current,
  "pagetype": page->_type,
},
_type == 'link' => @ {
  ...
},
`;

export const linksContentQuery = `links[] {
  ${linksSelectorQuery}
}`;

export const questionAndAnswerSelectionQuery = `
  ...,
  answers[] {
    ...,
    ${linksContentQuery}
} `;

export const pageContentQuery = `content[] {
  ...,
  blocks[] {
    _type == 'reference' => @->,
    _type == 'testimonials' =>  {
      ...,
      testimonials[]->,
    },
    _type == 'organizationslist' =>  {
      ...,
      organizations[]->,
    },
    _type == 'fullvideo' =>  {
      ...,
      video{
        asset->,
      },
    },
    _type == 'links' => {
      ...,
      ${linksContentQuery}
    },
    _type == 'questionandanswergroup' => {
      ${questionAndAnswerSelectionQuery}
    },
    _type == 'columns' => {
      ...,
      columns[] {
        ...,
        links[] {
          ${linksSelectorQuery}
        }
      }
    },
    _type == 'paragraph' => @ {
      ...,
      content[] {
        ...,
        markDefs[] {
          _type == 'citation' => @ {
            ...,
            "citations": citations[]->
          },
          ${linksSelectorQuery}
          _type != 'citation' => @ && _type != 'link' && _type != 'navitem',
        }
      }
    },
    _type == 'splitview' => {
      ...,
      ${linksContentQuery}
    },
    _type == 'wealthcalculator' => {
      ...,
      configuration->{
        ...,
        data_explanation {
          _type == 'reference' => @->{
            ...,
            blocks[] {
              _type == 'paragraph' => @ {
                ...,
                content[] {
                  ...,
                  markDefs[] {
                    _type == 'citation' => @ {
                      ...,
                      "citations": citations[]->
                    },
                    ${linksSelectorQuery}
                    _type != 'citation' => @ && _type != 'link' && _type != 'navitem',
                  }
                }
              },
            }
          },
        },
      },
      intervention_configuration {
        ...,
        output_configuration->{
          ...,
          explanation_links[] {
            ${linksSelectorQuery}
          },
        },
        "currency": *[ _type == "site_settings"][0].main_currency,
        "locale": *[ _type == "site_settings"][0].main_locale,
      },
      "currency": *[ _type == "site_settings"][0].main_currency,
      "locale": *[ _type == "site_settings"][0].main_locale,
    },
    _type == 'contributorlist' => {
      ...,
      role->,
      contributors[]->
    },
    _type == 'inngress' => {
      ...,
      sidelinks[] {
        ${linksSelectorQuery}
      },
    },
    _type == 'wealthcalculatorteaser' => {
      ...,
      button {
        ${linksSelectorQuery}
      },
      "locale": *[ _type == "site_settings"][0].main_locale,
    },
    _type == 'interventionwidget' => {
      ...,
      output_configuration->{
        ...,
        explanation_links[] {
          ${linksSelectorQuery}
        },
      },
      "currency": *[ _type == "site_settings"][0].main_currency,
      "locale": *[ _type == "site_settings"][0].main_locale,
    },
    _type == 'giftcardteaser' => {
      ...,
      image {
        asset->,
      },
      links[] {
        ${linksSelectorQuery}
      },
    },
    _type == 'giveblock' => {
      ...,
      "donate_label_short": *[ _type == "site_settings"][0].donate_label_short,
      "accent_color": *[ _type == "site_settings"][0].accent_color,
    },
    _type == 'teasers' => {
      ...,
      teasers[] {
        ...,
        image {
          asset->,
        },
        links[] {
          ${linksSelectorQuery}
        },
      },
    },
    _type == 'accordion' => {
      ...,
      blocks[] {
        _type == 'paragraph' => @ {
          ...,
          content[] {
            ...,
            markDefs[] {
              _type == 'citation' => @ {
                ...,
                "citations": citations[]->
              },
              ${linksSelectorQuery}
              _type != 'citation' => @ && _type != 'link' && _type != 'navitem',
            }
          }
        },
        _type != 'paragraph' => @,
      }
    },
    _type == 'philantropicteaser' => {
      ...,
      button {
        ...,
        link {
          ${linksSelectorQuery}
        },
      },
      people[]->,
    },
    _type != 'teasers' && _type != 'giveblock' && _type != 'links' && _type != 'questionandanswergroup' && _type != 'reference' && _type != 'testimonials' && _type != 'organizationslist' && _type != 'fullvideo' && _type!= 'paragraph' && _type != 'splitview' && _type != 'contributorlist' && _type != 'inngress' && _type != 'wealthcalculator' && _type != 'giftcardteaser' && _type != 'columns' && _type != 'interventionwidget' && _type != 'wealthcalculatorteaser' && _type != 'accordion' && _type != 'philantropicteaser' => @,
  }
},
`;
