import { kv } from "@vercel/kv";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";

export default async function tax(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request, missing request body" });
  }
  let income: number = req.body.income;
  if (!income) {
    return res.status(400).json({ error: "Invalid request, missing income" });
  }

  const year = DateTime.now().year.toString();

  const cacheKey = `tax-${req.query.locale}-${income}-${year}`;
  const cachedTax = await kv.get(cacheKey);
  if (cachedTax !== null) {
    return res.status(200).json(cachedTax);
  }

  if (req?.query?.locale === "SV") {
    try {
      const result = await fetch(
        `https://www7.skatteverket.se/portal-wapi/open/skatteberakning/v1/api/skattetabell/2025/beraknaSkatteavdrag`,
        {
          body: getSVtaxBody(income / 12),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      const data = await result.json();

      const estimatedTax = data.skatteavdrag * 12;
      await kv.set(cacheKey, estimatedTax);
      return res.status(200).json(estimatedTax);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  } else if (req?.query?.locale === "NO") {
    try {
      const result = await fetch(
        `https://skattekalkulator.formueinntekt.skatt.skatteetaten.no/api/skattemelding-core/skatteberegner`,
        {
          body: getNOTaxBody(income),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      const data = await result.json();
      const estimatedTax = data.beregningsresultat.beregnetSkatt.beregnetSkatt;
      await kv.set(cacheKey, estimatedTax);
      return res.status(200).json(estimatedTax);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }
  return res.status(400).json({ error: "Invalid locale" });
}

const getNOTaxBody = (income: number): string => {
  return JSON.stringify({
    inntektsaar: "2025",
    tekniskInntektsaar: 2024,
    visningsdata: {
      arbeidsgiver: [
        {
          digest: "a1c6687301bb5a7a177c05743539babb",
          id: "arbeidsgiver-id-1",
          organisasjonsnavn: "arbeidsgiver",
          samledeYtelserFraArbeidsgiverPerBehandlingsart: [
            {
              behandlingsart: "LONN",
              beloep: {
                beloep: "0",
                beloepIValuta: Math.round(income).toString(),
                valutakurs: "1",
                valutakode: "NOK",
                trygdeEllerSkattemessigUnntak: "",
                metodeVedDobbeltbeskatning: "",
              },
              id: "loennstype-id-1",
            },
          ],
        },
      ],
      inntektsaar: "2024",
      konto: [
        {
          bankensNavn: "bankensNavn",
          digest: "f18932676174cc9958ac7aa4c94a367d",
          id: "konto-id-1",
          innskudd: {
            beloep: "0",
            beloepIValuta: "0",
            valutakurs: "1",
          },
          kontonummer: "kontonr",
        },
      ],
      partsnummer: "0",
      skatteplikt: {
        skattepliktTilNorge: "global",
        skattested: "0301",
        tolvdelVedArbeidsoppholdINorge: "12",
      },
    },
    skatteplikt: {
      alder: 28,
      skattestedITiltakssone: false,
    },
  });
};

const getSVtaxBody = (income: number): string => {
  return JSON.stringify({
    skattesats: 31,
    inkomst: income,
    fodelsear: 1996,
    typ: "L",
  });
};
