import { defineField } from "sanity";

export const outputType = defineField({
  type: "string",
  name: "outputType",
  title: "Output Type",
  options: {
    list: [
      "Bednets",
      "Deworming",
      "Cash",
      "Cash zakat",
      "Cash climate fund",
      "Vitamin A",
      "Malaria treatment",
      "Vaccinations",
      "Years of food fortification",
    ],
  },
});
