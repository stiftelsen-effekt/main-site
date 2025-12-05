import { defineField } from "sanity";

export const transactionCostField = defineField({
  name: "transaction_cost",
  title: "Transaction cost",
  type: "object",
  description: "Optional transaction fee configuration used when calculating payment nudges.",
  fields: [
    defineField({
      name: "percentage_fee",
      title: "Percentage fee",
      type: "number",
      description: "Percentage fee charged per donation (e.g. 1.75 for 1.75%).",
    }),
    defineField({
      name: "fixed_fee",
      title: "Fixed fee",
      type: "number",
      description: "Flat fee charged per donation.",
    }),
  ],
});
