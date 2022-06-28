import DonationYearMenu from "../../components/profile/donations/YearMenu/YearMenu";

const years = [2022, 2021, 2020, 2019, 2018];

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Controls/DonationYearMenu",
  component: DonationYearMenu,
  argTypes: {
    selected: {
      options: [...years.map((year) => year.toString()), "total"],
      control: { type: "select" },
      defaultValue: "total",
    },
  },
};

export const Menu = ({ ...args }) => <DonationYearMenu years={years} selected={args.selected} />;
