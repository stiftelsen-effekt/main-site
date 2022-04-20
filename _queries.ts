import { User } from "@auth0/auth0-react";
import useSWR from "swr";
import { apiResult, getAccessTokenSilently, useApi } from "./hooks/useApi";
import { AggregatedDonations, AvtaleGiroAgreement, Distribution, Donation, Organization, VippsAgreement } from "./models";

export interface Query<T> {
  (user: User, fetchToken: getAccessTokenSilently, condition?: boolean, ...args: any[]): apiResult<T> & { refreshing: boolean }
};

const fetcher = async (url: string, fetchToken: getAccessTokenSilently, method: "GET" | "POST" | "PUT" | "DELETE" = "GET") => {
  const token = await fetchToken()
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || 'http://localhost:5050'
  const response = await fetch(api + url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return (await response.json()).content
} 

export const useAggregatedDonations = (user: User, fetchToken: getAccessTokenSilently) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(`/donors/${user["https://konduit.no/user-id"]}/donations/aggregated`, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useDonations = (user: User, fetchToken: getAccessTokenSilently) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(`/donors/${user["https://konduit.no/user-id"]}/donations/`, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useDistributions = (user: User, fetchToken: getAccessTokenSilently, condition: boolean, kids: string[]) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(condition ? `/donors/${user["https://konduit.no/user-id"]}/distributions/?kids=${encodeURIComponent(Array.from(kids).join(","))}` : null, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useAgreementsDistributions = (user: User, fetchToken: getAccessTokenSilently, condition: boolean, kids: string[]) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(condition ? `/donors/${user["https://konduit.no/user-id"]}/distributions/?kids=${encodeURIComponent(Array.from(kids).join(","))}` : null, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useAvtalegiroAgreements = (user: User, fetchToken: getAccessTokenSilently) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(`/donors/${user["https://konduit.no/user-id"]}/recurring/avtalegiro/`, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useVippsAgreements = (user: User, fetchToken: getAccessTokenSilently) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(`/donors/${user["https://konduit.no/user-id"]}/recurring/vipps/`, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useOrganizations = (user: User, fetchToken: getAccessTokenSilently) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(`/organizations/active/`, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}

export const useDonor = (user: User, fetchToken: getAccessTokenSilently) => {
  const {
    data, 
    error,
    isValidating
  } = useSWR(`/donors/${user["https://konduit.no/user-id"]}/`, url => fetcher(url, fetchToken))

  const loading = !data && !error

  return {
    loading,
    isValidating,
    data, 
    error
  }
}