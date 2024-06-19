import { User } from "react-feather";

export default {
  name: "contributorlist",
  type: "document",
  title: "Contributors",
  icon: User,
  validation: (Rule: any) =>
    Rule.custom(async (fields: any) => {
      /* TODO: migrate */
      /*
      const referencedContributors: any[] = await client.fetch(
        `*[_id in ${JSON.stringify(fields.contributors.map((c: any) => c._ref))}]`,
      );

      if (referencedContributors.some((c: any) => c.role._ref !== fields.role._ref)) {
        return "All contributors added must have the role selected in the role field for the list.";
      } else {
        return true;
      }
      */
      return true;
    }),
  fields: [
    {
      name: "role",
      type: "reference",
      to: [{ type: "role" }],
      title: "Role",
    },
    {
      name: "contributors",
      type: "array",
      title: "Contributors",
      of: [
        {
          type: "reference",
          to: [{ type: "contributor" }],
        },
      ],
    },
    {
      name: "displayimages",
      type: "boolean",
      title: "Display Images",
    },
  ],
  preview: {
    select: {
      title: "role.title",
      name0: "contributors.0.name",
      name1: "contributors.1.name",
      name2: "contributors.2.name",
      name3: "contributors.3.name",
      name4: "contributors.4.name",
      name5: "contributors.5.name",
    },
    prepare: ({
      title,
      name0,
      name1,
      name2,
      name3,
      name4,
      name5,
    }: {
      title: string;
      name0: string;
      name1: string;
      name2: string;
      name3: string;
      name4: string;
      name5: string;
    }) => {
      const names = [name0, name1, name2, name3, name4, name5].filter(Boolean);
      return {
        title: title,
        subtitle: names.join(", "),
      };
    },
  },
} as const;
