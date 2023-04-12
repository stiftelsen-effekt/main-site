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
    "GiveDirectly Zakat-fond": "GDZF,
    "Drift av Gi Effektivt": "Drift",
  };
  return (map as { [key: string]: string })[name];
};
