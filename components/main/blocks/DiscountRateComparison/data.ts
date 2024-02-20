export const discountRateSensitivities = [
  { discountRate: 0, interventionType: "Malarianett", value: 0.128719 },
  { discountRate: 0, interventionType: "Kontantoverføringer", value: 0.003729 },
  { discountRate: 0, interventionType: "Ormekurer", value: 0.342701 },
  { discountRate: 0, interventionType: "Preventiv malariabehandling", value: 0.065577 },
  { discountRate: 0, interventionType: "A-vitamin", value: 0.143969 },
  { discountRate: 0, interventionType: "Vaksinasjoner", value: 0.049776 },
  { discountRate: 1, interventionType: "Malarianett", value: 0.106654 },
  { discountRate: 1, interventionType: "Kontantoverføringer", value: 0.003623 },
  { discountRate: 1, interventionType: "Ormekurer", value: 0.262179 },
  { discountRate: 1, interventionType: "Preventiv malariabehandling", value: 0.057494 },
  { discountRate: 1, interventionType: "A-vitamin", value: 0.137587 },
  { discountRate: 1, interventionType: "Vaksinasjoner", value: 0.048245 },
  { discountRate: 2, interventionType: "Malarianett", value: 0.091868 },
  { discountRate: 2, interventionType: "Kontantoverføringer", value: 0.003526 },
  { discountRate: 2, interventionType: "Ormekurer", value: 0.203679 },
  { discountRate: 2, interventionType: "Preventiv malariabehandling", value: 0.051717 },
  { discountRate: 2, interventionType: "A-vitamin", value: 0.133026 },
  { discountRate: 2, interventionType: "Vaksinasjoner", value: 0.047152 },
  { discountRate: 3, interventionType: "Malarianett", value: 0.082826 },
  { discountRate: 3, interventionType: "Kontantoverføringer", value: 0.003437 },
  { discountRate: 3, interventionType: "Ormekurer", value: 0.160561 },
  { discountRate: 3, interventionType: "Preventiv malariabehandling", value: 0.047526 },
  { discountRate: 3, interventionType: "A-vitamin", value: 0.129717 },
  { discountRate: 3, interventionType: "Vaksinasjoner", value: 0.04636 },
  { discountRate: 4, interventionType: "Malarianett", value: 0.076169 },
  { discountRate: 4, interventionType: "Kontantoverføringer", value: 0.003355 },
  { discountRate: 4, interventionType: "Ormekurer", value: 0.128323 },
  { discountRate: 4, interventionType: "Preventiv malariabehandling", value: 0.04444 },
  { discountRate: 4, interventionType: "A-vitamin", value: 0.127281 },
  { discountRate: 4, interventionType: "Vaksinasjoner", value: 0.045778 },
  { discountRate: 5, interventionType: "Malarianett", value: 0.071196 },
  { discountRate: 5, interventionType: "Kontantoverføringer", value: 0.003279 },
  { discountRate: 5, interventionType: "Ormekurer", value: 0.103879 },
  { discountRate: 5, interventionType: "Preventiv malariabehandling", value: 0.042136 },
  { discountRate: 5, interventionType: "A-vitamin", value: 0.125463 },
  { discountRate: 5, interventionType: "Vaksinasjoner", value: 0.045344 },
  { discountRate: 6, interventionType: "Malarianett", value: 0.06743 },
  { discountRate: 6, interventionType: "Kontantoverføringer", value: 0.003209 },
  { discountRate: 6, interventionType: "Ormekurer", value: 0.08509 },
  { discountRate: 6, interventionType: "Preventiv malariabehandling", value: 0.04039 },
  { discountRate: 6, interventionType: "A-vitamin", value: 0.124085 },
  { discountRate: 6, interventionType: "Vaksinasjoner", value: 0.045017 },
  { discountRate: 7, interventionType: "Malarianett", value: 0.064539 },
  { discountRate: 7, interventionType: "Kontantoverføringer", value: 0.003145 },
  { discountRate: 7, interventionType: "Ormekurer", value: 0.070455 },
  { discountRate: 7, interventionType: "Preventiv malariabehandling", value: 0.039051 },
  { discountRate: 7, interventionType: "A-vitamin", value: 0.123029 },
  { discountRate: 7, interventionType: "Vaksinasjoner", value: 0.044766 },
  { discountRate: 8, interventionType: "Malarianett", value: 0.062292 },
  { discountRate: 8, interventionType: "Kontantoverføringer", value: 0.003085 },
  { discountRate: 8, interventionType: "Ormekurer", value: 0.058911 },
  { discountRate: 8, interventionType: "Preventiv malariabehandling", value: 0.038009 },
  { discountRate: 8, interventionType: "A-vitamin", value: 0.122207 },
  { discountRate: 8, interventionType: "Vaksinasjoner", value: 0.044572 },
];

export const discountRateSensitivitiesInterventions = Array.from(
  new Set(discountRateSensitivities.map((sensitivity) => sensitivity.interventionType)),
);
export const discountRateSensitivitiesMap = discountRateSensitivities.reduce<{
  [key: number]: { [key: string]: number };
}>((acc, element) => {
  if (!acc[element.discountRate]) {
    acc[element.discountRate] = {};
  }
  acc[element.discountRate][element.interventionType] = element.value;
  return acc;
}, {});

export const getDefaultRunningAverages = () => {
  return discountRateSensitivitiesInterventions.reduce<{ [key: string]: number }>(
    (acc, intervention) => {
      acc[intervention] = 0;
      return acc;
    },
    {},
  );
};
