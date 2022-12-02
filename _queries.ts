import { User } from "@auth0/auth0-react";
import useSWR from "swr";
import { apiResult, getAccessTokenSilently, useApi } from "./hooks/useApi";

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
  fetchToken: getAccessTokenSilently,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
) => {
  const token = await fetchToken();
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";
  const response = await fetch(api + url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (await response.json()).content;
};

/**
 * Get total sum donated to each charity
 *
 * @param {User} user - Which user's data to fetch
 * @param {String} fetchToken - Access token
 */
export const useAggregatedDonations = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    `/donors/${user["https://gieffektivt.no/user-id"]}/donations/aggregated`,
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
export const useDonations = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    `/donors/${user["https://gieffektivt.no/user-id"]}/donations/`,
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
  user: User,
  fetchToken: getAccessTokenSilently,
  condition: boolean,
  kids: string[],
) => {
  const { data, error, isValidating } = useSWR(
    condition
      ? `/donors/${user["https://gieffektivt.no/user-id"]}/distributions/?kids=${encodeURIComponent(
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
  user: User,
  fetchToken: getAccessTokenSilently,
  condition: boolean,
  kids: string[],
) => {
  const { data, error, isValidating } = useSWR(
    condition
      ? `/donors/${user["https://gieffektivt.no/user-id"]}/distributions/?kids=${encodeURIComponent(
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

export const useAvtalegiroAgreements = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    `/donors/${user["https://gieffektivt.no/user-id"]}/recurring/avtalegiro/`,
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

export const useVippsAgreements = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    `/donors/${user["https://gieffektivt.no/user-id"]}/recurring/vipps/`,
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

export const useOrganizations = (user: User, fetchToken: getAccessTokenSilently) => {
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

export const useDonor = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    `/donors/${user["https://gieffektivt.no/user-id"]}/`,
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

export const useTaxUnits = (user: User, fetchToken: getAccessTokenSilently) => {
  const { data, error, isValidating } = useSWR(
    `/donors/${user["https://gieffektivt.no/user-id"]}/taxunits/`,
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

export const linksContentQuery = `links[] {
  _type == 'navitem' => @ {
    ...,
    "slug": page->slug.current,
    "pagetype": page->_type,
  },
  _type == 'link' => @ {
    ...
  },
}`;

export const pageContentQuery = `content[] {
  ...,
  blocks[] {
    _type == 'reference' => @->,
    _type == 'testimonials' =>  {
      ...,
      testimonials[]->,
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
    _type == 'paragraph' => @ {
      ...,
      content[] {
        ...,
        markDefs[] {
          _type == 'citation' => @ {
            ...,
            "citations": citations[]->
          },
          _type != 'citation' => @,
        }
      }
    },
    _type != 'links' && _type != 'reference' && _type != 'testimonials' && _type != 'fullvideo' && _type!= 'paragraph' => @,
  }
},
`;

export const widgetQuery = `
  "widget": *[_type == "donationwidget"],
`;
