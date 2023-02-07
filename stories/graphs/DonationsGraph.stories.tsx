import DonationsChart from "../../components/profile/donations/DonationsChart/DonationsChart";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Charts/DonationsChart",
  component: DonationsChart,
};

const distributions = [
  {
    org: "Against Malaria Foundation",
    sum: 200000,
  },
  {
    org: "Schistosomiasis Control Initiative",
    sum: 160000,
  },
  {
    org: "Drift",
    sum: 50000,
  },
];

const organizations = [
  {
    id: 1,
    name: "Against Malaria Foundation",
    abbriv: "AMF",
    shortDesc:
      "Against Malaria Foundation driver preventivt arbeid gjennom distribusjon av impregnerte malarianett. Studier viser at for 8kr beskyttes én person i minst ett år.",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 2,
    name: "SCI Foundation",
    abbriv: "SCI",
    shortDesc:
      "SCI Foundation bekjemper neglisjerte tropesykdommer som blant annet sneglefeber ved bruk av kostnadseffektive medisiner i Jemen og Afrika sør for Sahara.",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 3,
    name: "The End Fund",
    abbriv: "End",
    shortDesc: "end ",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 4,
    name: "Malaria Consortium",
    abbriv: "MC",
    shortDesc:
      "Malaria Consortium utfører seasonal malaria chemoprevention (SMC) som forhindrer smitte  i Afrika, studier viser at denne metoden er svært kostnadseffektiv.",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 5,
    name: "Deworm the World",
    abbriv: "DtW",
    shortDesc: "DtW",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 6,
    name: "Sightsavers",
    abbriv: "Sight",
    shortDesc: "Sight",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 7,
    name: "GiveDirectly",
    abbriv: "GD",
    shortDesc:
      "GiveDirectly utfører kontantoverføringer til ekstremt fattige i Kenya og Uganda, slik at mottakerne kan selv velge hvor de vil investere pengene sine.",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 8,
    name: "Project Healthy Children",
    abbriv: "PHC",
    shortDesc: "PhC",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 9,
    name: "No Lean Season",
    abbriv: "NLS",
    shortDesc: "NLS",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 10,
    name: "Helen Keller International",
    abbriv: "HKI",
    shortDesc:
      "Helen Keller International forebygger mangelsykdommer ved bruk av vitamin A-tilskudd, som er årsaken til halvparten av dødsfall blant barn under 5 år.",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 11,
    name: "Drift av Gi Effektivt",
    abbriv: "Drift",
    shortDesc: "Penger donert til oss brukes til videre drift og utvikling av våre tjenester. ",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 12,
    name: "GiveWell Top Charities Fund",
    abbriv: "TCF",
    shortDesc:
      "GiveWell gjør en kontinuerlig vurdering av saksområder for å finne de mest trengende sakene, pengene utdeles så kvartalsvis til de mest effektive organisasjonene.",
    standardShare: 100,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 13,
    name: "GiveDirectly Borgerlønn",
    abbriv: "UBI",
    shortDesc:
      "GiveDirectly utfører kontantoverføringer til ekstremt fattige, og driver dessuten et forsøksprosjekt med borgerlønn i Kenya (UBI). Velg dette alternativet om du vil støtte det prosjektet spesifikt.",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 14,
    name: "New Incentives",
    abbriv: "NI",
    shortDesc:
      "Når omsorgspersoner tar med et spedbarn til en klinikk for den første vaksinen, får de tilbud om å motta direkte kontantoverføringer hvis de fortsetter å komme tilbake i tråd med vaksinasjonsplanen.\n",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
  {
    id: 15,
    name: "GiveWell All Grants Fund",
    abbriv: "AGF",
    shortDesc: "AGF",
    standardShare: 0,
    infoUrl: "https://gieffektivt.no/topplista",
  },
];

export const Chart = () => (
  <DonationsChart distribution={distributions} organizations={organizations} />
);

export const Empty = () => <DonationsChart distribution={[]} organizations={organizations} />;
