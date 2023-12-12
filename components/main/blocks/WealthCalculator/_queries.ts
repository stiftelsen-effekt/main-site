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
