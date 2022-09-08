export {};
/*
import { GiveWellGrant, ImpactEvaluation } from "../../../../../models";

export interface DonationImpactCache<Data> {
  get(key: string): Data | undefined;
  set(key: string, value: Data): void;
  delete(key: string): void;
}

export const cacheStore: {
  evaluations: Array<ImpactEvaluation>;
  mostRecentEvaluationFetch: {
    year: number | undefined;
    month: number | undefined;
  };
  grants: Array<GiveWellGrant>;
  mostRecentGrantFetch: {
    year: number | undefined;
    month: number | undefined;
  };
} = {
  evaluations: [],
  mostRecentEvaluationFetch: {
    year: undefined,
    month: undefined,
  },
  grants: [],
  mostRecentGrantFetch: {
    year: undefined,
    month: undefined,
  },
};
export const ImpactCache: DonationImpactCache<any> = {
  get: (key: string) => {
    console.log(`Getting ${key} from cache`);

    let matchedYear = key.match(/donation_year=(\d+)/)?.[1];
    let matchedMonth = key.match(/donation_month=(\d+)/)?.[1];
    if (!matchedYear || !matchedMonth) return undefined;
    const year = parseInt(matchedYear);
    const month = parseInt(matchedMonth);

    if (key.match(/\/api\/evaluations/)?.[0]) {
      // MOST RECENT EVALUATION MUST BE BASED ON CHARITY KEY AS WELL
      // LOGIC FOR CHARITY KEY IS MISSING

      if (
        !cacheStore.mostRecentEvaluationFetch.year ||
        !cacheStore.mostRecentEvaluationFetch.month
      ) {
        console.log("No most recent evaluation set");
        return undefined;
      }

      if (
        year > cacheStore.mostRecentEvaluationFetch.year ||
        (year == cacheStore.mostRecentEvaluationFetch.year &&
          month > cacheStore.mostRecentEvaluationFetch.month)
      ) {
        return undefined;
      }

      // filter evaluations to evaluations before year and month
      const filteredEvaluations = cacheStore.evaluations.filter((evaluation) => {
        return (
          evaluation.start_year < year ||
          (evaluation.start_year == year && evaluation.start_month < month)
        );
      });

      if (filteredEvaluations.length > 0)
        return { evaluations: [filteredEvaluations[filteredEvaluations.length - 1]] };
      else return undefined;
    } else if (key.match(/\/api\/max_impact_fund_grants/)?.[0]) {
      if (!cacheStore.mostRecentGrantFetch.year || !cacheStore.mostRecentGrantFetch.month) {
        console.log("No most recent grant set");
        return undefined;
      }

      if (
        year > cacheStore.mostRecentGrantFetch.year ||
        (year == cacheStore.mostRecentGrantFetch.year &&
          month > cacheStore.mostRecentGrantFetch.month)
      ) {
        return undefined;
      }

      // filter grants to grants before year and month
      const filteredGrants = cacheStore.grants.filter((grant) => {
        return grant.start_year < year || (grant.start_year == year && grant.start_month < month);
      });

      if (filteredGrants.length > 0) {
        console.log("CACHE HIT FOR GRANT FETCH");
        return { max_impact_fund_grants: [filteredGrants[filteredGrants.length - 1]] };
      } else return undefined;
    }
  },
  set: (key: string, value: any) => {
    console.log(`setting cache for ${key}`, value);

    if (!value.max_impact_fund_grants && !value.evaluations) return undefined;

    let matchedYear = key.match(/donation_year=(\d+)/)?.[1];
    let matchedMonth = key.match(/donation_month=(\d+)/)?.[1];
    console.log(matchedYear, matchedMonth);
    if (!matchedYear || !matchedMonth) return undefined;
    const year = parseInt(matchedYear);
    const month = parseInt(matchedMonth);

    if (key.match(/\/api\/evaluations/)?.[0]) {
      if (
        !cacheStore.mostRecentEvaluationFetch.year ||
        !cacheStore.mostRecentEvaluationFetch.month
      ) {
        cacheStore.mostRecentEvaluationFetch.year = year;
        cacheStore.mostRecentEvaluationFetch.month = month;
      } else if (
        year > cacheStore.mostRecentEvaluationFetch.year ||
        (year == cacheStore.mostRecentEvaluationFetch.year &&
          month > cacheStore.mostRecentEvaluationFetch.month)
      ) {
        cacheStore.mostRecentEvaluationFetch.year = year;
        cacheStore.mostRecentEvaluationFetch.month = month;
      }

      cacheStore.evaluations.push(value.evaluations[0]);
    } else if (key.match(/\/api\/max_impact_fund_grants/)?.[0]) {
      if (!cacheStore.mostRecentGrantFetch.year || !cacheStore.mostRecentGrantFetch.month) {
        cacheStore.mostRecentGrantFetch.year = year;
        cacheStore.mostRecentGrantFetch.month = month;
      } else if (
        year > cacheStore.mostRecentGrantFetch.year ||
        (year == cacheStore.mostRecentGrantFetch.year &&
          month > cacheStore.mostRecentGrantFetch.month)
      ) {
        cacheStore.mostRecentGrantFetch.year = year;
        cacheStore.mostRecentGrantFetch.month = month;
      }

      cacheStore.grants.push(value.max_impact_fund_grants[0]);

      console.log(cacheStore);
    }
  },
  delete: (key: string) => {
    console.error("Not implemented");
  },
};
*/
