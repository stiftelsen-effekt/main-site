export default {
  title: "Profile page",
  name: "profile",
  type: "document",
  fields: [
    {
      name: "tax",
      title: "Tax deduction",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "data",
      title: "Data policy",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "profile/profil",
    },
  ],
} as const;
