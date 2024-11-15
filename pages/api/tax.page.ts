import { kv } from "@vercel/kv";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";

export default async function tax(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request, missing request body" });
  }
  let income: number;
  try {
    income = JSON.parse(req.body).income;
    if (!income) {
      return res.status(400).json({ error: "Invalid request, missing income" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid request, invalid JSON" });
  }

  const cacheKey = `tax-${req.query.locale}-${income}`;
  const cachedTax = await kv.get(cacheKey);
  if (cachedTax !== null) {
    return res.status(200).json(cachedTax);
  }

  if (req?.query?.locale === "SV") {
    try {
      const result = await fetch(
        `https://app.skatteverket.se/rakna-skatt-client-skut-skatteutrakning/api/skatteberakning-fysisk/rakna-ut-skatt`,
        {
          body: getSVtaxBody(income),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      const data = await result.json();

      const finalTaxLeaf = data.leafs
        .find((node: any) => node.apiText === "resultatSkatteutrakningen")
        .leafs.find((leaf: any) => leaf.apiText === "slutligSkatt");

      if (!finalTaxLeaf || !finalTaxLeaf.value) {
        return res.status(500).json({ error: "Could not find final tax" });
      }
      const estimatedTax = finalTaxLeaf.value;
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
    inntektsaar: "2024",
    tekniskInntektsaar: 2023,
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
  const year = DateTime.local().year;

  return JSON.stringify({
    allmannaAvdrag: {
      socialforsakringsavgifter: null,
    },
    avdragKapital: {
      forlustAktierFondandelarMarknadsnoterade: null,
      forlustFondandelarInteMarknadsnoterade: null,
      forlustNaringsfastighetNaringsbostadsratt: null,
      forlustSmahusBostadsratt: null,
      investeraravdrag: null,
      ranteutgifter: null,
    },
    avdragTjanst: {
      dubbelBosattning: null,
      ovrigaUtgifterBrutto: null,
      resorTillOchFranArbetetBrutto: null,
      tjansteresor: null,
    },
    grunduppgifter: {
      fodelsear: 1996,
      inkomstar: year,
      kommunkod: null,
      prognos: true,
      skatteAvgiftssatser: {
        kommunalLandstingsSkattesats: 32.37,
        summaKommunalskattAvgifter: null,
      },
      showRegionalSkattereduktion: false,
      skattesatserTyp: "0",
    },
    tjansteinkomster: {
      hittillsUnderAret: {
        allmanPensionTjanstepensionHittills: null,
        avdragenSkatt: null,
        kostnadsersattningarHittills: null,
        loneinkomsterHittills: null,
        sjukAktivitetsersattningLonHittills: null,
        sjukAktivitetsersattningPensionHittills: null,
        sjukpenningAKassaMmHittills: null,
        period: {
          fromDate: DateTime.local().startOf("year").toISODate(),
          tomDate: DateTime.local().endOf("year").startOf("month").toISODate(),
        },
      },
      restenAvAret: {
        allmanPensionTjanstepensionResten: null,
        inkomstFrom: null,
        isHelar: true,
        kostnadsersattningarResten: null,
        loneinkomsterResten: Math.round(income).toString(),
        sjukAktivitetsersattningLonResten: null,
        sjukAktivitetsersattningPensionResten: null,
        sjukpenningAKassaMmResten: null,
        period: {
          fromDate: DateTime.local().endOf("year").startOf("month").toISODate(),
          tomDate: DateTime.local().endOf("year").startOf("month").toISODate(),
        },
      },
    },
    ovrigaTjansteinkomster: {
      ersattningFranVinstandelsstiftelseMmUtanPgiOchJobbskatteavdrag: null,
      hobbyinkomster: null,
      inkomsterFranFamansbolag: null,
      ovrigaInkomsterUtanPgi: null,
    },
    inkomsterKapital: {
      egenInbetalningSkatt: null,
      inkomstUthyrningPrivatbostad: null,
      inkomstrantor: null,
      inkomstrantorSkatteavdrag: null,
      trettioProcentAvInkomstrantorSkatteavdrag: null,
      inkomstrantorUtanSkatteavdrag: null,
      schablonintakt: null,
      vinstAktierFondandelarMarknadsnoterade: null,
      vinstFondandelarInteMarknadsnoterade: null,
      vinstNaringsfastighetNaringsbostadsratt: null,
      vinstSmahusBostadsratt: null,
    },
    naringsfastigheter: {
      underlagFastighetsavgift: {
        fastighetsavgiftHalvHyreshus: null,
        fastighetsavgiftHelHyreshus: null,
      },
      underlagFastighetsskatt: {
        fastighetsskattHyreshusTomt: null,
        fastighetsskattIndustri: null,
        fastighetsskattLokal: null,
        fastighetsskattVatten: null,
        fastighetsskattVind: null,
      },
    },
    naringsverksamhet: {
      aktivNaringsverksamhet: {
        overskottAktivNaringsverksamhet: null,
        sjukpenningAktivNaringsverksamhet: "",
      },
      allmannaAvdragDto: {
        allmantAvdragUnderskottNaringsverksamhet: null,
      },
      arbetsgivareSocialaAvgifter: {
        inkomsterIngaSocialaAvgifter: null,
        kostnaderIngaSocialaAvgifter: null,
      },
      avkastningsskattPensionskostnader: {
        underlagAvkastningsskattPension: null,
      },
      nedsattningEgenavgifter: {
        regionaltNedsattningsbelopp: null,
      },
      passivNaringsverksamhet: {
        overskottPassivNaringsverksamhet: null,
      },
      rantefordelning: {
        negativRantefordelning: null,
        positivRantefordelning: null,
      },
      sarskildLoneskattPensionskostnader: {
        underlagPensionskostnaderAnstallda: null,
        underlagPensionskostnaderEgen: null,
      },
      underlagExpansionsfondsskatt: {
        minskningExpansionsfond: null,
        okningExpansionsfond: null,
        underlagAterforingExpansionsfondsskatt: null,
      },
      skattereduktionForInvesteringarIInventarier: {
        underlagInvesteringarInventarier: null,
      },
    },
    skattOvrigt: {
      avrakningUtlandskSkatt: null,
      egenInbetalningSkatt: null,
      preliminarSkatt: null,
    },
    pensionsforhallandenKarensuppgifter: {
      allmanPensionHelaAret: false,
      antalDagarKarensEnDag: null,
      antalDagarKarensFjortonDagar: null,
      antalDagarKarensNittioDagar: null,
      antalDagarKarensSextioDagar: null,
      antalDagarKarensSjuDagar: DateTime.local().isInLeapYear ? 366 : 365,
      antalDagarKarensTrettioDagar: null,
      helSjukAktivitetsersattning: false,
      manuelltUnderlagForSlfPaAktivNrvJanTillJun2019: null,
    },
    smahusAgarlagenhet: {
      underlagFastighetsavgift: {
        fastighetsavgiftHalvSmahus: null,
        fastighetsavgiftHelSmahus: null,
        skrivenHelaAret: null,
        underlagSkattereduktionFastighetsavgiftHalvAvgift: "",
        underlagSkattereduktionFastighetsavgiftHelAvgift: "",
      },
      underlagFastighetsskatt: {
        fastighetsskattSmahusTomt: null,
      },
    },
    underlagSkattreduktion: {
      fackforeningsavgift: null,
      preliminarFornybarElkWh: null,
      rotarbeteFaktura: null,
      rutarbeteFaktura: null,
      rotarbeteForman: null,
      rutarbeteForman: null,
      gava: null,
      akassa: null,
      hasAvdragFromArbetsgivare: false,
      regionalSkattereduktion: false,
    },
    uppgifterAvlidnaSjomanUtInvandrade: {
      avlidenAr: null,
      bosattManader: "12",
      dagarFjarrfart: null,
      dagarNarfart: null,
      inUtvandrad: false,
      invandradManad: null,
      utvandradManad: null,
      folkbokford: true,
    },
    utlandskForsakringAvkastningsskatt: {
      skatteunderlagKapitalforsakring: null,
      skatteunderlagPensionsforsakring: null,
    },
  });
};
