import { defineField } from "sanity";

export const outputTypeList = [
  "Bednets",
  "Deworming",
  "Cash",
  "Cash zakat",
  "Cash climate fund",
  "Vitamin A",
  "Malaria treatment",
  "Vaccinations",
  "Years of food fortification",
  "Operating funds",
];

export const outputType = defineField({
  type: "string",
  name: "outputType",
  title: "Output Type",
  options: {
    list: outputTypeList,
  },
});
