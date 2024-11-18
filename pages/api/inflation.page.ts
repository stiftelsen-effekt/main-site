import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function inflation(req: NextApiRequest, res: NextApiResponse) {
  let date = DateTime.local();

  const cacheKey = `inflation-${date.toFormat("yyyy-MM")}-${req?.query?.locale}`;

  const cachedInflation = await kv.get(cacheKey);
  if (cachedInflation) {
    return res
      .setHeader("Cache-Control", "public, max-age=86400")
      .status(200)
      .json(cachedInflation);
  }

  if (req?.query?.locale === "SV") {
    try {
      const inflation = await getSwedishInflation2017(date);
      await kv.set(cacheKey, inflation);
      return res.setHeader("Cache-Control", "public, max-age=86400").status(200).json(inflation);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  } else if (req?.query?.locale === "NO") {
    try {
      const inflation = await getNorwegianInflation2017(date);
      await kv.set(cacheKey, inflation);
      return res.setHeader("Cache-Control", "public, max-age=86400").status(200).json(inflation);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }
  return res.status(400).json({ error: "Invalid locale" });
}

const getNorwegianInflation2017 = async (date: DateTime) => {
  let attempts = 0;
  while (attempts < 12) {
    date = date.minus({ months: 1 });
    const inflation = await fetch(
      `https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen/_/service/mimir/kpi?startValue=100&startYear=2017&startMonth=01&endYear=${
        date.year
      }&endMonth=${date.month.toString().padStart(2, "0")}&language=nb`,
    );
    const json = await inflation.json();

    if ("change" in json && json.change !== "NaN") {
      // Percentage change from 2017
      return json.change;
    }
    attempts++;
  }

  throw new Error("Could not find inflation rate for NOK");
};

const getSwedishInflation2017 = async (date: DateTime) => {
  let attempts = 0;
  while (attempts < 12) {
    date = date.minus({ months: 1 });

    const inflation = await fetch(
      `https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/KPItotM`,
      {
        method: "POST",
        body: JSON.stringify({
          query: [
            {
              code: "ContentsCode",
              selection: {
                filter: "item",
                values: ["000004VU"],
              },
            },
            {
              code: "Tid",
              selection: {
                filter: "item",
                values: [`${date.year}M${date.month.toString().padStart(2, "0")}`, "2017M01"],
              },
            },
          ],
          response: {
            format: "json",
          },
        }),
      },
    );

    if (!inflation.ok) {
      continue;
    }

    const json = await inflation.json();

    if (json.data.length === 2) {
      // Percentage change from 2017
      return (json.data[1].values[0] - json.data[0].values[0]) / json.data[1].values[0];
    }

    attempts++;
  }

  throw new Error("Could not find inflation rate for SEK");
};
