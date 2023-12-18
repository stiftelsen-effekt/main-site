import { DateTime } from "luxon";

export const getNorwegianTaxEstimate = async (income: number) => {
  const response = await fetch("https://skatteberegning.app.skatteetaten.no/2023", {
    method: "POST",
    body: JSON.stringify({
      skatteberegningsgrunnlag: {
        skatteberegningsgrunnlagsobjekt: [
          {
            tekniskNavn: "loennsinntektNaturalytelseMv",
            beloep: income.toString(),
          },
        ],
      },
      skatteplikt: {
        skattesubjekt: {
          personligSkattesubjekt: {
            skattepliktTilNorge: "GLOBAL",
            alderIInntektsaar: "27",
            tolvdelVedArbeidsoppholdINorge: "12",
          },
          skattested: "0301",
          skattestedITiltakssone: false,
        },
      },
    }),
  });

  const json = await response.json();

  return json.hovedperson.beregnetSkatt.beregnetSkatt;
};

export const getSwedishTaxEstimate = async (income: number) => {
  const response = await fetch(
    "https://corsproxy.io/?https://app.skatteverket.se/rakna-skatt-client-skut-skatteutrakning/api/skatteberakning-fysisk/rakna-ut-skatt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
          inkomstar: 2023,
          kommunkod: null,
          prognos: true,
          skatteAvgiftssatser: {
            avgiftssatsBegravningsavgift: 0.258,
            kommunalLandstingsSkattesats: 0.35,
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
            loneinkomsterHittills: income.toString(),
            sjukAktivitetsersattningLonHittills: null,
            sjukAktivitetsersattningPensionHittills: null,
            sjukpenningAKassaMmHittills: null,
            period: {
              fromDate: "2023-01-01",
              tomDate: "2023-11-01",
            },
          },
          restenAvAret: {
            allmanPensionTjanstepensionResten: null,
            inkomstFrom: "12",
            isHelar: false,
            kostnadsersattningarResten: null,
            loneinkomsterResten: null,
            sjukAktivitetsersattningLonResten: null,
            sjukAktivitetsersattningPensionResten: null,
            sjukpenningAKassaMmResten: null,
            period: {
              fromDate: "2023-12-01",
              tomDate: "2023-12-01",
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
          antalDagarKarensSjuDagar: 365,
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
      }),
    },
  );

  const json = await response.json();

  const finalTaxLeaf = json.leafs
    .find((node: any) => node.apiText === "resultatSkatteutrakningen")
    .leafs.find((leaf: any) => leaf.apiText === "slutligSkatt");
  return finalTaxLeaf ? finalTaxLeaf.value : null;
};

export type AdjustedPPPFactorResult = {
  adjustedPPPfactor: number;
  cumulativeInflation: number;
  pppFactor: number;
};

export const getNorwegianAdjustedPPPconversionFactor =
  async (): Promise<AdjustedPPPFactorResult> => {
    const cumulativeInflation = await getNorwegianInflation2017();
    const pppFactor = await getPPPfactor2017("NOR");

    const adjustedPPPfactor = pppFactor * (1 + cumulativeInflation);

    return {
      adjustedPPPfactor,
      cumulativeInflation,
      pppFactor,
    };
  };

export const getSwedishAdjustedPPPconversionFactor = async (): Promise<AdjustedPPPFactorResult> => {
  const cumulativeInflation = await getSwedishInflation2017();
  const pppFactor = await getPPPfactor2017("SE");

  const adjustedPPPfactor = pppFactor * (1 + cumulativeInflation);

  return {
    adjustedPPPfactor,
    cumulativeInflation,
    pppFactor,
  };
};

const getPPPfactor2017 = async (countryCode: string) => {
  const pppFactor = await fetch(
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/PA.NUS.PPP?date=2017:2017&format=json`,
  );

  const json = await pppFactor.json();

  console.log("2017 factor", json[1][0].value);

  return json[1][0].value;
};

const getNorwegianInflation2017 = async () => {
  let date = DateTime.local();

  let attempts = 0;
  while (attempts < 12) {
    date = date.minus({ months: 1 });
    const inflation = await fetch(
      `https://corsproxy.io/?https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen/_/service/mimir/kpi?startValue=100&startYear=2017&startMonth=90&endYear=${date.year}&endMonth=${date.month}&language=nb`,
    );
    const json = await inflation.json();

    if ("change" in json) {
      // Percentage change from 2017
      return json.change;
    }
    attempts++;
  }

  throw new Error("Could not find inflation rate for NOK");
};

const getSwedishInflation2017 = async () => {
  let date = DateTime.local();

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
