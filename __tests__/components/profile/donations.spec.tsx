import DonationYearMenu from "../../../components/profile/donations/YearMenu/YearMenu";
import { render } from "@testing-library/react";

const donations = [
  {
    id: 68310,
    donor: "KC",
    donorId: 2349,
    email: "kcesmena@gmail.com",
    sum: "3200.00",
    transactionCost: null,
    timestamp: "2022-03-22T09:09:30.000Z",
    paymentMethod: "Vipps",
    KID: "11066833",
  },
  {
    id: 68322,
    donor: "KC",
    donorId: 2349,
    email: "kcesmena@gmail.com",
    sum: "7500.00",
    transactionCost: null,
    timestamp: "2022-03-21T09:09:30.000Z",
    paymentMethod: "AvtaleGiro",
    KID: "51810198",
  },
  {
    id: 68312,
    donor: "KC",
    donorId: 2349,
    email: "kcesmena@gmail.com",
    sum: "200.00",
    transactionCost: null,
    timestamp: "2020-03-22T09:09:30.000Z",
    paymentMethod: "Vipps",
    KID: "59488197",
  },
];

const distributions = [
  {
    org: "GiveWells tildelingsfond",
    sum: 5000.0,
  },
  {
    org: "Against Malaria Foundation",
    sum: 2500.0,
  },
];

const years = [2022, 2021, 2020];

const userApiReturn = {
  loading: false,
  data: donations,
  error: null,
};

describe("Overview over donation history", () => {
  beforeEach(() => {});

  it("Should display all years supplied in donation year meny", () => {
    const { queryByText } = render(
      <DonationYearMenu years={years} selected={"2020"}></DonationYearMenu>,
    );
    years.forEach((year) => expect(queryByText(new RegExp(year.toString()))).toBeTruthy());
    //expect(menu.find(".menu-selected").text()).toBe("2020");
  });

  it("Should display total as selected when selected", () => {
    const { queryByText } = render(
      <DonationYearMenu years={years} selected={"total"}></DonationYearMenu>,
    );
    expect(queryByText(new RegExp("Totalt"))).toBeTruthy();
  });
});
