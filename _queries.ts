import { User } from "@auth0/auth0-react";
import { apiResult, getAccessTokenSilently, useApi } from "./hooks/useApi";
import { AggregatedDonations, AvtaleGiroAgreement, Distribution, Donation, Organization, VippsAgreement } from "./models";

export interface Query<T> {
  (user: User, fetchToken: getAccessTokenSilently, condition?: boolean, ...args: any[]): apiResult<T> & { refreshing: boolean }
};

export const useAggregatedDonations:Query<AggregatedDonations[]> = (user, fetchToken) => {
  const {
    loading,
    data,
    error
  } = useApi<AggregatedDonations[]>(
    `/donors/${user["https://konduit.no/user-id"]}/donations/aggregated`,
    "GET",
    "read:donations",
    fetchToken
  );

  const cacheKey = "aggregatedDonationsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error };
}

export const useDonations: Query<Donation[]> = (user, fetchToken) => {
  const {
    loading,
    data,
    error,
  } = useApi<Donation[]>(
    `/donors/${user["https://konduit.no/user-id"]}/donations/`,
    "GET",
    "read:donations",
    fetchToken
  );

  const cacheKey = "donationsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error };
}

export const useDistributions: Query<Distribution[]> = (user, fetchToken, condition, kids: string[]) => {
  const {
    loading,
    data,
    error
  } = useApi<Distribution[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/distributions/?kids=${encodeURIComponent(Array.from(kids).join(","))}`,
    "GET",
    "read:donations",
    fetchToken,
    condition
  );

  const cacheKey = "distributionsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error }
}

export const useAgreementsDistributions: Query<Distribution[]> = (user, fetchToken, condition, kids: string[]) => {
  const {
    loading,
    data,
    error
  } = useApi<Distribution[]>(
    `/donors/${ user["https://konduit.no/user-id"]}/distributions/?kids=${encodeURIComponent(Array.from(kids).join(","))}`,
    "GET",
    "read:donations",
    fetchToken,
    condition
  );

  const cacheKey = "agreementsDistributionsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error }
}

export const useAvtalegiroAgreements: Query<AvtaleGiroAgreement[]> = (user, fetchToken) => {
  const {
    loading,
    data,
    error,
  } = useApi<AvtaleGiroAgreement[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/recurring/avtalegiro/`,
    "GET",
    "read:donations",
    fetchToken
  );

  const cacheKey = "avtalegiroAgreementsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error }
}

export const useVippsAgreements: Query<VippsAgreement[]> = (user, fetchToken) => {
  const {
    loading,
    data,
    error,
  } = useApi<VippsAgreement[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/recurring/vipps/`,
    "GET",
    "read:donations",
    fetchToken
  );

  const cacheKey = "vippsAgreementsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error }
}

export const useOrganizations: Query<Organization[]> = (user, fetchToken) => {
  const {
    loading,
    data,
    error,
  } = useApi<Organization[]>(
    `/organizations/active/`,
    "GET",
    "read:donations",
    fetchToken
  );

  const cacheKey = "organizationsCache"
  let cache = localStorage.getItem(cacheKey)

  if (cache && loading)
    return { loading: false, data: JSON.parse(cache), refreshing: true, error }

  if (!loading && data)
    localStorage.setItem(cacheKey, JSON.stringify(data))

  return { loading, data, refreshing: false, error }
}