import {
  checkPaymentDate,
  daysInMonth,
} from "../../../components/lists/agreementList/agreementDetails";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProfileInfo } from "../../../components/profile/profileInfo";
import { save } from "../../../components/profile/_queries";
import { useApi } from "../../../hooks/useApi";
import { useAuth0 } from "@auth0/auth0-react";
import { mocked } from "jest-mock";
import { Donor } from "../../../models";

jest.mock("../../../hooks/useApi");
jest.mock("@auth0/auth0-react");
jest.mock("../../../components/profile/_queries");
const mockedAuth0 = mocked(useAuth0, true);
const mockedUseApi = mocked(useApi, true);
const mockedSaveQuery = mocked(save, true);

const user = {
  email: "anniken.hoff@hotmail.com",
  email_verified: true,
  sub: "auth0|abcde",
};

describe("Check that checkPaymentDate() works", () => {
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

  it("if daysInMonth will return 28 when date is february 2022", () => {
    expect(daysInMonth(2, 2022)).toEqual(28);
  });

  it("if daysInMonth will return 31 when date is january 2022", () => {
    expect(daysInMonth(1, 2022)).toEqual(31);
  });

  it("if daysInMonth will return 30 when date is april 2022", () => {
    expect(daysInMonth(4, 2022)).toEqual(30);
  });

  it("if checkPaymentDate will return true when date = 28.04 and paymentDate = 2", () => {
    let today = new Date();
    today.setFullYear(2022, 3, 28);
    let currentPaymentDate = 2;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return true when date = 28.02 and paymentDate = 6", () => {
    let today = new Date();
    today.setFullYear(2022, 1, 28);
    let currentPaymentDate = 6;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return true when date = 31.12 and paymentDate = 3", () => {
    let today = new Date();
    today.setFullYear(2022, 11, 31);
    let currentPaymentDate = 3;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return true when date = 07.03 and paymentDate = 8", () => {
    let today = new Date();
    today.setFullYear(2022, 2, 7);
    let currentPaymentDate = 8;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(true);
  });

  it("if checkPaymentDate will return false when date = 07.03 and paymentDate = 6", () => {
    let today = new Date();
    today.setFullYear(2022, 2, 7);
    let currentPaymentDate = 6;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(false);
  });

  it("if checkPaymentDate will return false when date = 07.03 and paymentDate = 14", () => {
    let today = new Date();
    today.setFullYear(2022, 2, 7);
    let currentPaymentDate = 14;
    expect(checkPaymentDate(today, currentPaymentDate)).toBe(false);
  });
});
