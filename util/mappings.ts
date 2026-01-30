export const mapNameToOrgAbbriv = (name: string): string => {
  const map = {
    "Against Malaria Foundation": "AMF",
    "SCI Foundation": "SCI",
    GiveDirectly: "GD",
    "GiveDirectly Borgerlønn": "UBI",
    "Helen Keller International": "HKI",
    "New Incentives": "NI",
    "The End Fund": "END",
    "Deworm the World": "DTW",
    Sightsavers: "SS",
    Drift: "Drift",
    "GiveWell Top Charities Fund": "GiveWell",
    "Malaria Consortium": "MC",
    "Project Healthy Children": "PHC",
    "GiveDirectly Zakat-fond": "GDZF",
    "Drift av Gi Effektivt": "Drift",
    "GiveWell All Grants Fund": "AGF",
    "Family Empowerment Media": "FEM",
    "GiveDirectly Climate Survival Fund": "GDCSF",

    "Giv Effektivts anbefaling": "GE-SMART",
    "Stor og velkendt effekt": "GE-SMART",
    "Myggenet mod malaria": "GE-MYGMAL",
    "Medicin mod malaria": "GE-MEDMAL",
    "Vitamin mod mangelsygdomme": "GE-VIT",
    "Vacciner til spædbørn": "GE-VAC",
    "Kontantoverførsler til verdens fattigste": "GE-CASH",
    Ormekur: "GE-ORM",
    "Giv Effektivts arbejde og vækst": "GE-DRIFT",
  };
  return (map as { [key: string]: string })[name] ?? name;
};
