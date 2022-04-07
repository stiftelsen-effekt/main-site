import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../../../hooks/useApi";
import { Donor } from "../../../models";
import { mocked } from "jest-mock";
import DonationsTotals from "../../../components/profile/donations/donationsTotal";
import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DonationYearMenu from "../../../components/profile/donations/yearMenu";
import DonationsDistributionTable from "../../../components/profile/donations/donationsDistributionTable";
import Home from "../../../pages/profile/index";
import { thousandize } from "../../../util/formatting";
import DonationsChart from "../../../components/profile/donations/donationsChart";

jest.mock("../../../hooks/useApi");
jest.mock("@auth0/auth0-react");
jest.mock("../../../pages/profile/index");
const mockedAuth0 = mocked(useAuth0, true);
const mockedUseApi = mocked(useApi, true);

const donor: Donor = {
  email: "kcesmena@gmail.com",
  id: "2349",
  name: "Keith Charlene Tan Esmena",
  newsletter: false,
  ssn: "987654321",
  registered: "2020-02-07T11:25:59.000Z",
};

const user = {
  email: "kcesmena@gmail.com",
  email_verified: true,
  sub: "auth0|abcde",
};

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
  beforeEach(() => {
    mockedAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenWithPopup: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
      isLoading: false,
      buildAuthorizeUrl: jest.fn(),
      buildLogoutUrl: jest.fn(),
      handleRedirectCallback: jest.fn(),
    });
  });

  configure({ adapter: new Adapter() });

  it("Check that all years show in the menu", () => {
    mockedUseApi.mockReturnValue(userApiReturn);

    const menu = shallow(
      <DonationYearMenu years={years} selected={"2020"}></DonationYearMenu>
    );
    years.forEach((year) =>
      expect(menu.html().includes(year.toString())).toBeTruthy()
    );
    expect(menu.find(".menu-selected").text()).toBe("2020");

    const menuTotal = shallow(
      <DonationYearMenu years={years} selected={"total"}></DonationYearMenu>
    );
    expect(menuTotal.find(".menu-selected").text()).toBe("Totalt");
  });

  it("Distribution table should be correct", () => {
    mockedUseApi.mockReturnValue(userApiReturn);
    const distTable = shallow(
      <DonationsDistributionTable
        distribution={distributions}
      ></DonationsDistributionTable>
    );

    const table = distTable.find("table");
    expect(table.find("tbody").text()).not.toBe("");
    const rows = table.find("tr");
    expect(rows).toHaveLength(distributions.length);

    /**
     * Checks if the content in the table rows matches the distributions
     *
     * @param {ShallowWrapper} row - Total sum donated to certain organization in table
     */
    function check(row: ShallowWrapper) {
      const rowText = row.text();
      const result = distributions.find(
        (distr) =>
          rowText.includes(distr.org) &&
          rowText.includes(thousandize(distr.sum))
      );
      expect(result).toBeDefined();
    }
    rows.forEach((row) => check(row));
  });

  it("Check that total donations is correct", () => {
    mockedUseApi.mockReturnValue(userApiReturn);
    let sum = 0;
    distributions.forEach((distribution) => (sum += distribution.sum));
    const periodText = `Siden ${years.pop()} har du gitt `;
    const donationsTotal = shallow(
      <DonationsTotals sum={sum} period={periodText} comparison={""} />
    );

    expect(
      donationsTotal.text().includes("Siden 2020 har du gitt 7 500 kr")
    ).toBeTruthy();
  });
});
