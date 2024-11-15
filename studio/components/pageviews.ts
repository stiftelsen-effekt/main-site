const cacheWithLocalStorage = {
  set: (key, data, expireInMinutes = 60) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + expireInMinutes * 60 * 1000,
      }),
    );
  },

  get: (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, expiresAt } = JSON.parse(item);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  createKey: (url, slugs) => `cache:${url}:${slugs.sort().join(",")}`,
};

async function fetchWithCache(url, { slugs = [], expireInMinutes = 60 } = {}) {
  const cache = await caches.open("plausible-api-cache");
  const cacheKey = cacheWithLocalStorage.createKey(url, slugs);

  const cachedData = cacheWithLocalStorage.get(cacheKey);
  if (cachedData && !isExpired(cachedData.timestamp, expireInMinutes)) {
    return cachedData;
  }

  try {
    const response = await fetch(
      url,
      getRequestOptions(
        slugs,
        process.env.SANITY_STUDIO_PLAUSIBLE_SITE,
        process.env.SANITY_STUDIO_PLAUSIBLE_TOKEN,
      ),
    );
    const data = await response.json();
    const views = data.results.reduce((acc: number, result: any) => acc + result.metrics[0], 0);

    if (response.ok) {
      cacheWithLocalStorage.set(cacheKey, views, expireInMinutes);
      return views;
    } else {
      console.error("Fetch error:", data);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

function createCacheKey(slugs) {
  return `views-${slugs.sort().join(",")}`;
}

async function getCachedData(cache, key) {
  const response = await cache.match(key);
  return response ? response.json() : null;
}

function isExpired(timestamp, expireInMinutes) {
  return Date.now() - timestamp > expireInMinutes * 60 * 1000;
}

function getRequestOptions(slugs: string[], site: string, token: string) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: `{"site_id":"${site}","metrics":["pageviews"],"dimensions":["event:page"],"date_range":"6mo","filters":[["is","event:page",["/${slugs.join(
      '","/',
    )}"]]]}`,
  };
}

export const fetchPageViews = async (slugs: string[]) => {
  try {
    return await fetchWithCache("https://plausible.io/api/v2/query", { slugs });
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
