import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProfileInfo } from "../../../components/profile/profileInfo";
import { save } from "../../../components/profile/_queries";
import { useApi } from "../../../hooks/useApi";
import { useAuth0 } from "@auth0/auth0-react";
import { mocked } from "jest-mock"
import { Donor } from "../../../models";

jest.mock("../../../hooks/useApi")
jest.mock("@auth0/auth0-react")
jest.mock("../../../components/profile/_queries")
const mockedAuth0 = mocked(useAuth0, true)
const mockedUseApi = mocked(useApi, true)
const mockedSaveQuery = mocked(save, true)

const donor: Donor = {
  email: "anniken.hoff@hotmail.com",
  id: "1348",
  name: "Anniken Hoff",
  newsletter: false,
  ssn: "123456789"
}

const user = {
  email: "anniken.hoff@hotmail.com",
  email_verified: true,
  sub: "auth0|abcde"
}

const userApiReturn = {
  loading: false,
  data: donor,
  error: null
}

describe("Profile info component", () => {
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
      handleRedirectCallback: jest.fn()
    })
  })

  it('Displays loading when fetching donor', () => {
    mockedUseApi.mockReturnValue({
      loading: true,
      data: null,
      error: null
    })
  
    const {queryByText} = render(
      <ProfileInfo />,
    );
  
    expect(queryByText(/Loading/i)).toBeTruthy()
  });
  
  
  it('Displays donor data when loaded', () => {
    mockedUseApi.mockReturnValue(userApiReturn)

    const {queryByText} = render(
      <ProfileInfo />,
    );
  
    expect(queryByText(/Anniken/i)).toBeTruthy()
  });
  
  it('Sends save request when button is clicked', async () => {
    mockedUseApi.mockReturnValue(userApiReturn);
    mockedSaveQuery.mockResolvedValue(donor)
  
    render(<ProfileInfo />);
    
    fireEvent.click(screen.getByRole(/submit/i))
    await waitFor(() => expect(mockedSaveQuery).toHaveBeenCalled())
    await waitFor(() => expect(screen.findByText("Endringene dine er lagret")).not.toEqual(null))
  });

  it('Fail sending save request when button is clicked', async () => {
    mockedUseApi.mockReturnValue(userApiReturn);
    mockedSaveQuery.mockResolvedValue(null)
  
    render(<ProfileInfo />);
    
    fireEvent.click(screen.getByRole(/submit/i))
    await waitFor(() => expect(mockedSaveQuery).toHaveBeenCalled())
    await waitFor(() => expect(screen.findByText("Noe gikk galt, prøv på nytt")).not.toEqual(null))
  });
})