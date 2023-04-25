import { List } from "react-feather";
import { OrganizationsListPreview } from "../../components/organizationsListPreview";

export default {
  name: "organizationslist",
  type: "object",
  title: "Organizations list",
  icon: List,
  fields: [
    {
      name: "organizations",
      title: "Organizations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "organization" }] }],
    },
  ],
  preview: {
    select: {
      organization1name: "organizations.1.name",
      organization2name: "organizations.2.name",
      organization3name: "organizations.3.name",
      organization4name: "organizations.4.name",
      organization5name: "organizations.5.name",
      organization1oneliner: "organizations.1.oneliner",
      organization2oneliner: "organizations.2.oneliner",
      organization3oneliner: "organizations.3.oneliner",
      organization4oneliner: "organizations.4.oneliner",
      organization5oneliner: "organizations.5.oneliner",
    },
    prepare: ({
      organization1name,
      organization2name,
      organization3name,
      organization4name,
      organization5name,
      organization1oneliner,
      organization2oneliner,
      organization3oneliner,
      organization4oneliner,
      organization5oneliner,
    }: {
      organization1name: string;
      organization2name: string;
      organization3name: string;
      organization4name: string;
      organization5name: string;
      organization1oneliner: string;
      organization2oneliner: string;
      organization3oneliner: string;
      organization4oneliner: string;
      organization5oneliner: string;
    }) => {
      const names = [
        organization1name,
        organization2name,
        organization3name,
        organization4name,
        organization5name,
      ].filter(Boolean);
      const oneliners = [
        organization1oneliner,
        organization2oneliner,
        organization3oneliner,
        organization4oneliner,
        organization5oneliner,
      ].filter(Boolean);
      return {
        organizations: names.map((name, index) => ({
          name,
          oneliner: oneliners[index],
        })),
      };
    },
    component: OrganizationsListPreview,
  },
} as const;
