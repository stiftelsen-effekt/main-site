import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../../../hooks/useApi";
import { Donor } from "../../../models";
import { mocked } from "jest-mock";
import DonationsTotals from "../../../components/profile/donations/donationsTotal";
import Enzyme, { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DonationYearMenu from "../../../components/profile/donations/yearMenu";
import Home from "../../../pages/profile/index";

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
  registered: "2018-02-07T11:25:59.000Z",
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

const aggregated = [
  {
    organizationId: 12,
    organization: "GiveWells tildelingsfond",
    abbriv: "GiveWell",
    value: "419836.780000000000000000",
    year: 2022,
  },
  {
    organizationId: 1,
    organization: "Against Malaria Foundation",
    abbriv: "AMF",
    value: "406094.000000000000000000",
    year: 2022,
  },
];

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
  // Enzyme.configure({ adapter: new Adapter() });
  it("Check that the year menu is correct", () => {
    // const home = require("../../../pages/profile/index");
    // const home = mount(<Home />);
    // const years = jest.spyOn(home, "getYears");
    // expect(years).toHaveBeenCalled();
    // const yearMenu = shallow(
    //   <DonationYearMenu years={years} selected={"total"} />
    // );
    // console.log(yearMenu.text());
    // years.mockRestore();
  });

  it("Distribution table should be correct", () => {
    // const distTable = shallow(<DonationsDistributionTable distributions={}/>);
    // DonationsDistributionTable
  });

  it("Check that DonationsTotals is correct", () => {
    const sum = 0;
    const periodText = "lol";
    const donationsTotal = shallow(
      <DonationsTotals sum={sum} period={periodText} comparison={""} />
    );

    expect(donationsTotal.text().includes("lol")).toBe(true);
  });
});
