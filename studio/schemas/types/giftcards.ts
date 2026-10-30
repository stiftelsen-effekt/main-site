import { defineType, defineField } from "sanity";
import { Gift } from "react-feather";

export default defineType({
  name: "giftcards",
  type: "document",
  title: "Gift cards",
  icon: Gift,
  fields: [
    defineField({
      name: "giftcards",
      type: "array",
      title: "Gift cards",
      of: [{ type: "giftcarditem" }],
    }),
  ],
  preview: {
    select: {
      giftcards: "giftcards",
    },
    prepare: ({ giftcards }) => ({
      title: "Gift cards",
      subtitle: giftcards ? `${giftcards.length} gift card(s)` : "0 gift cards",
    }),
  },
});
